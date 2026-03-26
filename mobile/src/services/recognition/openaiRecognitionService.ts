import type { RecognitionRequest, RecognitionResult, RecognitionService } from './types';
import { parseRecognitionJsonString } from './parseRecognitionPayload';
import { readImageAsBase64 } from './readImageBase64';
import {
  getOpenAIApiBaseUrl,
  getOpenAIApiKey,
  getOpenAIModel,
} from './recognitionEnv';

const SYSTEM_PROMPT = `Jsi asistent pro digitalizaci českých dokumentů. Dostaneš obrázek dokladu.

Vrať výhradně jeden JSON objekt (žádný markdown, žádný text kolem) s těmito klíči:
- suggestedType: jedna z hodnot "invoice" | "receipt" | "business_card"
  - invoice = faktura / daňový doklad s dodavatelem a částkami
  - receipt = účtenka z obchodu / pokladní doklad
  - business_card = vizitka / kontaktní karta
- typeConfidence: "high" pokud jsi si jistý typem, jinak "low"
- standardFields: objekt s polemi POUZE pro zvolený suggestedType (prázdný řetězec pokud v dokumentu není):
  Pro invoice: invoiceNumber, issueDate, dueDate, supplierName, supplierVatId, customerName, totalAmount, currency, totalVat
  Pro receipt: merchant, dateTime, totalAmount, currency
  Pro business_card: fullName, companyOrRole, phone, email, web, address
- transcript: jeden souvislý přepis veškerého čitelného textu z dokumentu (česky pokud je text česky)

Pravidla: hodnoty standardFields jsou řetězce; čísla a data jako text z dokumentu nebo odhad.`;

function mapOpenAIError(status: number, bodyText: string): string {
  if (status === 401 || status === 403) {
    return 'Přístup k rozhraní rozpoznání byl odmítnut. Zkontrolujte konfiguraci klíče nebo proxy.';
  }
  if (status === 429) {
    return 'Služba je dočasně zaneprázdněná. Zkuste to prosím za chvíli znovu.';
  }
  if (status >= 500) {
    return 'Server rozpoznání je nedostupný. Zkuste to později.';
  }
  try {
    const j = JSON.parse(bodyText) as { error?: { message?: string } };
    const msg = j.error?.message;
    if (typeof msg === 'string' && msg.length > 0) {
      return `Rozpoznání selhalo: ${msg}`;
    }
  } catch {
    /* ignore */
  }
  return 'Rozpoznání se nezdařilo. Zkuste to znovu nebo zkontrolujte síť.';
}

export function createOpenAIRecognitionService(): RecognitionService {
  const apiKey = getOpenAIApiKey();
  const baseUrl = getOpenAIApiBaseUrl();
  const model = getOpenAIModel();

  return {
    async recognize(request: RecognitionRequest): Promise<RecognitionResult> {
      const uri = request.inputUri;
      if (uri == null || uri.length === 0) {
        throw new Error('Chybí obrázek pro rozpoznání.');
      }

      const { base64, mimeType } = await readImageAsBase64(uri);
      const dataUrl = `data:${mimeType};base64,${base64}`;

      let res: Response;
      try {
        res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyzuj tento dokument a vrať požadovaný JSON.',
                },
                {
                  type: 'image_url',
                  image_url: { url: dataUrl, detail: 'auto' },
                },
              ],
            },
          ],
          max_tokens: 4096,
        }),
        });
      } catch (e) {
        if (e instanceof TypeError) {
          throw new Error(
            'Nelze se spojit se sítí. Zkontrolujte připojení a zkuste to znovu.'
          );
        }
        throw e;
      }

      const text = await res.text();
      if (!res.ok) {
        throw new Error(mapOpenAIError(res.status, text));
      }

      let content: string;
      try {
        const json = JSON.parse(text) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const c = json.choices?.[0]?.message?.content;
        if (typeof c !== 'string') {
          throw new Error('EMPTY_CONTENT');
        }
        content = c;
      } catch {
        throw new Error('Odpověď rozpoznání nelze zpracovat.');
      }

      try {
        return parseRecognitionJsonString(content);
      } catch (e) {
        const code = e instanceof Error ? e.message : '';
        if (code === 'JSON_PARSE' || code.startsWith('INVALID_')) {
          throw new Error('Model vrátil neočekávaný formát. Zkuste sken znovu.');
        }
        throw e;
      }
    },
  };
}
