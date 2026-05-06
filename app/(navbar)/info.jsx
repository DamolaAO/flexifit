import { Alert, StyleSheet } from 'react-native'
import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'expo-router'
import appJson from '../../app.json'

import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

const info = () => {
  const { logout, user } = useAuth();
  const router = useRouter();

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const handleAboutMe = () => {
    Alert.alert(
      'About FlexiFit',
      `App Name: FlexiFit\nVersion: ${appJson.expo.version}`
    )
  }

  return (
    <ThemedView style={styles.container} safe={true}>
        
      <ThemedText title={true} style={styles.title}>Info</ThemedText>

      <Spacer />

      <ThemedButton style={{ alignSelf: 'center' }} onPress={handleAboutMe}>
        <ThemedText>About</ThemedText>
      </ThemedButton>

      <Spacer height={10}/>

      <ThemedButton style={{ alignSelf: 'center' }} onPress={handleLogout}>
        <ThemedText>Logout</ThemedText>
      </ThemedButton>

    </ThemedView>
  )
}

export default info

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
  }
})