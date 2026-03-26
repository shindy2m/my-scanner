import type { NavigatorScreenParams } from '@react-navigation/native';
import type { DocumentInputSource } from '../services/recognition';

export type ResultScreenParams = {
  uri: string;
  source: DocumentInputSource;
};

/** Stack záložky Domů (skener + výsledek). */
export type HomeStackParamList = {
  Home: undefined;
  Result: ResultScreenParams;
  FullImage: { uri: string };
};

/** Stack záložky Historie. */
export type HistoryStackParamList = {
  History: undefined;
  HistoryDetail: { scanId: string };
  FullImage: { uri: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  HistoryTab: NavigatorScreenParams<HistoryStackParamList> | undefined;
};
