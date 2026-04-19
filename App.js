import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/styles/theme';

import HomeScreen from './src/screens/HomeScreen';
import ImageToPdfScreen from './src/screens/ImageToPdfScreen';
import MergePdfScreen from './src/screens/MergePdfScreen';
import SplitPdfScreen from './src/screens/SplitPdfScreen';

const Stack = createNativeStackNavigator();

// Prevent auto-hiding of splash screen while fonts load
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={{ colors: { background: colors.bg } }}>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ImageToPdf" component={ImageToPdfScreen} />
          <Stack.Screen name="MergePdf" component={MergePdfScreen} />
          <Stack.Screen name="SplitPdf" component={SplitPdfScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
