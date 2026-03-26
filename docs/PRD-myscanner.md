# MySCANNER

## 1. Přehled

- **Cíl**: Umožnit rychle naskenovat dokumenty z mobilu, nechat je rozpoznat pomocí *umělé inteligence*, uložit strukturovaný *přepis* s *štítkem* typu a prohlížet je v *historii* během jedné relace aplikace.
- **Cílová skupina**: Uživatelé mobilních zařízení (iOS/Android), kteří chtějí digitalizovat *faktury*, *účtenky* a *vizitky* bez trvalého ukládání dat v zařízení mezi spuštěními.
- **Kontext**: Papírové a digitální doklady je nutné převést na text a klíčové údaje; typ dokumentu má řídit, které *standardní údaje* se zobrazí jako první a jak se začne *shrnutí* v *přepisu*.

## 2. Scope

- **In scope**:
  - Mobilní aplikace **MySCANNER** (React Native, Expo SDK 54).
  - Vstup z *kamery*, *galerie* a *souboru* (obrázek nebo dokument v podporovaných formátech dle implementace); po výběru vstupu **automatické spuštění rozpoznání**.
  - Volání OpenAI API pro rozpoznání obsahu a návrh typu dokumentu (jedno volání na sken; změna typu uživatelem bez dalšího volání API).
  - Tři typy: *faktura*, *účtenka z obchodu*, *vizitka*; uživatelská změna typu po návrhu systému.
  - Zobrazení *standardních údajů* podle typu, *shrnutí* na začátku *přepisu* a plný text dalších informací z dokumentu.
  - *Historie* naskenovaných položek, filtrování podle typu, mazání položky v rámci relace, náhled *přepisu* i původního vstupu (obrázek / náhled souboru); u obrázkového vstupu po klepnutí na náhled zobrazení v originálním rozlišení.
  - Ukládání dat pouze *lokálně za běhu aplikace* (bez záruky persistence po ukončení aplikace).
- **Out of scope**:
  - Synchronizace do cloudu, účty uživatelů, sdílení mezi zařízeními.
  - Trvalé ukládání na disk / databázi mezi spuštěními (backup, export mimo základní zobrazení v relaci není požadováno).
  - Účetnictví, právní platnost dokladů, podpisové workflow.
  - Rozpoznávání typů mimo uvedené tři (s výjimkou nutného „neznámý“ stavu před výběrem uživatele, pokud AI není jistá – viz requirements).

## 3. User stories a requirements

### Specifikace typů a *standardních údajů*

Aplikace pro každý typ definuje sadu *standardních údajů*. Hodnoty mohou být prázdné, pokud v dokumentu nejsou zřejmé; pole se přesto zobrazí (např. „—“) nebo se skryjí prázdná – konkrétní UX stanoví implementace, ale sada polí je fixní podle typu.


| Typ                 | Standardní údaje (klíče pro UI a extrakci)                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *Faktura*           | Číslo faktury, Datum vystavení, Datum splatnosti, Dodavatel (název), IČ dodavatele, Odběratel (název), Celková částka, Měna, DPH celkem (volitelné pole) |
| *Účtenka z obchodu* | Prodejce / obchod, Datum a čas, Celková částka, Měna                                                                                                     |
| *Vizitka*           | Jméno a příjmení, Společnost / pozice, Telefon, E-mail, Web, Adresa                                                                                      |

U *faktury* je pole *DPH celkem* v tabulce označené jako volitelné ve smyslu: na dokladu nemusí být uvedeno, přesto zůstává v sadě *standardních údajů* a v UI se zobrazí jako ostatní pole (prázdné nebo „—“).

*Shrnutí* na začátku *přepisu* je krátký text (1–5 vět) generovaný nebo sestavený z rozpoznaného obsahu tak, aby obsahoval nejdůležitější informace podle typu (např. u faktury dodavatel a částka, u účtenky obchod a částka, u vizitky jméno a firma).

---

### US-1: Vstup dokumentu

**User story**: Jako uživatel chci naskenovat nebo vybrat dokument z *kamery*, *galerie* nebo *souboru*, abych ho mohl dát zpracovat aplikaci.

**Requirements**:

- R1: Uživatel může pořídit nový snímek *kamerou* a použít ho jako vstup ke zpracování.
- R2: Uživatel může vybrat obrázek z *galerie* zařízení jako vstup.
- R3: Uživatel může vybrat *soubor* ze souborového systému (minimálně běžné obrázkové formáty; další formáty dle možností Expo/SDK, dokumentovat v plánu/technické poznámce).
- R4: Po výběru vstupu aplikace zobrazí náhled vstupu a **automaticky spustí rozpoznání** (bez samostatného potvrzovacího kroku od uživatele).

### US-2: Rozpoznání obsahu a návrh typu

**User story**: Jako uživatel chci, aby aplikace rozpoznala text a navrhla typ dokumentu, abych nemusel typ vybírat ručně od začátku.

**Requirements**:

- R5: Aplikace odešle obsah vstupu (obrázek / extrahovatelná data) do OpenAI API podle schváleného modelu a získá strukturovaný výsledek: navržený typ mezi *faktura*, *účtenka z obchodu*, *vizitka*, textový *přepis* a vyplnění *standardních údajů* podle navrženého typu.
- R6: Pokud model typ jasně neurčí, aplikace zobrazí výchozí stav (např. předvybraný typ nebo „vyberte typ“) a uživatel vybere typ ručně; po změně typu se *standardní údaje* přemapují nebo znovu odvozují dle R12 (bez nového volání API).
- R7: Při chybě síť/API uživatel uvidí srozumitelnou chybovou hlášku a může akci zopakovat nebo vstup zrušit.

### US-3: Zobrazení výsledku (*standardní údaje* a *přepis*)

**User story**: Jako uživatel chci vidět klíčové údaje hned nahoře a poté celý *přepis* se *shrnutím* na začátku, abych se rychle zorientoval a měl k dispozici i zbytek textu.

**Requirements**:

- R8: Po úspěšném rozpoznání se zobrazí sekce *standardních údajů* odpovídající aktuálně zvolenému typu dokumentu (tabulka výše).
- R9: *Přepis* začíná blokem *shrnutí* (viz Specifikace typů), následovaným odděleným celým textem ostatního rozpoznaného obsahu z dokumentu (nesmí být ztracen rozdíl mezi „hlavičkovými“ poli a dlouhým textem – buď explicitní sekce, nebo jasné oddělení v UI).
- R10: Uložená položka v *historii* obsahuje: časové razítko skenu, aktuální typ (*štítek*), *standardní údaje*, *přepis* (včetně *shrnutí*), referenci na vstupní médium pro náhled (v paměti relace).

### US-4: Úprava *štítku* (typu dokumentu)

**User story**: Jako uživatel chci změnit navržený typ dokumentu, když se systém splete, aby odpovídaly *standardní údaje* a *shrnutí* mému úmyslu.

**Requirements**:

- R11: Uživatel může změnit typ na kterýkoli ze tří typů z tabulky; UI nabízí jednoznačnou volbu (picker, segmenty apod.).
- R12: Po změně typu uživatelem aplikace **nesmí znovu volat OpenAI API**; aktualizuje zobrazení *standardních údajů* (a případně *shrnutí* v rámci *přepisu*) výhradně z již získaného výsledku prvního rozpoznání — doplnění polí z již rozpoznaného textu, jinak prázdná pole nebo „—“ podle UX v sekci Specifikace typů.

### US-5: *Historie* a filtrování

**User story**: Jako uživatel chci prohlížet dříve zpracované dokumenty a filtrovat je podle typu, abych se k nim vrátil v rámci relace.

**Requirements**:

- R13: Aplikace udržuje seznam všech úspěšně uložených skenů v rámci aktuální relace (pořadí např. od nejnovějšího).
- R14: Uživatel může filtrovat seznam podle typu (*faktura*, *účtenka z obchodu*, *vizitka*) nebo zobrazit vše.
- R15: Z detailu položky v *historii* je dostupný náhled původního vstupu (obrázek / náhled souboru dle typu vstupu) a stejná struktura *standardních údajů* + *přepis* jako po skenu. U položky s obrázkovým vstupem po klepnutí na náhled uživatel vidí obrázek v **originálním rozlišení**.
- R16: Uživatel může z *historie* smazat položku; položka zmizí jen z runtime úložiště v rámci relace (v souladu s R17).

## 4. Nefunkční požadavky

- **Výkon**: Rozpoznání jednoho dokumentu by mělo v typických podmínkách doběhnout v řádu sekund až desítek sekund v závislosti na síti a velikosti vstupu; přesný SLA není stanoveno, ale UI musí zobrazovat probíhající stav (loading).
- **Bezpečnost a soukromí**: API klíč OpenAI nesmí být vestavěný v klientské aplikaci pro produkci v čitelné podobě; pro vývoj lze použít proměnné prostředí / bezpečný backend proxy (detail v plánu). Uživatel musí být informován, že obsah dokumentu opouští zařízení při volání OpenAI.
- **Přístupnost**: Primární akce (vstup, spuštění skenu, výběr typu) musí být dostatečně velké pro dotyk; kontrast textu v souladu s výchozím chováním platformy.
- **Lokalizace**: UI může být v češtině; názvy typů dokumentů odpovídají PRD (*faktura*, *účtenka z obchodu*, *vizitka*).

## 5. Závislosti a omezení

- **Expo SDK 54** a kompatibilní verze React Native podle šablony projektu Expo.
- **OpenAI API** – dostupnost, limity tokenu, cena volání; výběr konkrétního modelu (vision / multimodal) v plánu implementace.
- Oprávnění OS: *kamera*, přístup k *galerii*, přístup k *souborům* dle zvolených knihoven Expo.
- Kvalita rozpoznání závisí na kvalitě snímku a modelu; PRD nezaručuje 100% přesnost polí.

## 6. Glosář

- **Faktura**: Daňový nebo obchodní doklad s částkami, dodavatelem a odběratelem – v aplikaci jeden z typů dokumentu.
- **Historie**: Seznam dokumentů zpracovaných v aktuální relaci aplikace, uložený pouze v paměti.
- **Přepis**: Textový výstup rozpoznání dokumentu včetně *shrnutí* na začátku a následného plného textu.
- **Shrnutí**: Krátký úvodní text v rámci *přepisu* s nejdůležitějšími informacemi podle typu dokumentu.
- **Standardní údaje**: Předdefinovaná pole pro daný typ dokumentu, zobrazená prominentně v UI.
- **Štítek**: Typ dokumentu přiřazený položce (*faktura*, *účtenka z obchodu*, *vizitka*); uživatel ho může změnit po návrhu systému.
- **Účtenka z obchodu**: Doklad o nákupu z maloobchodu – jeden z typů dokumentu.
- **Umělá inteligence**: V tomto PRD konkrétně služby OpenAI pro analýzu obrazu a textu.
- **Vizitka**: Kontaktní kartička nebo její ekvivalent – jeden z typů dokumentu.

