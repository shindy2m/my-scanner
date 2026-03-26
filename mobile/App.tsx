import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SessionScanProvider } from './src/session/SessionScanContext';

export default function App() {
  return (
    <SessionScanProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </SessionScanProvider>
  );
}
