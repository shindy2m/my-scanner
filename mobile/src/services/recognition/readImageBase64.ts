import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

function guessMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.heic') || lower.includes('.heif')) return 'image/heic';
  if (lower.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string') {
        reject(new Error('READ_BLOB'));
        return;
      }
      const comma = dataUrl.indexOf(',');
      resolve(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl);
    };
    reader.onerror = () => reject(reader.error ?? new Error('READ_BLOB'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Načte lokální URI obrázku jako base64 + MIME typ pro vision API.
 */
export async function readImageAsBase64(
  uri: string
): Promise<{ base64: string; mimeType: string }> {
  if (uri.startsWith('data:')) {
    const m = /^data:([^;]+);base64,(.+)$/i.exec(uri);
    if (m) {
      return { mimeType: m[1].trim() || 'image/jpeg', base64: m[2] ?? '' };
    }
  }

  const fallbackMime = guessMimeType(uri);

  if (Platform.OS === 'web') {
    const res = await fetch(uri);
    const blob = await res.blob();
    const mimeType = blob.type && blob.type.length > 0 ? blob.type : fallbackMime;
    const base64 = await blobToBase64(blob);
    return { base64, mimeType };
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });
  return { base64, mimeType: fallbackMime };
}
