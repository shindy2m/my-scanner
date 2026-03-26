import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

import type { DocumentInputSource } from '../services/recognition';

export type PickedDocumentImage = {
  uri: string;
  source: DocumentInputSource;
};

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: false,
  quality: 0.92,
};

function alertPermission(title: string, message: string) {
  Alert.alert(title, message);
}

export async function pickFromCamera(): Promise<PickedDocumentImage | null> {
  if (Platform.OS === 'web') {
    alertPermission(
      'Není k dispozici',
      'Kamera v prohlížeči není podporována. Použijte galerii nebo výběr souboru.'
    );
    return null;
  }

  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    alertPermission(
      'Přístup ke kameře',
      'Bez oprávnění nelze pořídit snímek. Povolte kameru v nastavení zařízení.'
    );
    return null;
  }

  try {
    const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);
    if (result.canceled || !result.assets[0]?.uri) return null;
    return { uri: result.assets[0].uri, source: 'camera' };
  } catch {
    alertPermission('Kamera', 'Nepodařilo se otevřít kameru.');
    return null;
  }
}

export async function pickFromGallery(): Promise<PickedDocumentImage | null> {
  if (Platform.OS === 'web') {
    try {
      const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
      if (result.canceled || !result.assets[0]?.uri) return null;
      return { uri: result.assets[0].uri, source: 'gallery' };
    } catch {
      alertPermission('Galerie', 'Výběr obrázku se nezdařil.');
      return null;
    }
  }

  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    alertPermission(
      'Přístup k fotkám',
      'Bez oprávnění nelze vybrat obrázek z galerie. Povolte přístup v nastavení zařízení.'
    );
    return null;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
    if (result.canceled || !result.assets[0]?.uri) return null;
    return { uri: result.assets[0].uri, source: 'gallery' };
  } catch {
    alertPermission('Galerie', 'Výběr obrázku se nezdařil.');
    return null;
  }
}

const IMAGE_MIME_PREFIX = 'image/';

export async function pickImageFile(): Promise<PickedDocumentImage | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]?.uri) return null;
    const asset = result.assets[0];
    if (
      asset.mimeType &&
      !asset.mimeType.toLowerCase().startsWith(IMAGE_MIME_PREFIX)
    ) {
      alertPermission(
        'Nepodporovaný soubor',
        'Vyberte obrázek (např. JPEG nebo PNG).'
      );
      return null;
    }
    return { uri: asset.uri, source: 'file' };
  } catch {
    alertPermission('Soubor', 'Výběr souboru se nezdařil.');
    return null;
  }
}
