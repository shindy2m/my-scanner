import type { DocumentInputSource } from '../services/recognition';

export type ResultScreenParams = {
  uri: string;
  source: DocumentInputSource;
};

export type RootStackParamList = {
  Home: undefined;
  Result: ResultScreenParams;
  History: undefined;
  HistoryDetail: { scanId: string };
  FullImage: { uri: string };
};
