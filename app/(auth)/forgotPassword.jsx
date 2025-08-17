import { StyleSheet, Alert} from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import { useAuth } from '../../hooks/useAuth'
import Spacer from '../../components/Spacer'

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const forgotPassword = () => {
  const [email, setEmail] = React.useState('')
  const { forgotPassword, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.')
      return
    }

    try {
      await forgotPassword(email)
      Alert.alert('Success', 'Password reset email sent.', [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }])
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText title={ true }>
        Forgot Password
      </ThemedText>
      <Spacer height={50} />

      <ThemedTextInput
          style={{ width: '80%', marginBottom: 20 }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
      <ThemedButton onPress={handleSubmit} loading={loading}>
        <ThemedText>Send Reset Link</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

export default forgotPassword

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
  }
})