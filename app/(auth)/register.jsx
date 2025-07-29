import { StyleSheet } from 'react-native'
import { Link } from 'expo-router'

import React from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'

const register = () => {

    const handleSubmit = () => {
        console.log("Register button pressed");
    }

  return (
    <ThemedView style={styles.container}>
        
        <Spacer />
        <ThemedText title={true}>
            Register as new User
        </ThemedText>
        <Spacer height={100} />

        <ThemedButton style={styles.btn} onPress={handleSubmit}>
            <ThemedText>Register</ThemedText>
        </ThemedButton>
        <Spacer height={10} />
        
        <ThemedText>Register Form Placeholder</ThemedText>
        <Spacer height={10} />
        <ThemedCard>
            <Link href="/index">
                <ThemedText>Back Home</ThemedText>
            </Link>
        </ThemedCard>
    </ThemedView>
  )
}

export default register

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