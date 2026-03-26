import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'myscanner_network_recognition_consent_v1';

export async function hasNetworkRecognitionConsent(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY);
  return v === 'yes';
}

export async function grantNetworkRecognitionConsent(): Promise<void> {
  await AsyncStorage.setItem(KEY, 'yes');
}
