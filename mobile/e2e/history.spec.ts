import path from 'path';
import { test, expect } from '@playwright/test';
import { pickImageFile, setRecognitionMockQueue } from './helpers';

const fixturePng = path.join(__dirname, '..', 'assets', 'favicon.png');

async function goBackToHome(page: import('@playwright/test').Page): Promise<void> {
  await page.getByRole('button', { name: 'Zpět' }).click();
}

test.describe('Historie (mock)', () => {
  test('R10 R13 R14 R15 R16: seznam, filtr, detail, náhled, smazání', async ({ page }) => {
    await page.goto('/');

    await setRecognitionMockQueue(page, [{ type: 'result', scenario: 'invoice' }]);
    await pickImageFile(page, fixturePng);
    await expect(page.getByText('FV-2025-0042', { exact: true })).toBeVisible();
    await goBackToHome(page);

    await setRecognitionMockQueue(page, [{ type: 'result', scenario: 'receipt' }]);
    await pickImageFile(page, fixturePng);
    await expect(
      page.getByText('Supermarket Hlavní', { exact: true })
    ).toBeVisible();
    await goBackToHome(page);

    await page.getByRole('tab', { name: 'Historie' }).click();
    await expect(page.getByText('2 položek v relaci')).toBeVisible();

    const invoiceCard = page.getByRole('button', { name: 'Detail skenu Faktura' });
    const receiptCard = page.getByRole('button', { name: 'Detail skenu Účtenka z obchodu' });
    await expect(receiptCard).toBeVisible();
    await expect(invoiceCard).toBeVisible();

    await page.getByRole('tab', { name: 'Faktura' }).click();
    await expect(page.getByText('zobrazeno 1')).toBeVisible();
    await expect(receiptCard).not.toBeVisible();
    await expect(invoiceCard).toBeVisible();

    await page.getByRole('tab', { name: 'Vše' }).click();
    await receiptCard.click();

    await expect(page.getByText('Typ dokumentu:')).toBeVisible();
    await expect(page.getByText('Standardní údaje')).toBeVisible();
    await expect(
      page.getByText('Supermarket Hlavní', { exact: true })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Otevřít náhled v plném rozlišení' }).click();
    await expect(
      page.getByLabel('Obrázek dokumentu v plném rozlišení')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Zpět' }).click();

    page.once('dialog', (d) => d.accept());
    await page.getByLabel('Smazat položku z historie relace').click();

    await expect(page.getByText('1 položek v relaci')).toBeVisible();
    await expect(receiptCard).not.toBeVisible();
    await expect(invoiceCard).toBeVisible();
  });
});
