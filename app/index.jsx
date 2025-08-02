import { StyleSheet, Text } from 'react-native'
import React from 'react'
//import Logo from '../assets/img/flexifit dark logo.png'
import { Link } from 'expo-router'
import { Colours } from '../constants/Colours' // Colours.js file for color constants
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import ThemedCard from '../components/ThemedCard'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer' // Importing Spacer component for layout spacing

const Home = () => {
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
      
      <ThemedCard>
        <Link href="/login">
          <ThemedText>Go to Login</ThemedText>
        </Link>
      </ThemedCard>
      <Spacer height={10} />

      <ThemedCard>
        <Link href="/register">
          <ThemedText>Go to Register</ThemedText>
        </Link>
      </ThemedCard>
      <Spacer height={10} />

      <ThemedCard>
        <Link href="/dashboard">
          <ThemedText>Go to Dashboard</ThemedText>
        </Link>
      </ThemedCard>
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
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
  }
})