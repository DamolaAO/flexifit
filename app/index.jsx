import { StyleSheet, Text, View, Image, useColorScheme } from 'react-native'
import React from 'react'
import Logo from '../assets/img/FlixiFit App Logo.png'
import { Link } from 'expo-router'
import { Colours } from '../constants/Colours' // Colours.js file for color constants
import ThemedView from '../components/ThemedView'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>FlexiFit</Text>
      <Text style={styles.subtitle}>Welcome to Flexifit</Text>
      <Text style = {{marginTop: 30, marginBottom: 30}}>
        Start your fitness journey today!
        </Text>

      <View >
        <Link href="/dashboard" style={styles.card}>
          Go to Dashboard
        </Link>
      </View>
      
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
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
    marginVertical: 20,
    width: 100,
    height: 100,
  }
})