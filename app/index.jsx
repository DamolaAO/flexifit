import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

//import Logo from '../assets/img/flexifit dark logo.png'
import { Link } from 'expo-router'
import { Colours } from '../constants/Colours' // Colours.js file for color constants
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import ThemedCard from '../components/ThemedCard'
import ThemedText from '../components/ThemedText'
import ThemedButton from '../components/ThemedButton'
import Spacer from '../components/Spacer' // Importing Spacer component for layout spacing

const Home = () => {
  const router = useRouter()

  return (
    <ThemedView style={styles.container}>
      <ThemedLogo style={styles.logo} />

      <Spacer height={20} />

      <ThemedText style={styles.title}>FlexiFit</ThemedText>

      <Spacer height={10} />

      <ThemedText style={styles.subtitle}>Welcome to FlexiFit</ThemedText>
      <Spacer/>

      <ThemedText>Start your fitness journey today!</ThemedText>
      
      <Spacer height={20} />
      
      <ThemedButton style={{alignSelf: 'center'}} onPress={() => router.push('/(auth)/login')}>
          <ThemedText>Login</ThemedText>
      </ThemedButton>
      <Spacer height={10} />

      <ThemedButton style={{alignSelf: 'center'}} onPress={() => router.push('/(auth)/register')}>
          <ThemedText>Register</ThemedText>
      </ThemedButton>
      <Spacer height={10} />
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#979eaa'
  },
  logo: {
    width: 100,
    height: 100,
  }
})