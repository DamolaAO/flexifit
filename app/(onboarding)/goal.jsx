import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useNavigation } from '@react-navigation/native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

import { useOnboarding } from '../../context/OnboardingContext'

const goalOptions = [
  'Lose weight',
  'Maintain weight',
  'Build muscle',
  'Improve fitness',
  'Eat healthy',
]

const OnboardingFitnessGoal = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const { editMode } = useLocalSearchParams();
  const isEditMode = editMode === 'true';

  const { onboardingData, updateOnboardingData } = useOnboarding()

  const [fitnessGoal, setFitnessGoal] = useState(
    onboardingData.fitnessGoal || []
  )

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const toggleGoal = (goal) => {
    if (fitnessGoal.includes(goal)) {
      setFitnessGoal(fitnessGoal.filter((item) => item !== goal))
    } else {
      setFitnessGoal([...fitnessGoal, goal])
    }
  }

  const isComplete = fitnessGoal.length > 0

  const onContinue = () => {
    if (!isComplete) return

    updateOnboardingData({
      fitnessGoal,
    })

    router.push('/(onboarding)/review')
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        What are your goals?
      </ThemedText>

      <Spacer height={15} />

      <ThemedText style={styles.subtitle}>
        Select one or more goals.
      </ThemedText>

      <Spacer height={30} />

      {goalOptions.map((goal) => {
        const selected = fitnessGoal.includes(goal)

        return (
          <ThemedButton
            key={goal}
            onPress={() => toggleGoal(goal)}
            style={[
              styles.goalButton,
              selected && styles.selectedButton,
            ]}
          >
            <ThemedText>{goal}</ThemedText>
          </ThemedButton>
        )
      })}

      <Spacer height={30} />

      <ThemedButton onPress={onContinue} disabled={!isComplete}>
        <ThemedText>{isEditMode ? "Save Changes" : "Continue"}</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

export default OnboardingFitnessGoal

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
  goalButton: {
    width: '80%',
    marginBottom: 12,
  },
  selectedButton: {
    opacity: 0.65,
  },
})