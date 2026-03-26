import path from 'path';
import { test, expect } from '@playwright/test';
import { pickImageFile, setRecognitionMockQueue } from './helpers';

const fixturePng = path.join(__dirname, '..', 'assets', 'favicon.png');

test.describe('Skenování (mock)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('R4 R5 R8 R9: po výběru souboru proběhne rozpoznání a zobrazí se standardní údaje a přepis', async ({
    page,
  }) => {
    await setRecognitionMockQueue(page, [{ type: 'result', scenario: 'invoice' }]);
    await pickImageFile(page, fixturePng);

    await expect(
      page.getByRole('progressbar', {
        name: 'Probíhá rozpoznání dokumentu, čekejte prosím',
      })
    ).toBeVisible();

    await expect(page.getByText('Zpracovává se dokument')).toBeVisible();

    await expect(page.getByText('Standardní údaje')).toBeVisible();
    await expect(page.getByText('Číslo faktury')).toBeVisible();
    await expect(page.getByText('FV-2025-0042', { exact: true })).toBeVisible();

    await expect(page.getByText('Kompletní přepis')).toBeVisible();
    const transcript = page.getByLabel('Kompletní přepis dokumentu');
    await expect(transcript).toContainText('FAKTURA');
  });

  test('R6 R11: při nízké jistotě lze ručně zvolit typ dokumentu', async ({ page }) => {
    await setRecognitionMockQueue(page, [{ type: 'result', scenario: 'uncertain' }]);
    await pickImageFile(page, fixturePng);

    await expect(page.getByText(/nízká jistota/i)).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: 'Výběr typu dokumentu' })).toBeVisible();

    await page.getByRole('radio', { name: 'Účtenka z obchodu' }).click();
    await expect(page.getByText('Prodejce / obchod')).toBeVisible();
  });

  test('R7: chyba rozpoznání, znovu a úspěch', async ({ page }) => {
    await setRecognitionMockQueue(page, [
      { type: 'error', message: 'Simulovaná chyba API' },
      { type: 'result', scenario: 'receipt' },
    ]);
    await pickImageFile(page, fixturePng);

    await expect(page.getByRole('alert')).toContainText('Simulovaná chyba API');
    await page.getByRole('button', { name: 'Zkusit rozpoznání znovu' }).click();

    await expect(page.getByText('Prodejce / obchod')).toBeVisible();
    await expect(
      page.getByText('Supermarket Hlavní', { exact: true })
    ).toBeVisible();
  });

  test('R12: změna typu přemapuje pole bez nového skenu', async ({ page }) => {
    await setRecognitionMockQueue(page, [{ type: 'result', scenario: 'invoice' }]);
    await pickImageFile(page, fixturePng);

    await expect(page.getByText('Číslo faktury')).toBeVisible();

    await page.getByRole('radio', { name: 'Účtenka z obchodu' }).click();
    await expect(page.getByText('Datum a čas')).toBeVisible();
    await expect(page.getByText('Prodejce / obchod')).toBeVisible();
  });
});
