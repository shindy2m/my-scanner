---
name: testing
description: Z PRD vytvoří plán E2E testů podle reference; implementaci testů provede jen na výslovnou žádost. Použij jen když uživatel výslovně požádá o plán testů, testovací strategii, E2E mapování na PRD, nebo o doplnění/úpravu TST dokumentu.
---

# Testování z PRD (plán → review → implementace na vyžádání)

Skill slouží k **návrhu testovacího plánu** mapovaného na PRD. **Nepiš testovací kód**, dokud uživatel výslovně nepožádá o implementaci.

## Kdy skill použít (pouze na vyžádání)

- Uživatel chce **plán testů**, **testovací strategii**, **mapování E2E na PRD**, soubor `TST-…`, nebo revizi existujícího TST.
- **Nepoužívej** tento skill pro běžné psaní kódu ani automaticky u každé feature — jen když je testování tématem zprávy.

## Základní principy

1. **Vždy vycházej z PRD** — každý řádek plánu odkazuje na ID z PRD (R…, US-…), kde to dává smysl; smoke může mít `—` podle [reference.md](reference.md).
2. **Nejdřív jen dokument** — první výstup je vždy Markdown plán podle struktury v reference; žádné `*.spec.ts` ani jiný testovací kód v této fázi.
3. **Review mezi plánem a kódem** — po uložení TST nabídni review a **zastav se**; implementuj testy až po potvrzení / výslovné žádosti.
4. **Konvence souboru** — plán ukládej jako `docs/TST-<slug>.md`, stejný `<slug>` jako u `PRD-<slug>.md` a `PLAN-<slug>.md`. Při změně požadavků nejdřív aktualizuj PRD, pak uprav existující TST (ne nový soubor s jiným slugem).

## Předpoklady

- **Musí existovat PRD** (`docs/PRD-*.md`). Chybí-li PRD, nepokračuj v tvorbě TST; upozorni uživatele a navrhni nejdřív PRD (např. skill product-requirements).
- Volitelně odkaz v TST na `docs/PLAN-*.md`, pokud plán existuje a pomáhá kontextu.

## Workflow (důsledně v tomto pořadí)

### Krok 1: Načtení PRD

- Najdi a načti příslušné PRD. Je jich více — zeptej se, které použít.
- Shrň si requirements a user stories, které mají být pokryty testy.

### Krok 2: Návrh plánu testů (jen Markdown)

- Vytvoř dokument podle pořadí sekcí, sloupců tabulek a pravidel pro smoke vs. funkční bloky v [reference.md](reference.md).
- Obsah piš jazykem PRD, bez selektorů a bez konkrétních názvů testů v kódu — sloupec **Kde / poznámka** může zůstat prázdný nebo s obecnou poznámkou, dokud testy neexistují.
- Po dokončení mapování **krátce zkontroluj pokrytí**: významné R/US z PRD by měly mít řádek v některé tabulce (nebo být záměrně vynechány s důvodem v sekci Review / poznámky). Pokud něco zjevně chybí, doplň řádek nebo uveď v poznámce proč ne.
- **Do chatu** (kromě samotného TST) napiš **krátký blok doporučení** — např. chybějící nebo nejednoznačné požadavky, nelogické pořadí flow, edge cases bez zmínky v PRD, rizika pro E2E (data, prostředí, flaky body). Stačí pár bodů, ne esej.
- Když je pro srozumitelné testování nebo konzistenci **nutná drobná úprava PRD** (formulace, doplnění akceptačního kritéria, ID), **navrhni ji v chatu** konkrétně (co změnit a proč). **Neupravuj PRD v souboru** bez výslovného souhlasu uživatele; jde o návrh k rozhodnutí.

### Krok 3: Uložení a prostor pro review

- Ulož soubor jako `TST-<slug>.md` a ulož do `docs/` (pokud projekt nemá nastavená jiná pravidla)
- V chatu **nezahajuj implementaci**. Napiš uživateli např.: kde soubor leží, že jde o návrh k review, a zeptej se, zda máš po schválení pokračovat implementací testů.

### Krok 4: Implementace testů (jen na výslovnou žádost)

- Teprve když uživatel požádá (např. „implementuj E2E“, „napiš Playwright spec“), doplň testovací kód v souladu s projektem (struktura `e2e/`, konvence z [reference.md](reference.md) a z existující konfigurace repo).
- Po implementaci **aktualizuj** sloupec **Kde / poznámka** v `docs/TST-<slug>.md` (cesta ke specu, `test.describe`, případně tagy CI).

## Pravidla

- Jedna úprava rozsahu = buď aktualizuj TST, nebo jen kód — ale **mapování v TST** má zůstat pravdivé vůči tomu, co testy skutečně dělají.
- Nespouštěj tento workflow „pro jistotu“ u každé změny kódu; použití skillu je **na žádost uživatele**.

## Další materiál

- Struktura dokumentu, tabulky a příklad: [reference.md](reference.md)
