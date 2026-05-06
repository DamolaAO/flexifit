import { StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

const WeightLog = () => {
  const { user } = useAuth()
  const router = useRouter()
  const navigation = useNavigation()
  const [weight, setWeight] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      title: 'Weight Log',
      headerBackTitle: 'Dashboard',
      headerTitleStyle: {
        fontSize: 20
      },
      headerBackTitleStyle: {
        fontSize: 14
      }
    })
  }, [navigation])

  const saveWeight = async () => {
    const weightNum = Number(weight)

    if (!weight || weightNum < 30 || weightNum > 300) {
      Alert.alert('Invalid weight', 'Please enter a weight between 30kg and 300kg.')
      return
    }

    if (!user) {
      Alert.alert('Error', 'No logged-in user found.')
      return
    }

    try {
      setSaving(true)

      await addDoc(collection(db, 'users', user.uid, 'weightLogs'), {
        weight: weightNum,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      })

      await updateDoc(doc(db, 'users', user.uid), {
        weight: weightNum,
        updatedAt: serverTimestamp(),
      })

      Alert.alert('Saved', 'Your weight has been logged.')
      router.back()
    } catch (error) {
      console.log('Error saving weight:', error)
      Alert.alert('Save failed', 'Could not save your weight. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Log your weight
        </ThemedText>

        <Spacer size={20} />

        <ThemedTextInput
          style={styles.input}
          placeholder="Weight in kg, e.g. 82"
          keyboardType="numeric"
          maxLength={3}
          value={weight}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9]/g, '')
            setWeight(cleaned)
          }}
        />

        <Spacer size={30} />

        <ThemedButton style={{alignSelf: 'center'}} onPress={saveWeight}>
          <ThemedText>{saving ? 'Saving...' : 'Save weight'}</ThemedText>
        </ThemedButton>
      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default WeightLog

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
  input: {
    width: '80%',
  },
})