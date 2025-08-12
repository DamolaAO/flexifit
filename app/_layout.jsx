import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colours } from '../constants/Colours' // Colours.js file for color constants
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '../context/AuthContext'

const RootLayout = () => {
    const colourScheme = useColorScheme() // or 'light', depending on your preference
    const theme = Colours[colourScheme] ?? Colours.light // Fallback to light theme if scheme is not recognized

  return (
    <AuthProvider>
      <StatusBar barStyle={theme.statusBar} />
      <Stack screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.text,
      }}>
          <Stack.Screen name="(navbar)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ title: 'Home' }} />
      </Stack>
    </AuthProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})