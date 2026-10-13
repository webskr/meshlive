import React from 'react';
import { StatusBar as NativeStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NativeStatusBar backgroundColor="#0f172a" barStyle="light-content" translucent={false} />
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
