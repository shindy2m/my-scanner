import type {
  DocumentInputSource,
  RecognitionMockScenario,
} from '../services/recognition';

export type ResultScreenParams =
  | { mode: 'demo'; scenario: RecognitionMockScenario }
  | { mode: 'scan'; uri: string; source: DocumentInputSource };

export type RootStackParamList = {
  Home: undefined;
  Result: ResultScreenParams;
  History: undefined;
};
