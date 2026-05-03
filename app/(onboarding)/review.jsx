import { StyleSheet, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'
import { useOnboarding } from '../../context/OnboardingContext'

const Review = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const { user } = useAuth()
  const { onboardingData, resetOnboardingData } = useOnboarding()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const goToEditPage = (page) => {
    router.push({
      pathname: `/(onboarding)/${page}`,
      params: { editMode: 'true' },
    })
  }

  const saveProfile = async () => {
    console.log('Saving pressed')
    console.log('user:', user?.uid)
    console.log('onboardingData:', onboardingData)
    if (!user) {
      Alert.alert('Error', 'No logged-in user found.')
      return
    }

    try {
      setSaving(true)

      await setDoc(
        doc(db, 'users', user.uid),
        {
          ...onboardingData,
          startingWeight: Number(onboardingData.weight),
          weight: Number(onboardingData.weight),
          onboardingComplete: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      resetOnboardingData()
      router.replace('/(navbar)/dashboard')
    } catch (error) {
      console.log('Error saving onboarding:', error)
      Alert.alert('Save failed', 'Could not save your details. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Review your details
        </ThemedText>

        <Spacer size={24} />

        <ReviewRow
          label="Name"
          value={onboardingData.name}
          edit={() => goToEditPage('name')}
        />

        <ReviewRow
          label="Age"
          value={onboardingData.age ? String(onboardingData.age) : 'Not provided'}
          edit={() => goToEditPage('age')}
        />

        <ReviewRow
          label="Height"
          value={onboardingData.height ? `${onboardingData.height} cm` : 'Not provided'}
          edit={() => goToEditPage('body')}
        />

        <ReviewRow
          label="Weight"
          value={onboardingData.weight ? `${onboardingData.weight} kg` : 'Not provided'}
          edit={() => goToEditPage('body')}
        />

        <ReviewRow
          label="Fitness level"
          value={onboardingData.fitnessLevel}
          edit={() => goToEditPage('level')}
        />

        <ReviewRow
          label="Goals"
          value={
            Array.isArray(onboardingData.fitnessGoal) &&
            onboardingData.fitnessGoal.length > 0
              ? onboardingData.fitnessGoal.join(', ')
              : 'Not provided'
          }
          edit={() => goToEditPage('goal')}
        />

        <Spacer size={30} />

        <ThemedButton onPress={saveProfile}>
          <ThemedText>{saving ? 'Saving...' : 'Confirm and continue'}</ThemedText>
        </ThemedButton>
      </ScrollView>
    </ThemedView>
  )
}

const ReviewRow = ({ label, value, edit }) => {
  return (
    <ThemedView style={styles.row}>
      <ThemedText style={styles.label}>{label}</ThemedText>

      <ThemedText style={styles.value}>
        {value || 'Not provided'}
      </ThemedText>

      <ThemedButton onPress={edit} style={styles.editButton}>
        <ThemedText>Edit</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

export default Review

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    width: '90%',
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
})