# Plán testů (mapování na PRD) — MySCANNER

**PRD:** [PRD-myscanner.md](PRD-myscanner.md)  
**Plán:** [PLAN-myscanner.md](PLAN-myscanner.md)

Aplikace je **React Native (Expo)** s cílem iOS/Android; existuje i `expo web`. Tabulky níže popisují **E2E scénáře** ve smyslu [reference](../.cursor/skills/testing/reference.md) (typicky Playwright pro web nebo samostatný runner pro nativní UI). Část logiky je dnes pokrytá **Jest** v `mobile/__tests__/` — po doplnění E2E lze ve sloupci *Kde / poznámka* odkázat na konkrétní spec + existující unit testy.

Funkční pokrytí je rozděleno na **dva bloky**: *Skenování* (vstup, rozpoznání, výsledek na místě skenu, změna typu) a *Historie* (co zůstane v relaci, seznam, filtr, detail, mazání).

---

## Mock data a úspora tokenů (OpenAI)

Cíl: **vývoj, CI a většina E2E běží bez volání OpenAI** — žádná spotřeba tokenů ani odesílání obrázků mimo zařízení.

### Bez síťového rozpoznání (0 tokenů)

| Oblast | Co pokrýt | Jak |
|--------|-----------|-----|
| **Unit testy (Jest)** | Parsování odpovědí, přemapování polí po změně typu, session položky, filtry historie, pomocné dialogy, téma / a11y kde je logika v kódu | `mobile/__tests__/*.test.ts` — žádné API |
| **„Úspěšné“ rozpoznání a UI po něm** | R4–R6, R8–R12: náhled, loading → výsledek, standardní údaje, přepis, změna typu bez druhého requestu | Aplikace v režimu **mock**: `EXPO_PUBLIC_MYSCANNER_USE_MOCK=1` nebo `true` → backend `mock` v `mobile/src/services/recognition/recognitionEnv.ts` (`mockRecognitionService`, deterministický výstup z URI / volitelně `mockScenario` v `RecognitionRequest`). **E2E (Playwright):** fronta `window.__MYSCANNER_E2E_QUEUE` v `mobile/src/services/recognition/e2eRecognitionHooks.ts` umožňuje vynutit scénář (`invoice` / `receipt` / `business_card` / `uncertain`) nebo chybu bez OpenAI. |
| **Historie** | R10–R16: seznam, filtr, detail, mazání — pokud do historie položky vznikají z mock výsledků | Stejný mock režim + případně předvyplněná session v E2E |
| **Smoke** | Naběhnutí aplikace, dostupnost vstupů | Obvykle bez API; stačí mock nebo vůbec nespouštět rozpoznání |

### Kde mock nestačí nebo je potřeba náhrada

| Oblast | Poznámka |
|--------|----------|
| **R1–R3** | Spotřebovávají tokeny jen tehdy, když po výběru média běží **OpenAI/proxy**, ne když je zapnutý **mock**. Samotný výběr kamery/galerie/souboru tokeny nespotřebuje. |
| **R7 (chyba API)** | Proti **skutečnému** OpenAI endpointu tokeny netřeba „pálit“ — stačí **mock HTTP** (např. Playwright route / MSW) vracející chybu, nebo testovací proxy. V mock režimu lze v E2E zařadit položku `{ type: 'error', message }` do `__MYSCANNER_E2E_QUEUE` (viz `e2eRecognitionHooks.ts`). |
| **Kvalita rozpoznání reálným modelem** | PRD výslovně nezaručuje 100 % přesnost — občas **ruční / řídký** běh s reálným API nebo pilotním účtem má smysl, ne jako součást každého CI běhu. |
| **Výkon za reálné sítě** | Nefunkční „řád sekund až desítek sekund“ — spíš manuálně nebo samostatný profilovací běh, ne opakované E2E proti produkčnímu API. |

### Doporučená praxe

- **CI / `npm test`:** Jest v `mobile/`. **E2E:** z `mobile/` příkaz `npm run test:e2e` (Playwright spouští `expo start --web` s `EXPO_PUBLIC_MYSCANNER_USE_MOCK=1` a `BROWSER=none`).
- **Integrace OpenAI nebo proxy:** jeden zřídka spouštěný job nebo lokální skript, ne paralelní E2E proti ostrému API.

---

## Smoke test


| PRD | Shrnutí                                                        | E2E scénář                                                                                                       | Kde / poznámka |
| --- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------- |
| —   | Aplikace naběhne bez fatální chyby a je vidět hlavní rozhraní. | Otevření vstupní obrazovky / hlavní navigace (tabs), žádný nekontrolovaný pád.                                   | `mobile/e2e/smoke.spec.ts` — `test.describe('Smoke')` |
| —   | Primární akce vstupu jsou dostupné.                            | Viditelné nebo dosažitelné ovládání pro sken / výběr zdroje dokumentu (soulad s přístupností — dotyk na mobilu). | `mobile/e2e/smoke.spec.ts` (web; nativní kamery/galerie zvlášť) |


---

## Funkční blok: Skenování

Vstup (US-1), rozpoznání a návrh typu (US-2), zobrazení výsledku na obrazovce skenu (US-3) a úprava typu bez druhého API volání (US-4).

| PRD | Shrnutí                                                                                                | E2E scénář                                                                                      | Kde / poznámka                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| R1  | Vstup z kamery funguje jako vstup ke zpracování.                                                       | Spuštění výběru kamery, pořízení / mock snímku, zobrazení náhledu a navazujícího toku.          | Web: kamera nepodporována (dialog); nativní E2E zvlášť. |
| R2  | Vstup z galerie zařízení.                                                                              | Výběr obrázku z galerie, náhled, navazující tok.                                                | Web E2E zatím bez samostatného specu (file picker v `scanning.spec.ts`). |
| R3  | Vstup ze souborového systému (obrázek / dokument dle podpory).                                         | Výběr souboru přes picker, náhled, navazující tok.                                              | `mobile/e2e/scanning.spec.ts` — `pickImageFile` + fixture PNG |
| R4  | Po výběru vstupu se zobrazí náhled a **automaticky** začne rozpoznání bez dalšího potvrzení uživatele. | Po výběru média ověřit náhled + indikaci probíhajícího rozpoznání (ne čekání na ruční „Start“). | `mobile/e2e/scanning.spec.ts` — první test (loading / progressbar) |
| R5  | Úspěšné volání backendu / API a zobrazení strukturovaného výsledku (typ, standardní údaje, kompletní přepis). | Mock sítě nebo testovací proxy: po vstupu dokumentu dorazí odpověď, UI zobrazí navržený typ a pole. | `mobile/e2e/scanning.spec.ts` + unit: `parseRecognitionPayload.test.ts`, `recognitionMock.test.ts` |
| R6  | Při nejistém typu modelu uživatel vybere typ ručně; bez druhého API volání po změně.                    | Simulovat odpověď bez jistého typu → výběr typu → kontrola UI (souvisí s R12 u přemapování).    | `mobile/e2e/scanning.spec.ts` — fronta `uncertain` |
| R7  | Při chybě síť/API srozumitelná hláška a možnost opakovat nebo zrušit.                                 | Simulovat chybu (timeout, 5xx) → zobrazení chyby → retry / zrušení.                             | `mobile/e2e/scanning.spec.ts` — fronta `error` + retry |
| R8  | Po úspěchu sekce *standardních údajů* odpovídá **aktuálně zvolenému** typu (sada polí z PRD).           | Po rozpoznání ověřit přítomnost očekávaných polí pro fakturu / účtenku / vizitku.               | `mobile/e2e/scanning.spec.ts` — pole faktury + přepnutí na účtenku (R12) |
| R9  | Pod standardními údaji je *Kompletní přepis* jako jeden souvislý text; žádné samostatné „shrnutí“ v UI. | Kontrola pořadí sekcí a jednoho textového bloku přepisu.                                        | `mobile/e2e/scanning.spec.ts` — sekce + `aria-label` přepisu |
| R11 | Uživatel změní typ na jeden ze tří; UI nabízí jednoznačnou volbu.                                      | Otevřít picker/segmenty, přepnout typ, ověřit aktualizaci štítku.                               | `mobile/e2e/scanning.spec.ts` — radiogroup typu |
| R12 | Po změně typu **žádné** nové volání OpenAI; standardní údaje a přepis z prvního výsledku / prázdná pole. | Sledovat síť (0 nových requestů na chat/completions apod. po změně typu) a ověřit přemapování polí. | `mobile/e2e/scanning.spec.ts` + unit: `remapStandardFieldsForType.test.ts` |

---

## Funkční blok: Historie

Seznam a práce s uloženými skeny v rámci relace (US-5), včetně toho, co položka po skenu obsahuje (R10).

| PRD | Shrnutí                                                                                                             | E2E scénář                                                                   | Kde / poznámka                      |
| --- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------- |
| R10 | Položka v historii obsahuje razítko, štítek, standardní údaje, přepis a náhled vstupu (v rámci relace).             | Po úspěšném skenu otevřít historii a ověřit zobrazení metadat a konzistenci s detailem. | `mobile/e2e/history.spec.ts` + unit: `sessionScanItem.test.ts` |
| R13 | Seznam skenů v relaci, pořadí (např. nejnovější první).                                                             | Více skenů → pořadí v seznamu odpovídá očekávání.                            | `mobile/e2e/history.spec.ts` (2 skeny, nejnovější první v seznamu) |
| R14 | Filtrování podle typu nebo zobrazení všech.                                                                         | Přepínač filtru → jen vybraný typ / vše.                                     | `mobile/e2e/history.spec.ts` + unit: `filterSessionItems.test.ts` |
| R15 | Z detailu historie náhled vstupu + stejná struktura obrazovky; u obrázku klepnutí na náhled → originální rozlišení. | Otevřít položku, ověřit náhled a fullscreen / zvětšení u obrázkového vstupu. | `mobile/e2e/history.spec.ts` — fullscreen náhled |
| R16 | Smazání položky z historie; zmizí jen z runtime úložiště relace.                                                    | Smazat položku → zmizí ze seznamu; nová relace out of scope dle PRD.         | `mobile/e2e/history.spec.ts` — `window.confirm` na webu |


---

## Nefunkční testy


| PRD / zdroj         | Shrnutí                                                                                                     | E2E scénář / přístup                                                                           | Kde / poznámka                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Sekce 4 Výkon       | Během rozpoznání je vidět probíhající stav (loading).                                                       | Po vstupu dokumentu ověřit loading UI až do úspěchu/chyby.                                     | `mobile/e2e/scanning.spec.ts` (indikace „Zpracovává se dokument“)        |
| Sekce 4 Přístupnost | Primární akce dostatečně velké pro dotyk; kontrast dle platformy.                                           | Manuální / automatizované a11y pravidla (např. axe na webu); na zařízení kontrola tap targetů. | Unit příklad: `accessibilityTheme.test.ts` (téma), rozšířit dle potřeby. |
| Sekce 4 Bezpečnost  | API klíč ne v klientské produkční aplikaci v čitelné podobě; informování uživatele o odchodu dat na OpenAI. | Kontrola buildů / env; smoke textu souhlasu nebo informační obrazovky pokud je v produktu.     | Spíše CI a code review než klasické E2E.                                 |
| Sekce 4 Lokalizace  | UI v češtině (pokud zvoleno); názvy typů dle PRD.                                                           | Kontrola řetězců pro tři typy dokumentů na klíčových obrazovkách.                              | částečně `mobile/e2e/smoke.spec.ts` a scanning/history (české labely)   |


---

## Pokrytí a poznámky k review

- **R1–R3** na reálném zařízení závisí na oprávněních OS a často na CI infrastruktuře; zvažte **web fixture** + jeden **nativní** smoke job.
- **R5–R7:** viz sekce *Mock data a úspora tokenů* — R5/R6 na mock datech; R7 přes HTTP mock / scénář selhání, ne opakované volání OpenAI v CI.
- PRD v R16 odkazuje na **R17** (konzistence runtime úložiště); v textu PRD není R17 definováno — při úpravě PRD sjednotit ID nebo doplnit požadavek.
- **E2E stack:** Playwright + Expo web (`npm run test:e2e` v `mobile/`). Nativní kamery/galerie (R1/R2) zůstávají mimo tento běh; případně Maestro/Detox později.

