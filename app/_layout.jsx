import { StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { Slot, Stack, useRouter } from 'expo-router'
import { Colours } from '../constants/Colours' // Colours.js file for color constants
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '../context/AuthContext'
import { useAuth } from '../hooks/useAuth'
import ThemedSplash from '../components/ThemedSplash'
import ThemedView from '../components/ThemedView'

function AuthGate() {
  const { user, initializing } = useAuth()
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  useEffect(() => {
    if (initializing) return;

    const target = user ? '/(navbar)/dashboard' : '/(auth)/login';

    setShowSplash(true)
    router.replace(target)
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 500)

    return () => clearTimeout(timer)

  }, [initializing, user, router])

  if (initializing || showSplash) {
    return <ThemedSplash style={StyleSheet.absoluteFillObject} onAnimationFinish={() => setShowSplash(false)} />
  }
  return null
}

const RootLayout = () => {
    const colourScheme = useColorScheme() // or 'light', depending on your preference
    const theme = Colours[colourScheme] ?? Colours.light // Fallback to light theme if scheme is not recognized

  return (
    <AuthProvider>
      <ThemedView style={{ flex: 1 }}>
        <StatusBar barStyle={theme.statusBar} />
        <Stack screenOptions={{
            headerStyle: { backgroundColor: theme.navBackground },
            headerTintColor: theme.text,
        }}>
            <Stack.Screen name="(navbar)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ title: 'Home', headerBackVisible: false, headerLeft: () => null, gestureEnabled: false }} />
        </Stack>
        <AuthGate />
      </ThemedView>
    </AuthProvider>
  )
}

export default RootLayout
