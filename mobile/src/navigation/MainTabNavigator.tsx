import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullImageScreen } from '../screens/FullImageScreen';
import { HistoryDetailScreen } from '../screens/HistoryDetailScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { j } from '../theme/jablotron';
import { JablotronHeader } from './JablotronHeader';
import type {
  HistoryStackParamList,
  HomeStackParamList,
  MainTabParamList,
} from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const stackScreenOptions = {
  header: (props: ComponentProps<typeof JablotronHeader>) => (
    <JablotronHeader {...props} />
  ),
  headerShadowVisible: false,
  contentStyle: { backgroundColor: j.bg.default },
} as const;

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={stackScreenOptions}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '' }}
      />
      <HomeStack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Výsledek skenu' }}
      />
      <HomeStack.Screen
        name="FullImage"
        component={FullImageScreen}
        options={{ title: 'Náhled' }}
      />
    </HomeStack.Navigator>
  );
}

function HistoryStackScreen() {
  return (
    <HistoryStack.Navigator
      initialRouteName="History"
      screenOptions={stackScreenOptions}
    >
      <HistoryStack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Historie' }}
      />
      <HistoryStack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
        options={{ title: 'Detail skenu' }}
      />
      <HistoryStack.Screen
        name="FullImage"
        component={FullImageScreen}
        options={{ title: 'Náhled' }}
      />
    </HistoryStack.Navigator>
  );
}

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, j.space[2]);
  const tabBarHeight = 72 + bottomPad;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: j.button.primary,
        tabBarInactiveTintColor: j.text.secondary,
        tabBarStyle: {
          backgroundColor: j.surface.base,
          borderTopWidth: 1,
          borderTopColor: j.border.primary,
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: { width: 0, height: 0 },
          height: tabBarHeight,
          paddingBottom: bottomPad,
          paddingTop: j.space[2],
        },
        tabBarLabelStyle: {
          fontSize: j.font.xs,
          fontWeight: j.weight.medium,
        },
        tabBarIconStyle: { marginBottom: 0 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: 'Domů',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackScreen}
        options={{
          title: 'Historie',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
