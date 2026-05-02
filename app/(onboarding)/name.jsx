import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

const OnboardingName = () => {
  const router = useRouter()
  const [name, setName] = useState('')

  const isComplete = name.trim().length > 0

  const handleNext = () => {
    if (!isComplete) {
      alert('Please enter your name')
      return
    }
    
    router.push({
      pathname: '/(onboarding)/age',
      params: { name: name.trim() },
    })
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        How would you like to be refered to?
      </ThemedText>

      <Spacer size={24} />

      <ThemedTextInput
          style={{ width: '80%', marginBottom: 20 }}
          placeholder="Name"
          autoCapitalize="words"
          value={name}
          onChangeText={(text) => {
            const cleanedName = text.replace(/[^a-zA-Z\s-]/g, '')
            setName(cleanedName);
          }}
        />

      <Spacer size={30} />
      <ThemedButton onPress={handleNext} disabled={!isComplete}>
        <ThemedText>Continue</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

export default OnboardingName

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
