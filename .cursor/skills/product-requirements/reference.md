# Referenční šablona a příklad PRD

## Kompletní šablona (copy-paste)

```markdown
# [Název produktu / feature]

## 1. Přehled
- **Cíl**: 
- **Cílová skupina**: 
- **Kontext**: 

## 2. Scope
- **In scope**: Velice stručně – co je zahrnuto (krátké bullet pointy). Rychlý přehled, bez odkazů na requirements.
  - 
- **Out of scope**: Velice stručně – co záměrně není (zamezit scope creep).
  - 

## 3. User stories a requirements

### US-1: [Krátký název]
**User story**: Jako [role] chci [akce] aby [hodnota].

**Requirements**:
- R1: 
- R2: 

### US-2: ...
(opakovat strukturu US-1)

## 4. Nefunkční požadavky
- 

## 5. Závislosti a omezení
- 

## 6. Glosář
- **Termín**: definice

(V textu PRD sekcí 1–5 se termíny z Glosáře píší *kurzívou*.)
```

---

## Příklad (zkrácený)

```markdown
# Export faktur do PDF

## 1. Přehled
- **Cíl**: Umožnit uživateli stáhnout vybrané faktury jako jeden PDF soubor.
- **Cílová skupina**: Uživatelé s rolí „účetní“ v desktopové webové aplikaci.
- **Kontext**: Dnes faktury jde pouze tisknout po jedné; hromadný export chybí.

## 2. Scope
- **In scope**: 
  - Výběr faktur (checkboxy), tlačítko „Export do PDF“, generování jednoho PDF.
- **Out of scope**: 
  - Úprava layoutu PDF, e-mailové odeslání, export do Excelu.

## 3. User stories a requirements

### US-1: Hromadný export
**User story**: Jako účetní chci vybrat více faktur a stáhnout je jako jedno PDF, abych je mohl poslat najednou.

**Requirements**:
- R1: Seznam faktur zobrazených v aktuálním filtru má u každé položky checkbox.
- R2: Tlačítko „Export do PDF“ je aktivní, pokud je vybrána alespoň jedna faktura; když není vybrána žádná faktura, tlačítko je disabled.
- R3: Po kliknutí se vygeneruje jeden PDF obsahující všechny vybrané faktury v pořadí podle data; soubor se stáhne s názvem `faktury_YYYY-MM-DD.pdf` (datum = dnešek); každá faktura v PDF má hlavičku s číslem faktury a datem.

## 4. Nefunkční požadavky
- PDF musí být vygenerované do 30 s pro až 50 faktur.

## 5. Závislosti a omezení
- Použít stávající PDF knihovnu schválenou v projektu (např. lib X).

## 6. Glosář
- **Faktura**: Dokument s položkami a celkovou částkou, evidovaný v systému pod jedinečným číslem.
```

---

Při vytváření nového PRD vždy začít od této struktury a zachovat terminologii z SKILL.md. Scope (In scope, Out of scope) je velice stručný přehled pro čtenáře, bez odkazů na requirements. Pro zamezení duplicit v sekci 3: jedno chování = jeden requirement; kde stejné pravidlo platí vícekrát, použij odkaz („dle R3“, „v souladu s R7“).
