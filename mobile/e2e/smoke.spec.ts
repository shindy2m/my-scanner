import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('aplikace naběhne a hlavní vstupy jsou dostupné', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('My')).toBeVisible();
    await expect(page.getByText('SCANNER')).toBeVisible();

    await expect(page.getByRole('tab', { name: 'Domů' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Historie' })).toBeVisible();

    await expect(
      page.getByText(/Vyberte doklad — fakturu, účtenku z obchodu nebo vizitku/)
    ).toBeVisible();

    await expect(
      page.getByText('Pořídit snímek kamerou')
    ).toBeVisible();
    await expect(page.getByText('Vybrat z galerie')).toBeVisible();
    await expect(page.getByText('Vybrat obrázek ze souboru')).toBeVisible();
  });
});
