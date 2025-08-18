import { StyleSheet, TouchableWithoutFeedback, Alert} from 'react-native'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Keyboard } from 'react-native'
import { useAuth } from '../../hooks/useAuth'

import React from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'

const register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    const handleSubmit = async () => {
      try {
        await register(email, password);
      } catch (error) {
        Alert.alert("Registration failed", error.message);
      }
      console.log("Register button pressed: ", email, password);
    }

  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
      <ThemedView style={styles.container}>
          
          <Spacer />
          <ThemedText title={true}>
              Register as new User
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
              <ThemedText>Register</ThemedText>
          </ThemedButton>
          <Spacer height={10} />
          
      </ThemedView>
    </TouchableWithoutFeedback>
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