import type { RecognitionMockScenario } from '../services/recognition';

export type RootStackParamList = {
  Home: undefined;
  Result: { scenario: RecognitionMockScenario };
  History: undefined;
};
