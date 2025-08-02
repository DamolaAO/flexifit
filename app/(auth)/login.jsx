import { Pressable, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

import React from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { Colours } from '../../constants/Colours'
import ThemedButton from '../../components/ThemedButton'

const login = () => {

    const handleSubmit = () => {
        console.log("Login button pressed");
    }

  return (
    <ThemedView style={styles.container}>
        
        <Spacer />
        <ThemedText title={true}>
            Login to Your Account
        </ThemedText>
        <Spacer height={100} />

        <ThemedButton style={styles.btn} onPress={handleSubmit}>
            <ThemedText>Login</ThemedText>
        </ThemedButton>
        <Spacer height={10} />
        
        <ThemedText>Login Form Placeholder</ThemedText>
        <Spacer height={20} />
        <ThemedCard>
            <Link href="/register">
                <ThemedText>Register</ThemedText>
            </Link>
        </ThemedCard>
    </ThemedView>
  )
}

export default login

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
  btn: {
    padding: 16,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.25,
  }
})