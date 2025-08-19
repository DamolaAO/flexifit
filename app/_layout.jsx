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
import { doc, getDoc } from 'firebase/firestore'

function AuthGate() {
  const { user, initializing } = useAuth()
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [userDoc, setUserDoc] = useState(null)

  useEffect(() => {
    let cancelled = false

    if (!user) {
      setUserDoc(null)
      setLoadingDoc(false)
      return
    }

    (async () => {
      try {
        setLoadingDoc(true)
        const ref = doc(db, "users", user.uid)
        const snap = await getDoc(ref)
        if (!cancelled) setUserDoc(snap.exists() ? snap.data() : null)
      } finally {
        if (!cancelled) setLoadingDoc(false)
      }
    })()

    return () => { cancelled = true }
  }, [user])

  useEffect(() => {
    if (initializing) return;

    setShowSplash(true); // keep overlay up while routing

    if (!user) {
      router.replace("/(auth)/login")
      const t = setTimeout(() => setShowSplash(false), 500)
      return () => clearTimeout(t)
    }

    // Wait until Firestore profile has been fetched at least once
    if (loadingDoc) return

    const profile = userDoc
    const required = ["name", "age", "height", "weight", "fitnessGoal", "fitnessLevel"]
    const needs =
      !profile ||
      required.some((k) => profile[k] === undefined || profile[k] === null || profile[k] === "") ||
      profile.onboardingComplete === false

    const target = needs ? "/(onboarding)/intro" : "/(navbar)/dashboard"
    router.replace(target)

    const t = setTimeout(() => setShowSplash(false), 1000) // keep overlay a beat past replace
    return () => clearTimeout(t)
  }, [initializing, user, userDoc, loadingDoc, router])

  if (initializing || showSplash) {
    return <ThemedSplash style={StyleSheet.absoluteFillObject} />
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
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ title: 'Home', headerBackVisible: false, headerLeft: () => null, gestureEnabled: false }} />
        </Stack>
        <AuthGate />
      </ThemedView>
    </AuthProvider>
  )
}

export default RootLayout
