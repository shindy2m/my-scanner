# Školení AI vývoje (Cursor, skills, metodika)

Tento repozitář slouží jako **šablona pro školení** — obsahuje Cursor rules, skills a návod k postupům. Aplikace se během školení buduje od nuly (PRD → plán → implementace).

## Návod školení

**→ [docs/skoleni.md](docs/skoleni.md)** — metodika, prompty a kroky (PRD, plán, implementace, security review, Jablotronní vzhled).

## Co v repozitáři najdete

- **`.cursor/rules/`** — pravidla pro agenta (PRD a plán před implementací, struktura projektu).
- **`.cursor/skills/`** — skills pro PRD, plán projektu, security review a Jablotronní UI.
- **`docs/`** — návod školení; po zahájení projektu sem přibudou `PRD-*.md` a `PLAN-*.md`.
- **`assets/`** — obrázky a další materiály pro cvičení (např. testovací dokumenty).
- **`.cursorignore`**, **`.gitignore`** — vyloučení citlivých souborů (např. `.env`) z indexování a z Gitu a z kontextu pro AI
- **`.env.example`** — šablona pro lokální proměnné (API klíče apod.); pro běh zkopírujte na `.env`.

Po naklonování a otevření v Cursoru postupujte podle návodu v `docs/skoleni.md`.
