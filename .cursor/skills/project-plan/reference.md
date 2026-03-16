# Referenční materiál: plán projektu

**Strategie:** Kompaktní tabulka strategií pro doporučení agentem je ve [SKILL.md](SKILL.md).

---

## Šablona plánu

Plán ukládej do projektu (doporučeně `docs/PLAN-<název>.md`). Používej checkboxy pro stav: `[ ]` = není hotovo, `[x]` = hotovo.

```markdown
# Plán: [Název projektu / feature]

**Zdroj:** [odkaz na PRD, např. docs/PRD-Document-Scanner.md]  
**Strategie:** [zvolená strategie, např. MVP + mock data]  
**Poslední aktualizace:** YYYY-MM-DD

## Přehled etap

| # | Etapa | Cíl (stručně) | Stav |
|---|--------|----------------|------|
| 1 | [Název] | [1–2 věty] | [ ] / [x] |
| 2 | ... | ... | ... |

---

## Etapa 1: [Název]

- **Stav:** [ ] / [x]
- **Cíl etapy:** [Co má být po této etapě hotové; proč tato etapa existuje.]
- **Řešené requirements:** [Odkazy na PRD: R1, R2, US-1, …]
- **Typy testů:** [např. unit, integrační, E2E, manuální]
- **Konkrétní testy:**
  - [ ] [Popis testu 1 – co přesně se ověří]
  - [ ] [Popis testu 2]
- **Poznámky / závislosti:** [volitelné]

*Po dokončení: kontrola + commit, pak teprve etapa 2.*

---

## Etapa 2: [Název]

[Stejná struktura jako u Etapy 1.]

---

