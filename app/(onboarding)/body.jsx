import { StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useNavigation } from '@react-navigation/native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import { useOnboarding } from '../../context/OnboardingContext'

const OnboardingBodyInfo = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const { editMode } = useLocalSearchParams();
  const isEditMode = editMode === 'true';

  const { onboardingData, updateOnboardingData } = useOnboarding()

  const [height, setHeight] = useState(
    onboardingData.height ? String(onboardingData.height) : ''
  )

  const [weight, setWeight] = useState(
    onboardingData.weight ? String(onboardingData.weight) : ''
  )

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const isComplete = height.trim().length > 0 && weight.trim().length > 0

  const onContinue = () => {
    if (!isComplete) {
      Alert.alert(
        'Missing details',
        'Please enter both your height and weight.'
      )
      return
    }

  const heightNum = Number(height)
  const weightNum = Number(weight)

  if (heightNum < 100 || heightNum > 250) {
    Alert.alert(
      'Invalid height',
      'Please enter a height between 100cm and 250cm.'
    )
    return
  }

  if (weightNum < 30 || weightNum > 300) {
    Alert.alert(
      'Invalid weight',
      'Please enter a weight between 30kg and 300kg.'
    )
    return
  }

  updateOnboardingData({
    height: heightNum,
    weight: weightNum,
  })

  router.push(isEditMode ? '/(onboarding)/review' : '/(onboarding)/level')
}

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Tell us about yourself
        </ThemedText>

        <Spacer size={10} />

        <ThemedText style={styles.subtitle}>
          Enter your height in cm and your weight in kg.
        </ThemedText>

        <Spacer size={30} />

        <ThemedText style={styles.label}>Height</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Height in cm, e.g. 175"
          keyboardType="numeric"
          maxLenght={3}
          value={height}
          onChangeText={(text) => {
            const cleanedHeight = text.replace(/[^0-9]/g, '')
            setHeight(cleanedHeight)
          }}
        />

        <Spacer size={20} />

        <ThemedText style={styles.label}>Weight</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Weight in kg, e.g. 82"
          keyboardType="numeric"
          maxLenght={3}
          value={weight}
          onChangeText={(text) => {
            const cleanedWeight = text.replace(/[^0-9]/g, '')
            setWeight(cleanedWeight)
          }}
        />

        <Spacer size={35} />

        <ThemedButton onPress={onContinue}>
          <ThemedText>{isEditMode ? "Save Changes" : "Continue"}</ThemedText>
        </ThemedButton>
      </ThemedView>
    </TouchableWithoutFeedback>
    
  )
}

export default OnboardingBodyInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
  },
  input: {
    width: '80%',
  },
  label: {
    width: '80%',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
})