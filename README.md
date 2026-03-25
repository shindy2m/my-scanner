# Školení AI vývoje (Cursor, skills, metodika)

Tento repozitář slouží jako **šablona pro školení** — obsahuje Cursor rules, skills a návod k postupům. Aplikace se během školení buduje od nuly (PRD → plán → implementace).

## Pozvánka na školení

**→ [docs/pozvanka-prezentace.md](docs/pozvanka-prezentace.md)** — text pozvánky (krátký e-mail) na prezentaci / školení: o čem to bude, pro koho, odkaz na tento repozitář.

## Návod školení

**→ [docs/skoleni.md](docs/skoleni.md)** — metodika, prompty a kroky (PRD, plán, implementace, security review, E2E plán, Jablotronní vzhled).

## Co v repozitáři najdete

- **`.cursor/rules/`** — pravidla pro agenta (PRD a plán před implementací, struktura projektu).
- **`.cursor/skills/`** — skills pro PRD, plán projektu, plán E2E testů (TST), security review a Jablotronní UI.
- **`docs/`** — návod školení; po zahájení projektu sem přibudou `PRD-*.md`, `PLAN-*.md` a podle potřeby `TST-*.md` (testovací plán mapovaný na PRD).
- **`assets/`** — obrázky a další materiály pro cvičení (např. testovací dokumenty).
- **`.cursorignore`**, **`.gitignore`** — vyloučení citlivých souborů (např. `.env`) z indexování a z Gitu a z kontextu pro AI
- **`.env.example`** — šablona pro lokální proměnné (API klíče apod.); pro běh zkopírujte na `.env`.

Po naklonování a otevření v Cursoru postupujte podle návodu v `docs/skoleni.md`.
