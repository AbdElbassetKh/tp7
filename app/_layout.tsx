/**
 * Root Layout
 * 
 * Main layout component with authentication and navigation
 * Provides AuthContext to all screens
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import AuthScreen from '@/src/screens/AuthScreen';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="add-recipe" 
          options={{ 
            presentation: 'modal', 
            title: 'Add Recipe',
            headerStyle: { backgroundColor: '#0ea5e9' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '600' },
          }} 
        />
        <Stack.Screen 
          name="recipe/[id]" 
          options={{ 
            title: 'Recipe Details',
            headerStyle: { backgroundColor: '#0ea5e9' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '600' },
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayoutNav />
        <Toast />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});
