import { StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'expo-router'

import React from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'



const Login = () => {
  const { login, user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/(navbar)/dashboard')
    }
  }, [user, router])

  const handleSubmit =  async () => {
    try {
      await login(email, password)
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        Alert.alert("Login failed", "Invalid email or password.")
      } else if (err.code === "auth/invalid-email") {
        Alert.alert("Login failed", "Invalid email format.")
      } else {
        Alert.alert("Login failed", err.message) // fallback
      }
    }
    console.log("User: ", user)
    console.log("Login button pressed: ", email, password)
  }

  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
      <ThemedView style={styles.container}>

        <Spacer />
        <ThemedText title={true}>
            Login to Your Account
        </ThemedText>
        <Spacer height={80} />

        <ThemedTextInput
          style={{ width: '80%', marginBottom: 20 }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <ThemedTextInput
          style={{ width: '80%', marginBottom: 20 }}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <Spacer height={10} />

        <ThemedButton style={styles.btn} onPress={handleSubmit}>
            <ThemedText>Login</ThemedText>
        </ThemedButton>
        <Spacer height={50} />

        <Link href="/forgotPassword">
            <ThemedText>Forgot Password?</ThemedText>
        </Link>
        <Spacer height={10} />

        <Link href="/register">
            <ThemedText>Register instead</ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Login

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