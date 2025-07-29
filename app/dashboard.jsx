import { StyleSheet, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import ThemedCard from '../components/ThemedCard'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'

const Dashboard = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Dashboard</ThemedText>
    </ThemedView>
  )
}

export default Dashboard

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
    color: '#4b5563',
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