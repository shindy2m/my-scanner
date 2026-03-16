# Security Review – reference

Doplňující materiál k skillu security-review: odkazy na standardy, Cursor doporučení a poznámky k ověření.

## OWASP

- **OWASP Top 10** – nejčastější rizika webových aplikací: https://owasp.org/www-project-top-ten/
- **Secure Code Review Cheat Sheet** – metodika revize kódu (baseline vs diff-based): https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html
- **Secure Coding Practices Quick Reference** – checklist kódování (input, output, auth, crypto, files, …): https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/
- **ASVS** (Application Security Verification Standard) – úrovně ověření L1–L3: https://owasp.org/www-project-application-security-verification-standard/

## Cursor – bezpečnost ekosystému

- **Auto-run** – největší riziko; příkazy se spouštějí bez schválení. Doporučení: mít vypnutý; v skillu při review zmínit.
- **Privacy Mode** – ochrana proprietárního kódu; u citlivých projektů doporučit zapnout.
- **MCP servery** – důvěra se váže na konfiguraci (název/klíč), ne na konkrétní příkaz. Změna definice (command, args) může spouštět jiný kód bez nového schválení (CVE-2025-54136). Před přidáním/aktualizací: ověřit zdroj, projít tools a argumenty; po změně mcp.json znovu projít.
- **Credentials u MCP** – nepoužívat long-lived API klíče v konfiguraci; preferovat env proměnné, OAuth kde je to možné.
- **.cursorrules / .cursor/rules** – skrytý payload v pravidlech může vést k trvalému přístupu. Pravidla z cizích repozitářů vždy projít; nepřidávat pravidla vyžadující spouštění shell příkazů bez kontextu.
- **Cizí skills** – před použitím projít SKILL.md a skripty; hledat shell příkazy, čtení citlivých cest, volání na externí URL. Výstup: zdroj, co dělá, rizika, doporučení (použít / s opatrností / nepoužívat bez ruční kontroly).

## Kontrola závislostí (příkazy)

- **Node/npm:** `npm audit` (příp. `npm audit --production`); lockfile `package-lock.json` nebo `yarn.lock` verzovaný.
- **Python:** `pip-audit` nebo `safety check`; lockfile např. `poetry.lock`.
- **Obecně:** Snyk, Dependabot – zmínit v doporučeních jako doplněk.

## Trust boundaries (kde vždy kontrolovat)

- Vstupy: formuláře, query, body, upload souborů, hlavičky.
- Autentizace a autorizace: login, session, tokeny, kontrola oprávnění před akcí.
- Výstupy: do DB, do API, do souborů, do odpovědi (XSS, injection).
- Konfigurace a závislosti: env/secrets, nové balíčky, verze s known CVE.

