import { StyleSheet } from 'react-native'
import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'expo-router'

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

  return (
    <ThemedView style={styles.container} safe={true}>
        
      <ThemedText title={true} style={styles.title}>info</ThemedText>
      <Spacer />

      <ThemedButton onPress={handleLogout}>
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