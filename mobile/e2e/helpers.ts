import type { Page } from '@playwright/test';

/** Musí odpovídat `E2ERecognitionQueueItem` v aplikaci (serializace přes evaluate). */
export type QueuedMock =
  | { type: 'result'; scenario: 'invoice' | 'receipt' | 'business_card' | 'uncertain' }
  | { type: 'error'; message: string };

export async function setRecognitionMockQueue(
  page: Page,
  items: QueuedMock[]
): Promise<void> {
  await page.evaluate((payload) => {
    (window as unknown as { __MYSCANNER_E2E_QUEUE?: QueuedMock[] }).__MYSCANNER_E2E_QUEUE =
      [...payload];
  }, items);
}

export async function pickImageFile(page: Page, filePath: string): Promise<void> {
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByText('Vybrat obrázek ze souboru').click();
  const chooser = await fileChooserPromise;
  await chooser.setFiles(filePath);
}
