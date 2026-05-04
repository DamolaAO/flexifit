import { StyleSheet, ScrollView, View, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'

import exercises from '../../data/exercises.json'

const WorkoutLog = () => {
    const { user } = useAuth()
    const navigation = useNavigation()
    const router = useRouter()

    const [search, setSearch] = useState('')
    const [selectedExercises, setSelectedExercises] = useState([])

    useEffect(() => {
        navigation.setOptions({
            title: 'Workout Log',
            headerBackTitle: 'Fitness',
            headerBackTitleStyle: { fontSize: 14 },
            headerTitleStyle: { fontSize: 20 },
        })
    }, [navigation])

    const filteredExercises = useMemo(() => {
        if (search.trim().length < 2) return []

        return exercises
            .filter((exercise) =>
            exercise.name.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, 8)
        }, [search])
    
        const saveWorkout = async () => {
            if (!user) return
            if (selectedExercises.length === 0) return

            Alert.prompt(
                'Workout title',
                'Name this workout session.',
                async (workoutTitle) => {
                const finalWorkoutTitle = workoutTitle && workoutTitle.trim().length > 0 ? workoutTitle.trim() : 'Workout'

                try {
                    const cleanedExercises = selectedExercises.map((exercise) => ({
                        name: exercise.name,
                        sets: exercise.sets.map((set) => ({
                            setNumber: set.setNumber,
                            weight: Number(set.weight) || 0,
                            reps: Number(set.reps) || 0,
                        })),
                    }))

                    await addDoc(collection(db, 'users', user.uid, 'workoutLogs'), {
                        title: finalWorkoutTitle,
                        date: new Date().toLocaleDateString(),
                        exercises: cleanedExercises,
                        createdAt: serverTimestamp(),
                    })

                    setSelectedExercises([])
                    router.back()
                } catch (error) {
                    console.log('Error saving workout:', error)
                }
                }
            )
        }

    const addExercise = (exercise) => {
        const alreadyAdded = selectedExercises.some(
            (item) => item.id === exercise.id
        )

        if (alreadyAdded) return

        setSelectedExercises([
            ...selectedExercises,
            {
            id: exercise.id,
            name: exercise.name,
            sets: [
                {
                    setNumber: 1,
                    weight: '',
                    reps: '',
                },
            ]
            },
        ])

        setSearch('')
    }

    const updateSetField = (exerciseId, setIndex, field, value) => {
        setSelectedExercises((current) =>
            current.map((exercise) =>
            exercise.id === exerciseId
                ? {
                    ...exercise,
                    sets: exercise.sets.map((set, index) =>
                    index === setIndex
                        ? { ...set, [field]: value }
                        : set
                    ),
                }
                : exercise
            )
        )
    }

    const addSet = (exerciseId) => {
        setSelectedExercises((current) =>
            current.map((exercise) =>
            exercise.id === exerciseId
                ? {
                    ...exercise,
                    sets: [
                    ...exercise.sets,
                    {
                        setNumber: exercise.sets.length + 1,
                        weight: '',
                        reps: '',
                    },
                    ],
                }
                : exercise
            )
        )
    }

    const removeLatestSet = (exerciseId) => {
        setSelectedExercises((current) =>
            current.map((exercise) =>
            exercise.id === exerciseId && exercise.sets.length > 1
                ? {
                    ...exercise,
                    sets: exercise.sets.slice(0, -1).map((set, index) => ({
                    ...set,
                    setNumber: index + 1,
                    })),
                }
                : exercise
            )
        )
    }

    const removeExercise = (id) => {
        setSelectedExercises((current) => 
            current.filter((exercise) => exercise.id !== id)
        )
    }

  return (
    <ThemedView style={styles.container} safe={true}>
        <ScrollView contentContainerStyle={styles.content}>
            <ThemedText title={true} style={styles.title}>
                Add Workout
            </ThemedText>

            <ThemedText style={styles.subtitle}>
                Search for exercises and add them to your workout.
            </ThemedText>

            <Spacer height={20} />

            <ThemedCard style={styles.fullCard}>
                <ThemedText style={styles.cardTitle}>Exercise Search</ThemedText>

                <ThemedTextInput
                    style={styles.input}
                    placeholder="Search exercise..."
                    value={search}
                    onChangeText={setSearch}
                />

                <Spacer height={1} />

                {filteredExercises.map((exercise) => (
                <ThemedButton
                    key={exercise.id}
                    onPress={() => addExercise(exercise)}
                    style={styles.exerciseButton}
                    >
                        <ThemedText style={styles.exerciseButtonText}>
                            {exercise.name}
                        </ThemedText>
                </ThemedButton>
                ))}
            </ThemedCard>

            <ThemedText style={styles.cardTitle}>Selected Exercises</ThemedText>

            {selectedExercises.length > 0 ? (
                selectedExercises.map((exercise) => (
                    <ThemedCard key={exercise.id} style={styles.exerciseCard}>
                        <ThemedText style={styles.selectedTitle}>
                        {exercise.name}
                        </ThemedText>

                        <Spacer height={12} />

                        <View style={styles.setHeader}>
                        <ThemedText style={styles.setColumnSmall}>Set</ThemedText>
                        <ThemedText style={styles.setColumn}>Weight (kg)</ThemedText>
                        <ThemedText style={styles.setColumn}>Reps</ThemedText>
                        </View>


                        {exercise.sets.map((set, index) => (
                            <View key={index} style={styles.setRow}>
                                <ThemedText style={styles.setNumber}>
                                {set.setNumber}
                                </ThemedText>

                                <ThemedTextInput
                                style={styles.setColumnInputWeight}
                                placeholder="Weight kg"
                                keyboardType="decimal-pad"
                                value={set.weight}
                                onChangeText={(text) =>
                                    updateSetField(exercise.id, index, 'weight', text.replace(/[^0-9.]/g, ''))
                                }
                                />

                                <ThemedTextInput
                                style={styles.setColumnInputReps}
                                placeholder="Reps"
                                keyboardType="numeric"
                                value={set.reps}
                                onChangeText={(text) =>
                                    updateSetField(exercise.id, index, 'reps', text.replace(/[^0-9]/g, ''))
                                }
                                />
                            </View>
                            ))}

                            <ThemedButton onPress={() => addSet(exercise.id)}>
                            <ThemedText>+ Add Set</ThemedText>
                            </ThemedButton>

                        <ThemedButton onPress={() => removeLatestSet(exercise.id)}>
                        <ThemedText warning={true}>Remove latest set</ThemedText>
                        </ThemedButton>

                        

                    </ThemedCard>
                ))
            ) : (
            <ThemedText>No exercises selected yet.</ThemedText>
            )}

            {selectedExercises.length > 0 && (
                <>
                    <Spacer height={20} />

                    <ThemedButton onPress={saveWorkout}>
                    <ThemedText>
                        Save Workout
                    </ThemedText>
                    </ThemedButton>
                </>
            )}
        </ScrollView>
    </ThemedView>
  )
}

export default WorkoutLog

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.75,
    marginTop: 8,
  },
  fullCard: {
    width: '100%',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
  },
  exerciseButton: {
    width: '100%',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  exerciseButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  exerciseCard: {
  width: '100%',
  marginBottom: 14,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  removeButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  removeButton: {
    alignSelf: 'center',
    marginTop: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  setColumnSmall: {
    width: '20%',
    fontWeight: '700',
  },
  setColumn: {
    width: '45%',
    fontWeight: '700',
  },
  setColumnInputWeight: {
    width: '40%',
    fontWeight: '700',
    paddingLeft: 48,
  },
  setColumnInputReps: {
    width: '40%',
    fontWeight: '700',
    paddingLeft: 63,
  },
  setColumnHeader: {
    flex: 1,
    fontWeight: '700',
    textAlign: 'center',
  },
  setNumber: {
    flex: 0.35,
    fontSize: 18,
    fontWeight: '700',
  },
})