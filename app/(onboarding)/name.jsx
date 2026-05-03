import { StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import { useOnboarding } from '../../context/OnboardingContext'

const OnboardingName = () => {
  const router = useRouter()
  const { onboardingData, updateOnboardingData } = useOnboarding()
  const { editMode } = useLocalSearchParams()
  const isEditMode = editMode === "true"

  const [name, setName] = useState(onboardingData.name)

  const isComplete = name.trim().length > 0

  const onContinue = () => {
    if (!isComplete) {
      Alert.alert('Please enter your name')
      return
    }
    updateOnboardingData({ name: name.trim() })
    router.push(isEditMode ? '/(onboarding)/review' : '/(onboarding)/age')
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
      <ThemedButton onPress={onContinue}>
        <ThemedText>{isEditMode ? "Save Changes" : "Continue"}</ThemedText>
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
