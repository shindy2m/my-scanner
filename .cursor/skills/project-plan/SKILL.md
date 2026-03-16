---
name: project-plan
description: Vytváří strukturovaný plán projektu (etapy) z PRD. Agent doporučí strategii z PRD, vytvoří seznam etap (s libovolným počtem iterací); detail plánu jen po explicitním potvrzení uživatele. Použij při žádosti o plán projektu, plán implementace, etapy, roadmapu z PRD.
---

# Plán projektu z PRD

Skill vytváří plán implementace ve formě strukturovaného Markdownu. **Kroky 1 a 2 probíhají pouze v chatu** (doporučení strategie, seznam etap a jeho iterace) – žádný soubor se zatím nevytváří. Soubor plánu (`docs/PLAN-<název>.md`) se vytvoří až v **Kroku 3** po explicitním souhlasu uživatele s detailem etap. **Krok 4** (kontrola pokrytí PRD) proběhne teprve po uložení plánu – během tvorby se s kontrolou neotravuj.

## Kdy skill použít

- Uživatel chce vytvořit plán projektu / plán implementace na základě PRD.
- Uživatel říká „etapy“, „roadmapa“, „rozlož práci“, „plán z PRD“, „jak na to postupně“.
- Před začátkem implementace – po PRD a před kódem.

## Základní princip

1. **Plán se generuje na základě PRD.** – plán odkazuje na konkrétní requirements (R1, R2…) a user stories (US-1…) z PRD.
2. **Nejprve se vytvoří hrubý plán** (seznam etap s cíli); po schválení uživatelem se teprve detailně rozpracuje (cíle etap, requirements, testy).
3. **Plán je tvořen tak,** aby každá etapa byla samostatně implementovatelná, reviewovatelná a testovatelná.
4. **Soubor plánu** se vytváří až po odsouhlasení seznamu etap (Krok 3) – strukturovaný Markdown v repo, typicky `docs/PLAN-<název>.md`, verzovaný v gitu.
5. **Stav plánu je viditelný** – u každé etapy a u položek uvnitř je zřetelně označeno, zda je hotovo (např. checkboxy `[x]` / `[ ]`).

## Referenční strategie

Při doporučení vycházej z následující tabulky. Strategie lze v průběhu času vylepšovat (v tomto souboru nebo v reference.md – rozšířené popisy).

| Strategie | Popis | Pro jaké typy úloh se hodí |
|-----------|--------|----------------------------|
| **MVP + mock data** | Nejprve minimální použitelný produkt s mock/fake daty, aby šlo vyzkoušet UX a flow bez reálných backendů. Následují etapy pro reálná API, persistenci, edge cases. | Aplikace s důrazem na UX, formuláře, wizards; když je potřeba brzy „ohmatat“ rozhraní. |
| **Feasibility first** | Nejprve ověřit rizikové nebo neznámé části (API, knihovna, integrace). Proof-of-concept nebo spike jako první etapa. Pak teprve plnohodnotné etapy. | Nové API, neznámé knihovny, integrace s externími systémy, technologická nejistota. |
| **Bottom-up (závislosti)** | Od základů: nejdřív datový model / API kontrakt / sdílené komponenty, pak vrstvy nad tím (logika, UI). | Klasické vrstvené aplikace, když závislosti mezi moduly jsou jasné. |
| **Vertical slices** | Každá etapa = jedna konkrétní user story nebo feature od UI po data („slice“). Rychle viditelné hodnoty pro uživatele. | Když je důležitá rychlá dodávka hodnoty po malých celcích; agilní iterace. |
| **Horizontal (vrstvy)** | Nejprve celá vrstva (např. všechna API), pak další vrstva (např. celé UI). | Menší projekty, když tým dobře zná stack a rizika jsou nízká. |

Uživatel může chtít hybrid (např. „nejdřív feasibility pro API, pak MVP s mocky“) – pak zkombinuj strategie do lineární posloupnosti etap.

## Workflow (důsledně v tomto pořadí)

### Krok 1: Doporučení strategie a seznam etap

- Načti PRD projektu. Je-li PRDů víc, zeptej se který použít. **Chybí-li PRD,** upozorni uživatele a doporuč mu, aby začal vytvořením PRD (např. pomocí skillu product-requirements); bez PRD nepokračuj.
- **Doporuč vhodnou strategii** na základě obsahu PRD a tabulky strategií výše (stručně zdůvodni, proč tato strategie).
- Na základě doporučené strategie a PRD vytvoř **seznam etap**. **Neuváděj etapy v tabulce:** každou etapu uveď jako nadpis (např. **E1: Název etapy**) a pod ním na další řádek cíl etapy (detail v jedné větě nebo krátkém odstavci).
- Nabídni iteraci: „Chceš něco přidat, odebrat nebo změnit pořadí?

### Krok 2: Iterace seznamu etap

- Umožni uživateli **libovolný počet iterací** seznamu etap (přidat, odebrat, změnit pořadí, přeformulovat cíle). Seznam vždy uváděj ve formátu nadpis etapy + cíl pod ním (ne tabulku).
- Nabídni iteraci: „Chceš něco přidat, odebrat nebo změnit pořadí?

### Krok 3: Detail etap a uložení plánu do souboru

- Teprve v tomto kroku vytvoř soubor plánu. Pro každou etapu doplň podle šablony v [reference.md](reference.md):
  - **Cíl etapy**
  - **Řešené requirements** (odkazy na PRD: R1, R2, US-1…)
  - **Typy testů** (např. unit, integrační, E2E, manuální)
  - **Konkrétní testy** (co přesně bude otestováno)
- U každé etapy a u položek uvnitř použij checkboxy `[ ]` pro „není hotovo“, `[x]` pro „hotovo“, aby byl stav implementace z plánu zřejmý.
- Plán ulož do projektu. **Název souboru** vždy odvoď z názvu PRD: `PRD-<název>.md` → `PLAN-<název>.md` (např. `docs/PRD-Document-Scanner.md` → `docs/PLAN-Document-Scanner.md`). Jde-li o plán na implementaci změn v PRD (doplňky, revize), přidej suffix, např. `-zmeny` nebo `-v2` → `docs/PLAN-Document-Scanner-zmeny.md`.
- Během Kroku 1–3 s kontrolou pokrytí PRD **neotravuj** – žádné průběžné upozorňování na vynechané požadavky.

### Krok 4: Kontrola pokrytí PRD (až po uložení plánu)

- **Teprve po uložení plánu** (po Kroku 3) tiše porovnej všechny requirements (R1, R2, …) a user stories (US-1, …) z PRD s tím, co je v plánu přiřazeno k etapám.
- **Upozorni pouze tehdy,** když některé požadavky v plánu nefigurují v žádné etapě – pak výslovně uveď, které konkrétně chybí (např. „V plánu nejsou zahrnuty: R3, US-2.“). Pokud je vše pokryto, nic nepiš.
- Při pozdější úpravě už uloženého plánu (např. po odebrání etapy) znovu tiše proveď kontrolu a vyjmenuj chybějící R…, US-… pouze v případě, že nějaké jsou.

## Pravidla pro tvorbu plánu

- Jedna etapa = jeden minimální logický celek, který jde implementovat a otestovat samostatně.
- V plánu vždy odkazuj na PRD (číslované requirements, user stories), neopisuj je.
- Kontrolu pokrytí PRD prováděj pouze v Kroku 4 (po uložení), ne během tvorby plánu; pokud něco chybí, upozorni na vynechané (R…, US-…).


## Další materiál

- Šablona plánu: [reference.md](reference.md)
