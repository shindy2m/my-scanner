# Metodika AI vývoje — Cursor, skills a opakovatelné postupy

Tento dokument popisuje **průběh školení** – na co se zaměřit.

## Úvod

Primárním cílem školení je ukázat, jak lze s pomocí AI dosáhnout 
 - **Opakovatelnosti** — proces vývoje je vždy stejný
 - **Požadované kvality** — výstup odpovídá našim standardům a je konzistentní, stále stejný

Sekundárním cílem je ukázat
- **Context-Driven Development** — společný kontext pro lidi i AI: PRD, rules, skills jako jediný zdroj pravdy; odtud plány (vývoj, testy), implementace a dokumentace
- **Vývoj mobilní aplikace** — S využitím Expo Go
- **Napojení na OpenAI API** — pro rozpoznání obrazu


### Co použijeme
- **Rules** — pevně stanovená pravidla/hranice
  - **project-structure** - adresářová struktura v projektu
  - **development-process** - metodika vývoje (nejdříve PRD)

- **Skills:**
  - **product-requirements** — tvorba a úprava PRD v metodice Context-Driven Development
  - **project-plan** — plán vývojových etap odvozený z PRD a zastavování vývoje v bodech kontroly (Quality Gates)
  - **testing** — struktura E2E testů a jejich plán odvozený z PRD
  - **security-review** — bezpečnostní audit
  - **ui-designer-jablotron** — UI a UX pravidla

### Přehled metodiky (ilustrace)

Níže: vstupy (lidé, AI), **jediný zdroj pravdy** (PRD + rules + skills), společný kontext a výstupy — plán vývoje, plán testů, dokumentace.

![Context-Driven Development — přehled metodiky (školicí materiál)](./Context-Driven%20Development.png)

### Příprava na školení

Před školením si kromě **Cursoru** nainstalujte:

| Co | Proč | Kde stáhnout |
|----|------|--------------|
| **Cursor** | Editor s AI (Chat, Agent). | [cursor.com](https://cursor.com) |
| **Node.js 18+** | Běh projektu (Expo, npm). Ověření: `node -v` | [nodejs.org](https://nodejs.org) (LTS) |
| **npm** (nebo yarn) | Instalace závislostí a spuštění skriptů. Ověření: `npm -v` | Součást Node.js; příp. [npmjs.com](https://www.npmjs.com) |
| **Git** | Verzování a commity během cvičení. Ověření: `git --version` | [git-scm.com/downloads](https://git-scm.com/downloads) |
| **Expo Go** na telefonu | Pro testování aplikace na reálném zařízení. Použijte verzi s **SDK 54**. | [Expo Go – Android](https://play.google.com/store/apps/details?id=host.exp.exponent), [Expo Go – iOS](https://apps.apple.com/app/expo-go/id982107779); viz též [expo.dev](https://expo.dev) |

**Doporučení:** Mít repozitář projektu naklonovaný a otevřený v Cursoru, aby bylo možné ihned spouštět příkazy (`npm install`, `npx expo start`) a procházet soubory (PRD, plán, skills v `.cursor/skills/`).

## Kapitola 1: Příprava standardizovaného PRD z "Hrubých požadavků"

### Prompt(y)
```
Vytvoř aplikaci na skenování dokumentů
 - Jméno aplikace MySCANNER
 - React Native, Expo (SDK 54), OpenAI
 - Aplikace mi umožní načíst dokumenty, rozpoznat jejich obsah, uložit jejich přepis a oštítkovat podle typu
 - Vstup: fotoaparát, obrázek z galerie, dokument ze souboru
 - Aplikace rozpozná typ dokumentu a navrhne štítek. Uživatel má ale možnost typ štítku změnit
 - Pro každý typ dokumentu budou definovány standardní údaje, které chci ihned zobrazit a také shrnout na začátku přepisu.
 - Uložený přepis pak bude kromě standardních údajů obsahovat i ostatní informace ze skenovaného dokumentu. 
 - Typy: Faktura, Účtenka z obchodu, Vizitka
 - Bude možné prohlížet historii naskenovaných dokumentů a třídit je podle typu, prohlížet přepisy a naskenované dokumenty
 - Data budou uložena pouze lokálně po dobu běhu aplikace 
```

### Výstup
- **PRD = Product Requirements Document** (např. `docs/PRD-my-scanner.md`) – strukturovaná specifikace podle šablony: Přehled, Scope, User stories a requirements, Nefunkční požadavky, Závislosti, Glosář.
- **Slug v názvu souboru** (`PRD-<slug>.md`) volte konzistentně s produktem nebo repozitářem; pro aplikaci **MySCANNER** a repo **my-scanner** použijte slug `my-scanner`. Stejný slug pak u `PLAN-<slug>.md` a `TST-<slug>.md`.

### Postup
1. **Nejprve nech vytvořit specifikaci** – zadej své požadavky (viz prompt výše). Agent použije skill product-requirements a vygeneruje celý PRD do souboru. S plánem ani kódem zatím nezačínej.
2. **Potom nad PRD iteruj** – projdi vygenerovaný dokument sekci po sekci (viz níže), upravuj požadavky přes chat („V PRD doplň…“, „V scope vyřaď…“, „Přidej user story pro…“). Agent upraví PRD na místě. Opakuj, dokud nejsi s obsahem spokojen.
3. **Review s čistým kontextem (volitelně):** Otevři **nového agenta** (nový chat = prázdný kontext, „čistá hlava“) a nech si nad PRD udělat review – např. „Projdi tento PRD [odkaz/ vložený soubor] a udělej review: úplnost, konzistence, chybějící požadavky.“ Nový agent nemá předchozí diskusi a vidí jen PRD, takže může upozornit na mezery nebo nejasnosti, které by tvůrčí agent přehlédl.
4. **Až po potvrzení PRD** – teprve když řekneš „Jsem s PRD spokojený, můžeš přejít k plánu“, má agent vytvořit plán etap (kapitola 2).

### Poznámky
- Důležité je pořadí: **nejdřív celá specifikace, pak iterace nad ní** – ne začít kódovat z prvního promptu.
- S přípravou plánu AI agent začne až po výslovném potvrzení spokojenosti s PRD (pravidlo projektu v `.cursor/rules`).
- **Proč PRD**? 
  - Protože kvalitní kontext je **nutný pro AI** a dobře čitelný pro lidi.
  - Jeden zdroj pravdy.
  - S využitím AI lehce aktualizovatelný.
  - Standardní formát umožní napojení na další navazující aktivity (vývoj, testing, dokumentace API)
  - **Context-Driven Development** — cílem nejsou dokumenty samy o sobě, ale sdílený kontext (PRD + rules + skills), ze kterého plyne plán, kód i testy.



## Kapitola 2: Plán projektu & Etapy - Quality Gates

### Prompt(y)
```
Vytvoř plán projektu z PRD.
```
(Případně: „Chci vytvořit plán implementace“, „Vytvoř etapy z PRD“, „Jak na to postupně?“ – skill project-plan reaguje na tyto formulace.)

### Postup
1. Ujisti se, že existuje PRD (např. `docs/PRD-my-scanner.md`). Bez PRD skill plánování nepokračuje.
2. Zadej prompt pro vytvoření plánu (viz výše). Skill načte PRD a **doporučí vhodnou strategii** (MVP + mock data, Feasibility first, Bottom-up, Vertical slices, Horizontal).
3. **Skill se zeptá, jakou strategii chceš zvolit.** V tomto projektu byla zvolena kombinace: **MVP first** (nejdřív minimální použitelný produkt s mock daty), poté **Feasibility test** (ověření rizikových částí – např. OpenAI rozpoznání).
4. Projdi iteraci seznamu etap: skill nabídne přidání, odebrání nebo změnu pořadí; uprav podle potřeby.
5. Po odsouhlasení seznamu etap potvrď, že má agent vytvořit **detail plánu** (cíle etap, requirements, testy). Teprve pak se vytvoří soubor `docs/PLAN-my-scanner.md`.
6. Po uložení plánu skill tiše zkontroluje pokrytí PRD a upozorní jen při chybějících požadavcích.

### Výstup
- **docs/PLAN-my-scanner.md** – etapy s cíli, odkazy na PRD, návodem jak otestovat a checkboxy pro stav.

### Poznámky
- Strategie **MVP first** + **Feasibility test** byla zvolena proto, aby šlo nejdřív „ohmatat“ UX a flow s mock daty, a poté ověřit reálné rozpoznání (OpenAI) před plnohodnotnou implementací.
- Etapy jako Quality Gates – po každé etapě review a commit


## Kapitola 3: Implementace

### Prompt(y)
```
Implementuj etapu 1.
```
(Po dokončení etapy 1 obdobně: „Implementuj etapu 2“, „Implementuj etapu 3“ – vždy jedna etapa na základě `docs/PLAN-my-scanner.md`.)

### Postup
1. **Začni implementaci až po vyladění PRD** – I když pozdější změny jsou možné. AI je v tomto velice silná - dělat hromadné změny, pohlídat si konzistenci a analyzovat dopady.
2. **Etapa po etapě:** Nepovoluj najednou celý plán. Postupně povoluj jednu etapu: „Implementuj etapu 1“, po jejím dokončení „Implementuj etapu 2“, pak „Implementuj etapu 3“ atd.
3. **Po každé etapě:** Otestuj změny (spuštění aplikace, manuální / automatické testy dle plánu). Můžeš se agenta zeptat: „Kam / jak mám tuto etapu otestovat?“ – agent tě navede (co spustit, na co kliknout, co zkontrolovat).
4. **Po každé etapě:** Ulož stav do Gitu – commit (a případně push), aby byl fungující krok verzován a šlo se v případě potřeby vrátit.

### Výstup
- **Implementovaný kód** – nové nebo upravené soubory v projektu (komponenty, logika, konfigurace) podle jednotlivých etap plánu.
- **Aktualizovaný plán** – v `docs/PLAN-my-scanner.md` označené splněné položky (checkboxy `[x]`) u dokončených etap.
- **Commity v Gitu** – každá etapa zvlášť verzovaná, takže je možné se vracet k předchozím stavům.
- **Fungující aplikace** – po dokončení všech etap aplikace splňující scope z PRD a testovatelná dle plánu.

### Poznámky
- Postup **„etapa → test → git“** zmenšuje riziko rozbití a umožňuje přehledné revize a rollback.
- **Když nevím, zeptám se AI**. Agent má díky PRD kvalitní kontext a díky Plánu přesně ví, co už je a co není implementované. 
  - *Co už je hotové?*
  - *Jak to spustím?*
  - *Je to v commitnuté?*
  - *Jak to mám otestovat?*
  - *Co budeme dělat dál?*
- Díky PRD a plánu mohu klidně dát rozpracovaný stav do Gitu a **pokračovat může někdo jiný** 

## Kapitola 4: Bezpečnostní review / úpravy

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


## Kapitola 5: Ovlivňování kvality výstupu - Jablotronní vzhled

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
4. **Iterace (volitelně):** Pokud něco nesedí (např. kontrast, velikost písma), upřesni v chatu („Zvětši nadpisy na hlavní obrazovce“, „Tab bar ať má větší ikony“). Agent upraví podle téhož skillu.
5. **Commit:** Po spokojenosti ulož změny do Gitu (commit), aby byl „Jablotronní“ stav verzován.

### Výstup
- **Upravené UI** – komponenty a styly aplikace v souladu s Jablotron designem: header bar, menu, spodní tab bar, barvy, mezery a typografie dle skillu.
- **Commit v Gitu** – verzovaný stav aplikace s Jablotronním vzhledem.

### Poznámky
- Skill lze nastavit tak, že se **nepoužívá automaticky** – pouze když výslovně požádáš o Jablotron vzhled. 
- Tohle je pouze jednoduchý skill pro školení, **v reálu může obsahovat** 
  - celé projektové templaty, 
  - sady komponent, 
  - storybooky, 
  - sady knihoven pro validaci dat, 
  - rate limiting, 
  - popis backend API, 
  - best practice
  - popis technologického stacku
  - používané architektonické vzory
  - lessons learned pro AI (aby neopakovala chyby)

## Kapitola 6: Implementace E2E testování (Playwright)

Tato kapitola ukazuje využití skillu **testing** (`.cursor/skills/testing/`). 

### Prompt(y)

```
Doplň do aplikace testy
```
```
Implementuj smoke test
```
```
Implementuj testy historie
```
```
Implementuj zbývající testy
```

### Postup
1. **Zadej prompt** (`Doplň do aplikace testy`). Skill má opět pravidlo, že nejdřív se vytváří plán testů. Požadavek tedy nejdřív koriguje (nic neimplementuje) a vytvoří plán.
2. **Zkontroluj plán** — Proveď kontrolu plánu a případné korekce. Struktura plánu podle `.cursor/skills/testing/reference.md`.
3. **Kontrola pokrytí a krátká doporučení** — Agent zkontroluje konzistenci plán vs. PRD a do chatu přidá pár doporučení.
4. **Spusť implementaci prvního testu** — Tím se odladí a odzkouší testovací prostředí.
5. **Pokračuj s implementací dalších testů** — Základ je odzkoušený, teď už to můžeš nechat celé na agentovi.

### Výstup

- **Nejprve plán** — `docs/TST-my-scanner.md`, plán E2E testů mapovaný na PRD. 
- **Po implementaci** soubory testů (např. Playwright v `e2e/`) a aktualizovaný TST s odkazy na konkrétní specy.

### Poznámky

- Skill definuje proces - nejdřív PRD, pak plán, pak implementace
- Skill definuje kam se testy uloží v projektové struktuře
- Skill definuje technologický stack
- Skill může přikázat používání konkrétních toolů, MCP
- Skill mi může pomoct vyhodnotit výstupy z testů 

## Kapitola 7: Vytvoření vlastního skillu

Vytvořit nový skill je triviální

### Prompt(y)
```
Vytvoř mi skill user-manual-builder, který mi na základě PRD vygeneruje dokumentaci. Formát dokumentace popiš v reference.md. Dokumentaci chci jako webové stránky, pro koncové uživatele. 
```

### Postup
1. **Zadej prompt** (viz výše) – Cursor vytvoří skill na správném místě a se správnou strukturou.
2. **Koukni do Cursor Settings → Rules, Skills, Subagents** – skill je v seznamu, Cursor ho vidí a umí použít.
3. **Prozkoumej skill** – otevři `SKILL.md` (a případně `reference.md`) v `.cursor/skills/user-manual-builder/` a uprav si obsah dle potřeby.

### Výstup / výsledek
- Hotový skill v `.cursor/skills/user-manual-builder/` (adresář odpovídá názvu z promptu výše).

### Poznámky pro školení
- Spoustu skillů lze stáhnout z webu, ale pozor na bezpečnost.
- Minimálně po stažení cizího skillu požádat AI o security review.
- Mohu požádat AI o vytvoření mého skillu na základě jiného (staženého)
- Tipy na skills
  - Tahání dat z mého profilu na LinkedIn
  - Těžení dat z trhu a analytika nad daty
  - Napojení na můj slack/email a vytváření přehledů
  - Podpora při náboru
  - Vytvoření psychologického profilu na základě historie komunikace
- Bezpečnost
  - Aplikace tipu "stáhnu data" - "Uložím je lokálně" - "někam pak zapisuju" je velice lehké napadnout

## Bezpečnost
Můžeš zkusit tenhle prompt a pobavit se s AI o bezpečnosti.

```
Zajímá mě bezpečnost vývojového prostředí Cursor v souvislosti s využitím AI.

To, že data posílám LLM modelu, nebo Cursoru zatím ignorujme. 
Zajímají mě hlavně ostatní útočné vektory při používání těchto modulů/technik: 
- Cursor IDE
- jeho Pluginy
- MCP, Yolo/agentní režim
- AI využívá data z webu, e-mailů, JIRA, zdrojových kódů…
- cizí skills/rules
- cizí knihovny v kódu

Co mě hlavně zajímá: jak může útočník ovládnout/ovlivnit průběh práce AI a například si nechat poslat nějaká data. 

Udělej mi přehlednou tabulku možných vektorů útoku. 
Seřaď podle závažnosti rizika.
Nevymýšlej si. Když nevíš, napiš nevím.
Nechci obecné informace, zaměř se na Cursor, ověř informace na webu (oficiální info, hodnocení nezávislých security webů, ...)
Výstup chci stručný, strukturovaný, vhodný pro laiky. Forma "pokud budeš používat XX, tak pozor na YY"
Cílem je mít návod, jak se mám jako laik chovat, když chci dosáhnout nějaké rozumné bezpečnosti, ale zároveň nebýt paralyzovaný a moct využívat AI naplno.
```

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
- **Testing (TST, E2E)** — `.cursor/skills/testing/` (struktura dokumentu: `reference.md` uvnitř skillu)
- **Security review** — `.cursor/skills/security-review/`
- **UI designer (Jablotron)** — `.cursor/skills/ui-designer-jablotron/`

---

*Poslední úprava: březen 2026*
