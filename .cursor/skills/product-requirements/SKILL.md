---
name: product-requirements
description: Vytváří a validuje dokumenty produktových požadavků (PRD) s jednotnou strukturou a terminologií napříč projekty. Použij při žádosti o produktové požadavky, PRD, specifikaci funkce nebo při budování aplikace z požadavků.
---

# Konzistentní Product Requirements (PRD)

Skill zajišťuje jednotnou strukturu a terminologii product requirementů napříč projekty. Agent při psaní nebo revizi PRD vždy používá tuto šablonu a pravidla.

## Kdy skill použít

- Uživatel chce vytvořit nebo doplnit product requirements.
- Uživatel říká „chci PRD“, „napiš požadavky“, „specifikace funkce“, „na základě toho postav aplikaci“.
- Na začátku nového projektu nebo feature – nejdřív PRD, pak implementace.

## Základní princip

1. **Jedna šablona** – všechny PRD používají stejné sekce a terminologii (viz šablona níže).
2. **Nejdřív PRD** – před plánováním, kódem nebo designem vždy mít (nebo doplnit) stručný PRD.
3. **Od PRD k implementaci** – při budování aplikace:
   - v plánu nebo v komentářích odkazovat na konkrétní sekce (např. „Requirement R5“, „User story US-2“);
   - při potřebě změny požadavků nejdřív navrhnout úpravu PRD (doplnit sekci, změnit scope), pak měnit plán a kód.

## Šablona PRD

Každý PRD má mít tyto sekce v tomto pořadí. Pokud sekce pro daný projekt není potřeba, uvést ji s textem „N/A“ nebo jednou větou.

```markdown
# [Název produktu / feature]

## 1. Přehled
- **Cíl**: Jedna věta – proč tento produkt/feature existuje.
- **Cílová skupina**: Kdo jsou uživatelé (role, kontext).
- **Kontext**: Krátký kontext (problém, příležitost).

## 2. Scope
- **In scope**: Velice stručně – co je zahrnuto (krátké bullet pointy). Účel - rychlý přehled pro čtenáře. Bez odkazů na requirements.
- **Out of scope**: Velice stručně – co záměrně není (krátké bullet pointy). Účel - zamezit scope creep.

## 3. User stories a requirements
Pro každou hlavní schopnost:
- **User story**: Jako [role] chci [akce] aby [hodnota].
- **Requirements**: Číslovaný seznam konkrétních požadavků (měřitelných a ověřitelných).

## 4. Nefunkční požadavky
- Výkon, dostupnost, bezpečnost, lokalizace, přístupnost – pouze to, co je relevantní.

## 5. Závislosti a omezení
- Technologie, návaznosti na jiné produkty, časová, cenová či legislativní omezení – pouze to, co je relevantní.

## 6. Glosář / definice
- Specifické termíny používané v PRD (jedna řádka na termín).
```

## Pravidla pro tvorbu PRD

Při psaní i revizi PRD platí tyto pravidla. Slouží k jednotné a kvalitní specifikaci; další pravidla lze doplňovat podle potřeby.

- Jedna user story = jeden uživatelský cíl; stejné chování víc user stories → sloučit nebo odkazovat.
- Jedno konkrétní chování = jeden číslovaný requirement. Jinde odkaz („dle R3“, „v souladu s R7“), ne opis.
- Každá user story má alespoň jeden requirement; requirements jsou měřitelné a ověřitelné.
- Závislosti a omezení jen v sekci 5; v requirements na ně odkazovat.
- Každý termín definovaný v sekci 6 (Glosář) se v textu PRD (sekce 1–5) píše vizuálně odlišeně – v Markdownu *kurzívou*.

## Další materiál

- Plná šablona a příklad PRD: [reference.md](reference.md)
