# OpenAI rozpoznání (MySCANNER, etapa 7)

Konfigurace skutečného rozpoznání dokumentů, výběr modelu a bezpečnost API klíče (PRD § 4–5, plán etapa 7).

## Režimy

| Režim | Podmínka | Poznámka |
|--------|-----------|----------|
| **Mock** | Není nastavena `EXPO_PUBLIC_MYSCANNER_PROXY_URL` ani `EXPO_PUBLIC_OPENAI_API_KEY`, nebo je `EXPO_PUBLIC_MYSCANNER_USE_MOCK=true` | Bez sítě, vhodné pro demo a CI. |
| **Proxy** | Nastavena `EXPO_PUBLIC_MYSCANNER_PROXY_URL` | Doporučeno pro **produkci**: klient posílá jen obrázek na váš HTTPS endpoint; OpenAI klíč drží server. |
| **OpenAI přímo** | Nastaven `EXPO_PUBLIC_OPENAI_API_KEY` a není aktivní proxy | Vhodné **jen pro lokální vývoj**. Hodnota `EXPO_PUBLIC_*` se při buildu vloží do balíčku – nevhodné pro veřejné nebo produkční buildy. |

Priorita: vynucený mock → proxy (pokud je URL) → přímý OpenAI klíč → mock.

## Proměnné prostředí (Expo)

### Proč `EXPO_PUBLIC_` a ne tajný „serverový“ `.env`?

Aplikace běží na telefonu / v bundlu Metro. Hodnoty z kódu **nejde schovat** – kdokoli může rozbalit APK nebo přečíst JS. Proto Expo do klientského kódu propouští jen proměnné s prefixem `EXPO_PUBLIC_` a **vloží je při bundlování jako řetězce**. To není zvláštnost „kvůli Expo“, ale kvůli mobilnímu klientovi; pro produkci proto dává smysl **proxy** a klíč jen na serveru.

### Kde dát `.env`

`mobile/app.config.js` načte v tomto pořadí:

1. **`.env` v kořeni repozitáře** (nad `mobile/`) – vhodné, když máte jeden společný soubor pro celý projekt.
2. **`mobile/.env`** – pokud existuje, **přepíše** stejné klíče z kořenového souboru.

Obojí necommitujte (`.gitignore` už má `.env`). Spouštějte Expo z adresáře `mobile` (`npx expo start`).

### Pořád vidím ukázková data (mock)

1. **`.env` může být v kořeni repozitáře nebo ve `mobile/`** (viz výše). Zkontrolujte cestu a že řádek s klíčem nemá mezery kolem `=`.
2. V `.env` musí být např. `EXPO_PUBLIC_OPENAI_API_KEY=sk-...` (bez uvozovek) nebo `EXPO_PUBLIC_MYSCANNER_PROXY_URL=https://...`.
3. Po změně `.env` **úplně zastavte Metro** a spusťte znovu `npx expo start --clear` (jinak zůstane starý bundle bez proměnných).
4. Není v `.env` náhodou `EXPO_PUBLIC_MYSCANNER_USE_MOCK=true`? To vynucuje mock.
5. Režim (mock vs. síť) ověřte podle `.env` a textu při zpracování na obrazovce výsledku (u sítě je zmínka o odeslání mimo zařízení).

| Proměnná | Účel |
|----------|------|
| `EXPO_PUBLIC_MYSCANNER_USE_MOCK` | `1` nebo `true` = vždy mock. |
| `EXPO_PUBLIC_MYSCANNER_PROXY_URL` | Plná URL `POST` endpointu vlastní proxy. |
| `EXPO_PUBLIC_MYSCANNER_PROXY_BEARER_TOKEN` | Volitelně: hlavička `Authorization: Bearer …` k proxy. |
| `EXPO_PUBLIC_OPENAI_API_KEY` | Klíč pro přímé volání API (jen dev). |
| `EXPO_PUBLIC_OPENAI_BASE_URL` | Volitelně, výchozí `https://api.openai.com/v1`. |
| `EXPO_PUBLIC_OPENAI_MODEL` | Volitelně, výchozí **`gpt-4o-mini`**. |

### Výběr modelu

- **`gpt-4o-mini`** (výchozí): dobrý poměr cena/výkon pro OCR dokladů a strukturovaný JSON.
- **`gpt-4o`**: vyšší přesnost u horšího snímku; vyšší náklady.
- Jiný vision model lze zadat přes `EXPO_PUBLIC_OPENAI_MODEL`, pokud podporuje Chat Completions s `image_url` a `response_format: json_object`.

## Kontrakt vlastní proxy

**Požadavek:** `POST`, `Content-Type: application/json`

```json
{
  "imageBase64": "<base64 bez prefixu data:>",
  "mimeType": "image/jpeg"
}
```

**Odpověď:** HTTP 200 – buď přímo objekt výsledku rozpoznání, nebo `{ "result": { ... } }`.

Povinná logická struktura:

- `suggestedType`: `invoice` | `receipt` | `business_card`
- `typeConfidence`: `high` | `low`
- `standardFields`: objekt s klíči dle typu (viz PRD)
- `transcript`: jeden řetězec – kompletní přepis

## Ověření bezpečnosti buildu

- Produkční build by neměl obsahovat `EXPO_PUBLIC_OPENAI_API_KEY` (vyhledáním v bundlu / použitím jen proxy v production profilu EAS).
- Klíče držte mimo Git (`.gitignore` pro `.env`).

## Chování v aplikaci

- R6: při `typeConfidence: low` uživatel upraví typ bez druhého volání API.
- R7: chyby sítě/API, tlačítka Zkusit znovu a Zpět.
- Před prvním odesláním: obrazovka souhlasu na výsledkové obrazovce (síťový režim).
