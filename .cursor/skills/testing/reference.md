# Jak má vypadat plán testů (Markdown v `docs/`)

Soubor je **návrh mapování PRD → E2E (Playwright)**. Žádný testovací kód, jen Markdown. Ulož ho typicky jako `docs/TST-<slug>.md`; při jiné konvenci projektu ji respektuj.

## Pořadí sekcí v dokumentu

1. Nadpis a odkazy (PRD, případně PLAN).
2. **`## Smoke test`** — vždy první tabulka (viz níže).
3. **`## Funkční blok: …`** — pro každou část aplikace vlastní tabulka.
4. **`## Nefunkční testy`** — volitelně. 

## Smoke test — účel a obsah

Smoke není náhrada za testy funkčních bloků. Je to **minimální kontrola**, že se aplikace po nasazení / v CI **vůbec rozběhne** a zvládne **základní krok uživatele** (otevření appky, hlavní layout, případně přihlášení nebo home route).

Typicky odhalí:

- rozbitý frontend po **upgrade knihovny** (API se změnilo, app spadne hned při renderu),
- **nekonzistentní build** nebo chybějící asset,
- **špatné prostředí** (chybějící proměnná, špatná `baseURL`),
- fatální chyby při **startu** (ne při hluboké business logice).

**Smoke spouštěj vždy** (např. každý pipeline). **Testy ve funkčních blocích** spouštěj **jen tam, kde se měnil relevantní kód** (úspora času v CI / lokálně — jak přesně filtrovat specy, je v konfiguraci projektu).

Ve sloupci **PRD** u smoke může být `—`, pokud jde o obecnou provozní kontrolu nezávislou na jednom ID; jinak odkaz na nejkritičtější R/US.

## Sloupce (stejné pro smoke i funkční bloky)

| Sloupec | Obsah |
|--------|--------|
| **PRD** | ID z PRD, nebo `—` u obecné smoke položky. |
| **Shrnutí** | Jedna věta — co musí platit. |
| **E2E scénář** | Stručný tok (bez selektorů). |
| **Kde / poznámka** | Po implementaci: cesta ke specu (často `e2e/smoke.spec.ts`), `test.describe`. |

## Příklad

```markdown
# E2E mapování na PRD — my-scanner

**PRD:** docs/PRD-my-scanner.md

## Smoke test

| PRD | Shrnutí | E2E scénář | Kde / poznámka |
|-----|---------|------------|----------------|
| — | Aplikace naběhne bez fatální chyby. | Otevření `/`, viditelná hlavní obrazovka / layout | |
| R0 | Uživatel vidí přihlášení. | Zobrazení přihlašovacího formuláře (pokud je vstupní bod) | |

## Funkční blok: Skener

| PRD | Shrnutí | E2E scénář | Kde / poznámka |
|-----|---------|------------|----------------|
| R1 | Uživatel nahraje dokument. | Nahrání souboru, zobrazení náhledu | |
| R3 | OCR po nahrání. | Spuštění zpracování, indikace průběhu | |

## Funkční blok: Export

| PRD | Shrnutí | E2E scénář | Kde / poznámka |
|-----|---------|------------|----------------|
| R2 | Export výsledku. | Stažení exportu po zpracování | |
```

## Nefunkční testy

Volitelná tabulka (stejné sloupce jako u funkčních bloků nebo zúžené podle potřeby): výkon, přístupnost, bezpečnostní smoke, limity souborů — vždy s vazbou na PRD, pokud je v PRD definováno.

