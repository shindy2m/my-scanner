import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FullImageScreen } from '../screens/FullImageScreen';
import { HistoryDetailScreen } from '../screens/HistoryDetailScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ResultScreen } from '../screens/ResultScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitle: 'MySCANNER',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'MySCANNER' }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Výsledek skenu' }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Historie' }}
      />
      <Stack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
        options={{ title: 'Detail skenu' }}
      />
      <Stack.Screen
        name="FullImage"
        component={FullImageScreen}
        options={{ title: 'Náhled' }}
      />
    </Stack.Navigator>
  );
}
