# Metodika AI vývoje — Cursor, skills a opakovatelné postupy

Tento materiál slouží jako **úvod do školení**.

- **Metodika:** Ukazuje jednoduchou postupnost, jak využít AI (Cursor) k vývoji aplikací — od specifikace (PRD) přes plán etap až po implementaci, bezpečnostní review a volitelně úpravu na Jablotronní vzhled (skill).
- **Skills:** Na konkrétním projektu předvádí použití **čtyř Cursor skills** z tohoto repozitáře:
  - **product-requirements** — tvorba a úprava PRD
  - **project-plan** — plán etap z PRD
  - **security-review** — bezpečnostní audit
  - **ui-designer-jablotron** — UI a UX pravidla

---

## Příprava na školení

Před školením si kromě **Cursoru** nainstalujte a ověřte:

| Co | Proč | Kde stáhnout |
|----|------|--------------|
| **Cursor** | Editor s AI (Chat, Agent). | [cursor.com](https://cursor.com) |
| **Node.js 18+** | Běh projektu (Expo, npm). Ověření: `node -v` | [nodejs.org](https://nodejs.org) (LTS) |
| **npm** (nebo yarn) | Instalace závislostí a spuštění skriptů. Ověření: `npm -v` | Součást Node.js; příp. [npmjs.com](https://www.npmjs.com) |
| **Git** | Verzování a commity během cvičení. Ověření: `git --version` | [git-scm.com/downloads](https://git-scm.com/downloads) |
| **Expo Go** na telefonu | Pro testování aplikace na reálném zařízení. Použijte verzi s **SDK 54**. | [Expo Go – Android](https://play.google.com/store/apps/details?id=host.exp.exponent), [Expo Go – iOS](https://apps.apple.com/app/expo-go/id982107779); viz též [expo.dev](https://expo.dev) |

**Doporučení:** Mít repozitář projektu naklonovaný a otevřený v Cursoru, aby bylo možné ihned spouštět příkazy (`npm install`, `npx expo start`) a procházet soubory (PRD, plán, skills v `.cursor/skills/`).

---

## Přehled použitých postupů

| Cíl | Klíčové prompty / kroky | Odkaz na sekci |
|-----|-------------------------|----------------|
| **PRD** | Nejdřív specifikace (požadavky v jednom promptu) → iterace nad PRD sekci po sekci → (volitelně) review v novém agentovi s čistým kontextem → potvrzení „Jsem s PRD spokojený“ | [→ PRD](#1-iniciální-požadavky-a-prd) |
| **Plán projektu** | „Vytvoř plán projektu z PRD“ → volba strategie (MVP first + Feasibility test) → iterace etap → potvrzení detailu → uložení `docs/PLAN-*.md` | [→ Plán](#2-plán-projektu--etapy) |
| **Implementace** | „Implementuj etapu 1/2/3…“ po jedné → po každé etapě: test (můžeš se zeptat „Kam ji otestovat?“), commit do Gitu | [→ Implementace](#3-implementace) |
| **Review a bezpečnost** | „Vše funguje. Udělej mi review kódu, zda tam nezůstaly nepoužité fragmenty.“ → „Udělej mi bezpečnostní review.“ | [→ Bezpečnostní review](#4-bezpečnostní-review--úpravy) |
| **Jablotronní vzhled** | „Uprav aplikaci do Jablotronního vzhledu“ (nebo „ať vypadá jako Jablotron“) → agent použije skill ui-designer-jablotron | [→ Jablotronní vzhled](#5-jablotronní-vzhled-skill) |

---

## 1. Iniciální požadavky a PRD

### Prompt(y)
```
Vytvoř aplikaci na skenování dokumentů
 - Jméno aplikace MySCANNER
 - React native, expo (SDK 54), open AI
 - Aplikace mi umožní načíst dokumenty, rozpoznat jejich obsah, uložit jejich přepis a oštítkovat podle typu
 - Vstup: fotoaparat, obrázek z galerie, dokument ze souboru
 - Aplikace rozpozná typ dokumentu a navrhne štítek. Uživatel má ale možnost typ štítku změnit
 - Pro každý typ dokumentu budou definovány standardní údaje, které chci ihned zobrazit a také shrnout na začátku přepisu.
 - Uložený přepis pak bude kromě standardních údajů obsahovat i ostatní informace ze skenovaného dokumentu. 
 - Typy: Faktura, Účtentka z obchodu, Vizitka
 - Bude možné prohlížet historii naskenovaných dokumentů a třídit je podle typu, prohlížet přepisy a naskenované dokumenty
 - Data budou uložena pouze lokálně po dobu běhu aplikace 
```

### Výstup
- **PRD** (např. `docs/PRD-<název>.md`) – strukturovaná specifikace podle šablony: Přehled, Scope, User stories a requirements, Nefunkční požadavky, Závislosti, Glosář.

### Postup
1. **Nejprve nech vytvořit specifikaci** – zadej své požadavky (viz prompt výše). Agent použije skill product-requirements a vygeneruje celý PRD do souboru. S plánem ani kódem zatím nezačínej.
2. **Potom nad PRD iteruj** – projdi vygenerovaný dokument sekci po sekci (viz níže), upravuj požadavky přes chát („V PRD doplň…“, „V scope vyřaď…“, „Přidej user story pro…“). Agent upraví PRD na místě. Opakuj, dokud nejsi s obsahem spokojen.
3. **Review s čistým kontextem (volitelně):** Otevři **nového agenta** (nový chat = prázdný kontext, „čistá hlava“) a nech si nad PRD udělat review – např. „Projdi tento PRD [odkaz/ vložený soubor] a udělej review: úplnost, konzistence, chybějící požadavky.“ Nový agent nemá předchozí diskusi a vidí jen PRD, takže může upozornit na mezery nebo nejasnosti, které by tvůrčí agent přehlédl.
4. **Až po potvrzení PRD** – teprve když řekneš „Jsem s PRD spokojený, můžeš přejít k plánu“, má agent vytvořit plán etap (kapitola 2).

### Co v této etapě dělat (podle struktury PRD)

| Sekce PRD | Na co se zaměřit / co zkontrolovat |
|-----------|-------------------------------------|
| **1. Přehled** (Cíl, Cílová skupina, Kontext) | Je cíl jedna jasná věta? Sedí cílová skupina a kontext k tvému záměru? |
| **2. Scope** (In scope / Out of scope) | Je v „in“ vše, co chceš mít v první verzi? Je v „out“ vše, co záměrně nechceš (aby nedošlo k scope creep)? |
| **3. User stories a requirements** | Má každá hlavní schopnost user story (Jako… chci… aby…)? Jsou requirements číslované, měřitelné a bez překryvů? Chybí nějaká důležitá schopnost? |
| **4. Nefunkční požadavky** | Jsou uvedeny jen relevantní (výkon, bezpečnost, lokalizace, přístupnost)? Doplň, co projekt potřebuje. |
| **5. Závislosti a omezení** | Jsou tam technologie, API, legislativa, časová omezení? Odpovídají tvému stacku a omezením? |
| **6. Glosář** | Jsou definované termíny, které se v PRD opakují? Používají se v textu *kurzívou*? |

Můžeš iterovat celý dokument najednou („Projdi PRD a navrhni doplnění“) nebo sekci po sekci („Uprav sekci Scope tak, aby…“).

### Poznámky
- Důležité je pořadí: **nejdřív celá specifikace, pak iterace nad ní** – ne začít kódovat z prvního promptu.
- S plánem začni až po výslovném potvrzení spokojenosti s PRD (pravidlo projektu v `.cursor/rules`).

---

## 2. Plán projektu / etapy

### Prompt(y)
```
Vytvoř plán projektu z PRD.
```
(Případně: „Chci vytvořit plán implementace“, „Vytvoř etapy z PRD“, „Jak na to postupně?“ – skill project-plan reaguje na tyto formulace.)

### Postup
1. Ujisti se, že existuje PRD (např. `docs/PRD-skenovani-dokumentu.md`). Bez PRD skill plánování nepokračuje.
2. Zadej prompt pro vytvoření plánu (viz výše). Skill načte PRD a **doporučí vhodnou strategii** (MVP + mock data, Feasibility first, Bottom-up, Vertical slices, Horizontal).
3. **Skill se zeptá, jakou strategii chceš zvolit.** V tomto projektu byla zvolena kombinace: **MVP first** (nejdřív minimální použitelný produkt s mock daty), poté **Feasibility test** (ověření rizikových částí – např. OpenAI rozpoznání).
4. Projdi iteraci seznamu etap: skill nabídne přidání, odebrání nebo změnu pořadí; uprav podle potřeby.
5. Po odsouhlasení seznamu etap potvrď, že má agent vytvořit **detail plánu** (cíle etap, requirements, testy). Teprve pak se vytvoří soubor `docs/PLAN-<název>.md`.
6. Po uložení plánu skill tiše zkontroluje pokrytí PRD a upozorní jen při chybějících požadavcích.

### Výstup
- **docs/PLAN-Document-Scanner.md** (nebo dle názvu PRD) – etapy s cíli, odkazy na R1/R2…, typy a konkrétní testy, checkboxy pro stav.

### Poznámky
- Strategie **MVP first** + **Feasibility test** byla zvolena proto, aby šlo nejdřív „ohmatat“ UX a flow s mock daty, a poté ověřit reálné rozpoznání (OpenAI) před plnohodnotnou implementací.
- Soubor plánu se vytváří až po explicitním potvrzení uživatele („Jsi s plánem spokojený? Můžu přejít k detailu a uložení?“).

---

## 3. Implementace

### Prompt(y)
```
Implementuj etapu 1 z plánu.
```
(Po dokončení etapy 1 obdobně: „Implementuj etapu 2“, „Implementuj etapu 3“ – vždy jedna etapa na základě `docs/PLAN-*.md`.)

### Postup
1. **Začni implementaci až po potvrzení** – podle pravidel projektu (PRD + plán) se s kódem začíná až když uživatel výslovně potvrdí (např. „Jsi s plánem spokojený? Můžu přejít k implementaci?“).
2. **Etapa po etapě:** Nepovoluj najednou celý plán. Postupně povoluj jednu etapu: „Implementuj etapu 1“, po jejím dokončení „Implementuj etapu 2“, pak „Implementuj etapu 3“ atd.
3. **Po každé etapě:** Otestuj změny (spuštění aplikace, manuální / automatické testy dle plánu). Můžeš se agenta zeptat: „Kam / jak mám tuto etapu otestovat?“ – agent tě navede (co spustit, na co kliknout, co zkontrolovat).
4. **Po každé etapě:** Ulož stav do Gitu – commit (a případně push), aby byl fungující krok verzován a šlo se v případě potřeby vrátit.

### Výstup
- **Implementovaný kód** – nové nebo upravené soubory v projektu (komponenty, logika, konfigurace) podle jednotlivých etap plánu.
- **Aktualizovaný plán** – v `docs/PLAN-*.md` označené splněné položky (checkboxy `[x]`) u dokončených etap.
- **Commity v Gitu** – každá etapa zvlášť verzovaná, takže je možné se vracet k předchozím stavům.
- **Fungující aplikace** – po dokončení všech etap aplikace splňující scope z PRD a testovatelná dle plánu.

### Poznámky
- Postup „etapa → test → git“ zmenšuje riziko rozbití a umožňuje přehledné revize a rollback.
- Na návod k testování se stačí zeptat („Kam ji mám otestovat?“) – agent má kontext etapy a plánu a může tě provést.

---

## 4. Bezpečnostní review / úpravy

### Prompt(y)
Nejprve review kódu (nepoužité fragmenty):
```
Vše funguje. Udělej mi review kódu, zda tam nezůstaly nějaké nepoužité fragmenty.
```
V dalším kroku bezpečnostní review:
```
Udělej mi bezpečnostní review.
```

### Postup
1. **Nejprve review kódu:** Po dokončení implementace a otestování požádej o review kódu (viz prompt výše). Agent projde kód a upozorní na mrtvý kód, nepoužité importy, zbytečné soubory atd. Úpravy případně proveď a znovu ulož do Gitu.
2. **Poté bezpečnostní review:** V dalším kroku požádej o bezpečnostní review – využije se skill security-review (`.cursor/skills/security-review/`). Agent projde konfiguraci, MCP, skills a kód z hlediska OWASP a doporučení; navrhne úpravy.
3. **Review iterovat vícekrát:** Je vhodné review (kód i bezpečnost) opakovat – po opravách znovu spusť „Udělej mi review kódu“ resp. „Udělej mi bezpečnostní review.“ **Každou iteraci dělej v novém kontextovém okně** (nový chat = „čistá hlava“), aby agent neviděl předchozí diskusi a posoudil kód znovu. Při každém kole oprav **jen vážné chyby**, u kterých máš pocit, že dávají smysl. Když ti review začne vracet jen drobnosti (kosmetika, volitelné tipy), máš hotovo.

### Výstup
- **Vyčištěný kód** – odstraněné nepoužité fragmenty, importy a soubory; změny zaregistrované v Gitu.
- **Výstup bezpečnostního review** – zpráva nebo seznam nálezů (konfigurace, citlivá data, MCP, OWASP), včetně doporučených úprav.
- **Provedené bezpečnostní úpravy** (volitelně) – aplikované opravy podle doporučení a nové commity.

### Poznámky
- Pořadí: nejdřív „uklidit“ kód (nepoužité fragmenty), pak bezpečnostní audit.
- Review iterovat několikrát, vždy v novém kontextu (nový chat = čistá hlava). Opravuj jen to závažné, co považuješ za smysluplné. Hotovo = review vrací jen drobnosti.

---

## 5. Jablotronní vzhled (skill)

V této kapitole si vyzkoušíte, jak nechat AI **upravit už hotovou aplikaci** do firemního Jablotronního vzhledu za použití skillu **ui-designer-jablotron**. Skill se aktivuje pouze tehdy, když uživatel **výslovně** požádá o Jablotron vzhled.

### Prompt(y)
```
Uprav aplikaci do Jablotronního vzhledu. Použij skill pro Jablotron design.
```
(Případně: „Chci, aby aplikace vypadala jako Jablotron“, „Aplikuj Jablotron styl na UI“, „Uprav UI podle Jablotron designu“ – skill reaguje na výslovnou zmínku Jablotron vzhledu.)

### Postup
1. **Načasování:** Tuto fázi zařaďte **až po review kódu a bezpečnostním auditu** (kapitola 4). Aplikace by měla být vyčištěná a zkontrolovaná, aby agent mohl konzistentně upravit barvy, typografii, header, tab bar a mezery.
2. **Zadej prompt** (viz výše). Agent načte skill z `.cursor/skills/ui-designer-jablotron/` a aplikuje designové tokeny (barvy, mezery, typografie, ohraničení) a UX pravidla pro header (žlutý pruh, název aplikace, hamburger menu), spodní tab bar a karty/panely.
3. **Projdi změny:** Po úpravách otestuj vzhled v aplikaci (Expo). Skill definuje např. barvu headeru (`#fbc02d`), primární tlačítka (`#ffc300`), pozadí stránek a tab baru; ověř, že se změny projevily na všech hlavních obrazovkách.
4. **Iterace (volitelně):** Pokud něco nesedí (např. kontrast, velikost písma), upřesni v chátu („Zvětši nadpisy na hlavní obrazovce“, „Tab bar ať má větší ikony“). Agent upraví podle téhož skillu.
5. **Commit:** Po spokojenosti ulož změny do Gitu (commit), aby byl „Jablotronní“ stav verzován.

### Výstup
- **Upravené UI** – komponenty a styly aplikace v souladu s Jablotron designem: header bar, menu, spodní tab bar, barvy, mezery a typografie dle skillu.
- **Commit v Gitu** – verzovaný stav aplikace s Jablotronním vzhledem.

### Poznámky
- Skill se **nepoužívá automaticky** – pouze když výslovně požádáš o Jablotron vzhled. Vhodné pro školení jako ukázka „aplikace jednoho skillu na hotový produkt“.

---

## Šablona pro nový záznam

Pro rychlé vložení zkopírujte níže:

```markdown
## [Název úkolu / fáze]

### Prompt(y)
\```
(vložte prompt)
\```

### Postup
1. 
2. 
3. 

### Výstup / výsledek
- 

### Poznámky pro školení
- 
```

---

## Odkazy na skills a nástroje

- **PRD** — `.cursor/skills/product-requirements/`
- **Plán projektu** — `.cursor/skills/project-plan/`
- **Security review** — `.cursor/skills/security-review/`
- **UI designer (Jablotron)** — `.cursor/skills/ui-designer-jablotron/`

---

*Poslední úprava: únor 2025*
