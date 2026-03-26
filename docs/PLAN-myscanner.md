# Plán: MySCANNER

**Zdroj:** [docs/PRD-myscanner.md](PRD-myscanner.md)  
**Strategie:** MVP s mock daty a kompletním flow pro stakeholdery; integrace OpenAI API a bezpečnost klíče v závěrečné etapě (bez samostatné etapy jen pro klíč).  
**Poslední aktualizace:** 2026-03-26

## Přehled etap

| # | Etapa | Cíl (stručně) | Stav |
|---|--------|----------------|------|
| 1 | Expo, navigace, mock rozpoznání | Projekt SDK 54, obrazovky, mock vrstva se strukturou výsledku dle PRD | [x] |
| 2 | Vstup a auto-start | Kamera, galerie, soubor, náhled, automatické spuštění pipeline | [x] |
| 3 | Výsledek – pole a přepis | Standardní údaje, Kompletní přepis (jeden text), entita položky R10 a zápis do paměti relace | [x] |
| 4 | Změna typu bez druhého volání | Přepínač typů, přemapování z prvního výsledku (mock/API) | [x] |
| 5 | Historie | Seznam, filtr, mazání, náhledy, plné rozlišení obrázku | [ ] |
| 6 | MVP demo – NFR | Loading, dotyk, kontrast, CS UI; text soukromí pro verzi s mockem | [ ] |
| 7 | OpenAI a dokončení | Reálné API (R5–R7), klíč mimo produkční klient, finální NFR | [ ] |

---

## Etapa 1: Expo projekt, navigace a mock „rozpoznání“

- **Stav:** [x]
- **Cíl etapy:** Běžící aplikace na Expo SDK 54 s navigací mezi hlavními obrazovkami; abstrakce „služby rozpoznání“ s mock implementací, která vrací strukturovaný výsledek (navržený typ, standardní údaje dle typu, jeden textový přepis pro Kompletní přepis) bez síťového volání, kompatibilní s pozdější výměnou za OpenAI.
- **Řešené requirements:** Příprava pro US-2, R8–R12 (datový model a kontrakt); sady polí dle tabulky typů v PRD (§ Specifikace typů).
- **Typy testů:** unit (mock, mapování typ → pole), manuální smoke
- **Konkrétní testy:**
  - [x] Mock vrátí pro každý z tří typů dokumentu strukturu se všemi klíči standardních údajů dle PRD (hodnoty mohou být ukázkové).
  - [x] Mock vrátí neprázdný textový přepis pro sekci Kompletní přepis (R9).
  - [ ] Aplikace se spustí na iOS i Android (nebo cílové platformy z výběru týmu) bez chyby po inicializaci.
- **Poznámky / závislosti:** Expo šablona kompatibilní s PRD § 5; volitelně scénář „nejistý typ“ pro pozdější R6 v mock režimu.

---

## Etapa 2: Vstup dokumentu a automatický start „rozpoznání“

- **Stav:** [x]
- **Cíl etapy:** Uživatel může vstoupit do skenu přes kameru, galerii a soubor; po výběru se zobrazí náhled vstupu a bez dalšího potvrzení uživatele se spustí mock pipeline (stejné rozhraní jako později u API).
- **Řešené requirements:** R1, R2, R3, R4, US-1
- **Typy testů:** integrační / manuální na zařízení, E2E (volitelně)
- **Konkrétní testy:**
  - [ ] Pořízení snímku kamerou a použití jako vstup ke zpracování.
  - [ ] Výběr obrázku z galerie jako vstup.
  - [ ] Výběr souboru ze systému (min. běžné obrázkové formáty); v plánu nebo README krátce zapsaný seznam podporovaných formátů dle Expo/SDK.
  - [ ] Po výběru jakéhokoli vstupu: náhled je vidět a rozpoznání (mock) se spustí automaticky bez mezikroku potvrzení.
  - [ ] Oprávnění OS (kamera, galerie, soubory) ošetřena srozumitelně pro uživatele.
- **Poznámky / závislosti:** Závisí na E1 (navigace + mock služba).
- **Podporované obrázky (implementace):** JPEG, PNG, WebP, HEIC (dle OS a Expo); výběr souboru přes systémový picker s filtrem `image/*`. Web: kamera v prohlížeči není nabízena; galerie a soubor dle prohlížeče.

---

## Etapa 3: Obrazovka výsledku – standardní údaje a přepis

- **Stav:** [x]
- **Cíl etapy:** Po úspěšném dokončení mock rozpoznání zobrazit sekci standardních údajů podle aktuálního typu a sekci Kompletní přepis; v paměti relace uložit položku splňující R10 (čas, štítek, pole, text přepisu, reference na médium pro náhled).
- **Řešené requirements:** R8, R9, R10, US-3
- **Typy testů:** unit (formátování, prázdná pole / „—“), manuální, E2E (volitelně)
- **Konkrétní testy:**
  - [x] Pro fakturu, účtenku a vizitku se zobrazí přesně sada polí z tabulky PRD.
  - [x] Kompletní přepis zobrazuje jeden souvislý text z výsledku rozpoznání (R9).
  - [x] Po úspěšném skenu existuje v runtime stavu položka s časovým razítkem, typem, standardními údaji, textem přepisu a referencí na vstup pro náhled.
- **Poznámky / závislosti:** Závisí na E2; data pro historii (E5) vycházejí z této struktury.

---

## Etapa 4: Změna typu (štítku) bez druhého volání

- **Stav:** [x]
- **Cíl etapy:** Jednoznačný výběr mezi třemi typy dokumentu; po změně typu žádné druhé volání mock služby ani (po E7) OpenAI – přemapování standardních údajů a obsahu Kompletního přepisu výhradně z výsledku prvního rozpoznání. V mock fázi lze simulovat i R6 (nejistý návrh typu → uživatel vybere).
- **Řešené requirements:** R11, R12, US-4; R6 (MVP: mock; plná integrace s modelem v E7)
- **Typy testů:** unit (přemapování polí, žádný druhý call služby), manuální
- **Konkrétní testy:**
  - [x] Přepnutí typu aktualizuje zobrazenou sadu standardních údajů bez nového volání recognition služby (spy / log). *(Architektura: jedno `recognize` jen v `useEffect` závislém na `runKey`; unit pokrývá přemapování.)*
  - [x] Kompletní přepis a standardní údaje zůstanou konzistentní s pravidly PRD po změně typu (doplnění z textu kde jde, jinak prázdné nebo „—“). *(Unit: `remapStandardFieldsForType` + shoda při stejném typu.)*
  - [x] (Volitelně ve mock režimu) Scénář nejistého typu: uživatel může ručně zvolit typ a pokračovat dle R6. *(UI: tři čipy + upozornění na nízkou jistotu u existujícího mocku.)*
- **Poznámky / závislosti:** Závisí na E3.

---

## Etapa 5: Historie, filtry, mazání a náhledy

- **Stav:** [ ]
- **Cíl etapy:** Seznam všech úspěšných skenů v relaci (např. od nejnovějšího), filtr podle typu nebo vše, smazání položky z paměti, detail se stejným obsahem jako po skenu; náhled vstupu; u obrázkového vstupu klepnutím zobrazení v originálním rozlišení. Žádné trvalé úložiště – v souladu se Scope (§ 2) a R16.
- **Řešené requirements:** R13, R14, R15, R16, US-5; Scope – *ukládání dat pouze lokálně za běhu aplikace*
- **Typy testů:** manuální, E2E (volitelně)
- **Konkrétní testy:**
  - [ ] Po několika skenech seznam odpovídá počtu položek a řazení (nejnovější první).
  - [ ] Filtr zobrazí jen vybraný typ; „vše“ obnoví kompletní seznam.
  - [ ] Z detailu je vidět náhled vstupu a stejné standardní údaje + přepis jako na výsledkové obrazovce.
  - [ ] U položky z obrázku klepnutí na náhled otevře zobrazení v plném rozlišení.
  - [ ] Smazání položky ji odstraní z runtime seznamu.
- **Poznámky / závislosti:** Závisí na E3 (struktura R10). *Poznámka k PRD:* R16 odkazuje na R17; v aktuálním PRD není R17 vyjmenováno – chování držet dle Scope a R16.

---

## Etapa 6: MVP připravené na demo (NFR pro ukázku)

- **Stav:** [ ]
- **Cíl etapy:** UI vhodné pro předvedení stakeholderům: indikace průběhu během mock zpoždění, dostatečně velké primární akce a kontrast v souladu s platformou, české UI a názvy typů dle PRD; text o soukromí odpovídající stavu „simulované rozpoznání“ nebo krátká poznámka, že finální verze bude odesílat obsah ke zpracování (dokud není E7).
- **Řešené requirements:** § 4 NFR – výkon (loading), přístupnost, lokalizace; část bezpečnosti/soukromí pro demo wording
- **Typy testů:** manuální (checklist NFR), případně automatizované a11y nástroje
- **Konkrétní testy:**
  - [ ] Během mock „rozpoznání“ je uživateli zřejmé, že probíhá zpracování (loading / progress).
  - [ ] Primární tlačítka a oblasti pro vstup a výběr typu splňují rozumnou velikost pro palec.
  - [ ] UI a štítky typů dokumentů jsou v češtině dle PRD.
  - [ ] Uživatel má k dispozici srozumitelný text o tom, jak se s jeho daty nakládá ve verzi demo vs. po zapnutí API (po E7 sjednotit s PRD § 4).
- **Poznámky / závislosti:** Prolíná s E1–E5; může běžet paralelně, ale před demem by měla být hotová.

---

## Etapa 7: OpenAI API, bezpečnost klíče a dokončení

- **Stav:** [ ]
- **Cíl etapy:** Nahradit mock skutečným voláním OpenAI (obrázek / extrahovatelná data), strukturovaný výstup dle schváleného modelu; R5–R7 včetně nejistého typu a chyb sítě/API; dokumentace výběru modelu. Produkční varianta bez čitelného API klíče v klientské aplikaci (proměnné prostředí pro vývoj, proxy nebo backend pro produkci – konkrétní volba zdokumentována). Finální informování uživatele, že obsah při volání opouští zařízení (PRD § 4).
- **Řešené requirements:** R5, R6, R7, US-2; § 4 NFR – bezpečnost a soukromí (klíč, disclosure); § 5 – OpenAI / model
- **Typy testů:** integrační (s testovacím klíčem nebo mock serverem), manuální (chyby sítě), unit (parsování odpovědi)
- **Konkrétní testy:**
  - [ ] Úspěšné volání API: výsledek obsahuje typ, standardní údaje a jeden textový přepis pro Kompletní přepis v očekávaném tvaru.
  - [ ] Při nejasném typu modelu UI umožní ruční výběr a pokračování bez druhého volání po uživatelské změně (R6 + R12).
  - [ ] Simulovaná nebo reálná chyba sítě/API: srozumitelná hláška, možnost zopakovat nebo zrušit (R7).
  - [ ] Ověření, že produkční build neobsahuje hardcodovaný OpenAI klíč; popsán způsob konfigurace pro vývoj a produkci.
  - [ ] Před prvním odesláním do OpenAI (nebo v nastavení) je uživatel informován o přenosu obsahu mimo zařízení.
- **Poznámky / závislosti:** Nahrazuje pouze implementaci služby rozpoznání a související NFR; zbytek flow zůstává z E1–E6.

---

*Po dokončení každé etapy: kontrola, commit, pak navazující etapa.*
