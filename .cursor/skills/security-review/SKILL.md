---
name: security-review
description: Prochází kompletní strukturu projektu a kontroluje bezpečnost podle OWASP a doporučení Cursor (konfigurace, MCP, skills). Použij při žádosti o security review, bezpečnostní kontrolu, audit bezpečnosti nebo když uživatel ptá na rizika a zabezpečení aplikace.
---

# Security Review

Skill zajišťuje systematický dohled nad projektem z pohledu bezpečnosti. Agent na požádání projde strukturu projektu a použije tento checklist. Výstup je strukturovaná zpráva s nálezy a doporučeními.

## Kdy skill použít

- Uživatel chce „security review“, „bezpečnostní kontrolu“, „audit bezpečnosti“, „zkontroluj bezpečnost“.
- Před mergem větších změn nebo před release – kontrola na vyžádání.
- Po přidání nových závislostí, MCP serverů nebo cizích skills.
- Když uživatel ptá na rizika, zabezpečení aplikace nebo „je to bezpečné“.

## Základní princip

1. **Dohled, ne certifikace** – skill vede agenta, co kontrolovat; výstup slouží k identifikaci rizik a doporučení. Finální rozhodnutí má vždy uživatel.
2. **OWASP + Cursor** – kontrola vychází z OWASP (aplikace, kód, závislosti) a z doporučení pro ekosystém Cursor (MCP, skills, pravidla).
3. **Konzistentní výstup** – každý nález má závažnost, umístění, popis a doporučení; na konci shrnutí.

## Workflow

1. Projít strukturu projektu (soubory, konfigurace, závislosti, `.cursor`).
2. Pro každou oblast checklistu zkontrolovat relevantní místa a označit: ✅ OK / ⚠️ Nález / ➖ Nerelevantní nebo nelze z kontextu ověřit.
3. Nálezy popsat podle šablony výstupu níže.
4. Na závěr napsat shrnutí (počet nálezů dle závažnosti, prioritní doporučení).

## Checklist kontroly

### 1. Konfigurace a secrets

- [ ] `.env`, `.env.*` – necommitané, v `.gitignore`; v repo žádné reálné secrets
- [ ] Hardcoded hesla, API klíče, tokeny v kódu a konfiguračních souborech
- [ ] Secrets v CI/CD – používat secret store, ne plain text
- [ ] MCP konfigurace (`mcp.json` apod.) – žádné credentials v plain textu

### 2. Závislosti

- [ ] Known vulnerabilities (npm audit / pip-audit / ekvivalent dle stacku)
- [ ] Podezřelé nebo málo známé balíčky; typo-squatting
- [ ] Lockfile přítomen a verzovaný

### 3. Vstupy a injection

- [ ] Validace a sanitace uživatelských vstupů (formuláře, query, body, hlavičky)
- [ ] SQL/NoSQL/command/OS injection – parametrizované dotazy, žádné slepené řetězce
- [ ] XSS – escapování výstupu; CSP kde je to možné
- [ ] Path traversal – uživatelské cesty nepoužívat nekontrolovaně pro čtení/zápis

### 4. Autentizace a autorizace

- [ ] Hesla pouze hashovaná (vhodný algoritmus, sůl)
- [ ] Session/token – timeout, secure cookies, invalidace při logout
- [ ] Autorizace před citlivou akcí; kontrola ownership (IDOR)
- [ ] Rate limiting / ochrana před brute-force na přihlášení

### 5. Soubory a upload

- [ ] Upload – whitelist typů, max velikost, kontrola obsahu (např. magic bytes)
- [ ] Ochrana před path traversal a nebezpečnými názvy
- [ ] Ukládání mimo webroot nebo s omezeným přístupem
- [ ] (Document scanner) Zip bombs, omezení typů dokumentů

### 6. Chyby a logování

- [ ] Stack trace a detaily chyb neposílat koncovému uživateli
- [ ] V logách žádné hesla, tokeny, PII v plain textu
- [ ] Logování bezpečnostních událostí (neúspěšné přihlášení, změny oprávnění)

### 7. HTTPS a hlavičky

- [ ] Produkce pouze přes HTTPS; redirect HTTP → HTTPS
- [ ] Bezpečné hlavičky (CSP, X-Frame-Options, HSTS) kde je to možné

### 8. Cursor ekosystém

- [ ] `.cursor/rules`, `.cursorrules` – obsah z důvěryhodného zdroje; žádné skryté příkazy
- [ ] `.cursor/skills/` – cizí skills bez podezřelých instrukcí (shell, čtení citlivých cest)
- [ ] MCP konfigurace – seznam serverů a tools; neznámé MCP označit a doporučit kontrolu
- [ ] Doporučení: Auto-run vypnutý; u citlivého kódu zvážit Privacy Mode

### 9. Repo a práva

- [ ] `.gitignore` vylučuje secrets, env, build artefakty, lokální konfiguraci
- [ ] Žádné citlivé soubory v historii gitu
- [ ] Oprávnění skriptů a konfigurace – princip nejmenších oprávnění

### 10. Citlivá data (PII, compliance)

- [ ] Kde se zpracovává/ukládá PII – minimalizace; šifrování v klidu pokud potřeba
- [ ] Export/backup – zabezpečený přenos a uložení
- [ ] (Document scanner) Text z dokumentů – kde se loguje, ukládá, posílá; retention

## Šablona výstupu

Pro každý nález uvést:

- **Závažnost:** Kritická / Vysoká / Střední / Nízká
- **Kde:** soubor, cesta, případně řádek
- **Problém:** co je špatně
- **Riziko:** proč to představuje riziko
- **Doporučení:** konkrétní krok nápravy

**Závažnosti:**

- **Kritická** – opravit před mergem/release (injection, vytečení secretů, zlomený access control)
- **Vysoká** – plánovat opravu (chybějící validace, slabá session policy)
- **Střední / Nízká** – doporučení (hardening, logging, upgrade závislostí)

Na konci zprávy:

```markdown
## Shrnutí
- Kritické: N
- Vysoké: N
- Střední: N
- Nízké: N
- Prioritní doporučení: [1–3 body]
```

## Před použitím cizího skillu nebo MCP

Když uživatel přidává cizí skill nebo MCP server:

- **Skill:** Přečíst celý SKILL.md (a reference/skripty). Hledat vyžadování shell příkazů, čtení cest mimo projekt, volání externích URL. Shrnout zdroj, co skill dělá, identifikovaná rizika; doporučit použít / s opatrností / nepoužívat bez ruční kontroly.
- **MCP:** Zkontrolovat zdroj, které tools exponuje (zvl. spouštění příkazů, zápis na disk). Žádné secrets v konfiguraci. Po změně definice MCP znovu projít a doporučit re-schválení.

## Další materiál

- Detailní reference, OWASP odkazy a Cursor doporučení: [reference.md](reference.md)
