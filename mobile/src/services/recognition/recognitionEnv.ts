/**
 * Konfigurace režimu rozpoznání (E7).
 * Expo inlinuje EXPO_PUBLIC_* při buildu – produkční store build nesmí obsahovat OpenAI klíč;
 * pro produkci použijte proxy (URL níže) a klíč držte na serveru.
 */
export type RecognitionBackend = 'mock' | 'openai' | 'proxy';

const MOCK_FLAG = process.env.EXPO_PUBLIC_MYSCANNER_USE_MOCK;
const PROXY_URL = process.env.EXPO_PUBLIC_MYSCANNER_PROXY_URL?.trim() ?? '';
const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() ?? '';

export function isMockExplicitlyForced(): boolean {
  return MOCK_FLAG === '1' || MOCK_FLAG === 'true';
}

export function getRecognitionBackend(): RecognitionBackend {
  if (MOCK_FLAG === '1' || MOCK_FLAG === 'true') {
    return 'mock';
  }
  if (PROXY_URL.length > 0) {
    return 'proxy';
  }
  if (OPENAI_KEY.length > 0) {
    return 'openai';
  }
  return 'mock';
}

/** True, pokud se obsah odesílá mimo zařízení (OpenAI nebo vlastní proxy). */
export function recognitionSendsDataOffDevice(): boolean {
  return getRecognitionBackend() !== 'mock';
}

export function getOpenAIApiBaseUrl(): string {
  const u = process.env.EXPO_PUBLIC_OPENAI_BASE_URL?.trim();
  if (u && u.length > 0) return u.replace(/\/$/, '');
  return 'https://api.openai.com/v1';
}

export function getOpenAIModel(): string {
  const m = process.env.EXPO_PUBLIC_OPENAI_MODEL?.trim();
  return m && m.length > 0 ? m : 'gpt-4o-mini';
}

export function getOpenAIApiKey(): string {
  return OPENAI_KEY;
}

export function getProxyUrl(): string {
  return PROXY_URL;
}

/** Volitelný Bearer token k vlastní proxy (klíč stále není OpenAI secret). */
export function getProxyAuthorizationHeader(): string | null {
  const token = process.env.EXPO_PUBLIC_MYSCANNER_PROXY_BEARER_TOKEN?.trim();
  if (!token) return null;
  return `Bearer ${token}`;
}

export function getRecognitionLoadingHint(backend: RecognitionBackend): string {
  if (backend === 'mock') {
    return 'Simulované rozpoznání běží na zařízení (ukázkový režim).';
  }
  return 'Obrázek se odesílá ke zpracování mimo zařízení.';
}
