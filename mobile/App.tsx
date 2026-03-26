import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JablotronMenuBubble } from './src/navigation/JablotronMenuBubble';
import { MainTabNavigator } from './src/navigation/MainTabNavigator';
import { MenuBubbleProvider } from './src/navigation/MenuBubbleContext';
import { SessionScanProvider } from './src/session/SessionScanContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <MenuBubbleProvider>
        <SessionScanProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <MainTabNavigator />
            <JablotronMenuBubble />
          </NavigationContainer>
        </SessionScanProvider>
      </MenuBubbleProvider>
    </SafeAreaProvider>
  );
}
