---
name: ui-designer-jablotron
description: Designové tokeny, UX pravidla (header, menu, tab bar), barvy, mezery, typografie. Použij pouze tehdy, když uživatel výslovně požádá o Jablotron vzhled.
---

# UI Styles a UX pravidla

**Kdy použít:** Tento skill **ignoruj**, pokud uživatel výslovně nepožádá o **Jablotron vzhled** (např. „chci Jablotron vzhled“, „styl Jablotron“, „vypadat jako Jablotron“). Nepoužívej ho automaticky při úpravách UI.

Minimální sada tokenů (barvy, mezery, typografie, ohraničení) a UX pravidla pro header, menu a spodní tab bar.

---

## Barvy (sémantické role)

**Text:** primary `#212121`, secondary `#454a54`, tertiary `#7b7f93`, disabled `#b4b3b3`, light `#ffffff`. Link `#1aa9f5`, positive `#64c315`, warning `#ff8800`, negative `#fb0a0a`.

**Surface:** base `#ffffff`, disabled `#e4e5e7`, gray `#ecedee`.

**Background:** default `#f9f9f9`, action `#f3f4f6`. Info `#e8f6fe`, positive `#eff9e8`, negative `#ffe6e6`, warning `#fff3e5`.

**Border:** primary `#e4e5e7`, light `#f3f4f6`, action `#b6b9ca`. Selected `#ffc300`.

**Button:** primary `#ffc300`, primary-press `#fab400`. Secondary `#ecedee`. Blue `#1aa9f5`, white `#ffffff`, negative `#fb0a0a`.

**Header:** headerBar `#fbc02d`, headerBrandLight `#f5f5f5`.

---

## Mezery (4px škála)

0.5→2, 1→4, 2→8, 3→12, 4→16, 5→20, 6→24, 8→32, 10→40, 12→48, 14→56, 16→64, 20→80, 24→96. Typicky padding 16–24px, mezery 8–12px.

---

## Typografie

**Velikost:** xs 12, sm 14, base 16, lg 18, xl 20, 2xl 24, 3xl 30, 4xl 36 (px).

**Řez:** normal 400, medium 500, semibold 600, bold 700.

**Řádkování:** 3→12, 4→16, 5→20, 6→24, 8→32 (px).

---

## Ohraničení

**Radius:** sm 2, rounded 4, md 6, lg 8, xl 12, 2xl 16, full 9999 (px). Karty/tlačítka md nebo lg.

**Šířka:** thin 1, medium 2, thick 4 (px).

---

## Header (horní pruh) — UX

- **Účel:** Identita aplikace a přístup k sekundární navigaci (menu). Vždy zobrazit **název aplikace** a **hamburger menu**.
- **Vzhled:** Pozadí `headerBar` (#fbc02d). Bez zaoblených rohů, bez stínu.
- **Obsah:** Vlevo — první část textu (např. „My“) `headerBrandLight`, druhá část (název app) tučná bílá. Vpravo — ikona hamburger menu, barva `textPrimary`. Padding cca 16px; konzistentní horizontální mezery.

---

## Menu (hamburger / boční panel) — UX

- **Účel:** Sekundární navigace, nastavení, nápověda, odhlášení a další akce, které nepatří do hlavních oblastí aplikace.
- **Povinně:** V menu **vždy zobrazit informaci o verzi aplikace** (např. „Verze 1.2.3“ nebo „v1.2.3“), typicky v dolní části menu nebo u patičky panelu, aby byl uživatel mohl identifikovat build při hlášení chyb nebo při podpoře.

---

## Spodní tab bar — UX a vzhled

- **Účel (UX):** Hlavní navigace mezi **primárními oblastmi aplikace** (hlavní obrazovky, sekce). Tab bar slouží k přepínání kontextu (např. Akce / Historie / Nastavení), ne k jednorázovým akcím. Počet položek typicky 2–5; každá položka = jedna hlavní oblast. Tab bar zůstává viditelný a dostupný napříč těmito oblastmi (persistentní primary navigation).
- **Vzhled:** Pozadí `surfaceBase` (bílá). Horní okraj: `borderPrimary`. Bez stínu (elevation 0, shadowOpacity 0).
- **Položky:** Ikona nad textem (below-icon). **Aktivní** oblast: `buttonPrimary` (žlutá). **Neaktivní:** `textSecondary` (šedá). Vždy zřetelně rozlišit aktivní položku.
- **Výška:** Obsah tab baru cca 72px. Safe area dole respektovat (paddingBottom = bottom inset); stejný prostor nad ikonami (paddingTop) pro výškovou symetrii.

---

## Pravidla (vzhled)

1. Pozadí stránky → bgDefault nebo surfaceBase.
2. Karty/panely → surfaceBase, border primary, radius md/lg.
3. Hlavní text → text primary; vedlejší → text secondary.
4. Odkazy → textLink; chyby → textNegative; úspěch → textPositive.
5. Hlavní CTA → button primary; vedlejší → button secondary.
6. Mezery → 4/8/12/16/24 ze škály.
