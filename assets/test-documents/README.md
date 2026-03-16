# Testovací dokumenty pro rozpoznávání

Obrázky v této složce slouží **ve školení** k otestování rozpoznávání dokumentů.

**Soubory:** `test-vizitka.png`, `test-faktura.png`, `test-uctenka.png`


## Co který obrázek obsahuje (pro kontrolu výstupu)


| Soubor           | Typ               | Očekávaná pole (zkráceně)                                                             |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------- |
| test-vizitka.png | Vizitka           | jméno, firma, funkce, telefon, email, adresa                                          |
| test-faktura.png | Faktura           | dodavatel, odběratel, číslo faktury, datum vystavení/splatnosti, celková částka, měna |
| test-uctenka.png | Účtenka z obchodu | prodejce, datum a čas, celková částka, měna                                           |


