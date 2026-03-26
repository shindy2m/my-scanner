import type { RecognitionRequest, RecognitionResult, RecognitionService } from './types';
import {
  normalizeRecognitionPayload,
  parseRecognitionJsonString,
} from './parseRecognitionPayload';
import { readImageAsBase64 } from './readImageBase64';
import {
  getProxyAuthorizationHeader,
  getProxyUrl,
} from './recognitionEnv';

/**
 * Klient pro vlastní HTTPS endpoint, který přijme obrázek a vrátí stejný JSON jako OpenAI flow.
 * Tělo: { "imageBase64": "...", "mimeType": "image/jpeg" }
 * Odpověď: buď přímo RecognitionResult JSON, nebo { "result": { ... } }
 */
export function createProxyRecognitionService(): RecognitionService {
  const url = getProxyUrl();
  const auth = getProxyAuthorizationHeader();

  return {
    async recognize(request: RecognitionRequest): Promise<RecognitionResult> {
      const uri = request.inputUri;
      if (uri == null || uri.length === 0) {
        throw new Error('Chybí obrázek pro rozpoznání.');
      }

      const { base64, mimeType } = await readImageAsBase64(uri);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (auth) {
        headers.Authorization = auth;
      }

      let res: Response;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            imageBase64: base64,
            mimeType,
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
        if (res.status === 401 || res.status === 403) {
          throw new Error('Proxy odmítl přístup. Zkontrolujte token nebo konfiguraci serveru.');
        }
        throw new Error(
          `Proxy vrátil chybu (${res.status}). Zkuste to znovu nebo kontaktujte správce.`
        );
      }

      let payload: unknown;
      try {
        payload = JSON.parse(text) as unknown;
      } catch {
        throw new Error('Odpověď proxy není platný JSON.');
      }

      if (
        payload !== null &&
        typeof payload === 'object' &&
        'result' in payload &&
        (payload as { result: unknown }).result != null
      ) {
        payload = (payload as { result: unknown }).result;
      }

      try {
        if (typeof payload === 'string') {
          return parseRecognitionJsonString(payload);
        }
        return normalizeRecognitionPayload(payload);
      } catch {
        throw new Error('Odpověď proxy má neočekávaný tvar.');
      }
    },
  };
}
