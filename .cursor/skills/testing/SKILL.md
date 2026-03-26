---
name: testing
description: Z PRD vytvoří dokument plánu testů (TST v docs/) a po schválení testy implementuje.
---

# Mapování PRD na seznam testů 
Skill mapuje požadavky z PRD do plánu testů v Markdownu.

## Kdy skill použít
Když chce uživatel implementovat/doplnit testy, nebo vytvořit/aktualizovat seznam testů

## Základní princip

Nejprve se vytvoří plán testů.
Plán se vytváří na základě PRD — řádky plánu odkazují na ID z PRD (R…, US-…), kde dává smysl; u smoke může být `—`, viz [reference.md](reference.md).
Testy se implementují až poté, co uživatel odsouhlasí plán a požádá o implementaci.  

## Technologie
- E2E testy v Playwright & Expo web

## Workflow (v tomto pořadí)

### Krok 1: Načtení PRD

- Načti příslušné PRD (je jich víc — zeptej se).
- Shrň R/US relevantní pro pokrytí testy.

### Krok 2: Návrh plánu (jen Markdown)

- Sekce a tabulky podle [reference.md](reference.md).
- Sloupec **Kde / poznámka** může být prázdný, dokud testy neexistují.
- Zkontroluj pokrytí významných R/US (nebo záměrné vynechání s důvodem v poznámkách).
- Do chatu krátké doporučení (nejasné požadavky, edge cases, rizika E2E).
- Návrh úprav PRD jen v chatu, ne v souboru, bez souhlasu uživatele.

### Krok 3: Uložení a review

- Ulož `docs/TST-<slug>.md` (nebo cesta dle pravidel projektu).
- V chatu nezačínej implementaci; uveď umístění souboru, že jde o návrh k review, a zeptej se na pokračování implementací.

### Krok 4: Implementace testů

- Drž se struktury repo (`__tests__/`, `e2e/`, konfigurace runneru) a obsahu TST.
- Po změnách aktualizuj sloupec **Kde / poznámka** v `docs/TST-<slug>.md`.

## Pravidla

- Po změně chování testů nebo aplikace udržuj TST v souladu s realitou (aktualizuj dokument a/nebo kód konzistentně).
- Nespouštěj workflow automaticky u každé změny kódu.

## Další materiál

- [reference.md](reference.md)
