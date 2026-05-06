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

const muscleOptions = [
    'All',
    'chest',
    'shoulders',
    'biceps',
    'triceps',
    'forearms',
    'abdominals',
    'quadriceps',
    'hamstrings',
    'calves',
    'glutes',
    'lats',
    'middle back',
    'lower back',
    'traps',
]

const WorkoutLog = () => {
    const { user } = useAuth()
    const navigation = useNavigation()
    const router = useRouter()

    const [search, setSearch] = useState('')
    const [selectedExercises, setSelectedExercises] = useState([])
    const [selectedMuscle, setSelectedMuscle] = useState("All")

    useEffect(() => {
        navigation.setOptions({
            title: 'Workout Log',
            headerBackTitle: 'Fitness',
            headerBackTitleStyle: { fontSize: 14 },
            headerTitleStyle: { fontSize: 20 },
        })
    }, [navigation])

    const filteredExercises = useMemo(() => {
        if (search.trim().length < 2 && selectedMuscle === 'All') return []

        return exercises
        .filter((exercise) => {
            const alreadyAdded = selectedExercises.some(
            (selected) => selected.id === exercise.id
            )
            if (alreadyAdded) return false

            const matchesSearch =
                search.trim().length < 2 ||
                exercise.name.toLowerCase().includes(search.toLowerCase())

            const muscleList = [
                ...(exercise.primaryMuscles || []),
                ...(exercise.secondaryMuscles || []),
            ]

            const matchesMuscle =
                selectedMuscle === 'All' ||
                muscleList.includes(selectedMuscle)

            return matchesSearch && matchesMuscle
        })
            .slice(0, 12)
    }, [search, selectedMuscle, selectedExercises])
    
    const saveWorkout = async () => {
        if (!user) return
        if (selectedExercises.length === 0) return

        Alert.prompt(
            "Workout title",
            "Name this workout session.",
            async (workoutTitle) => {
            const finalWorkoutTitle = workoutTitle && workoutTitle.trim().length > 0 ? workoutTitle.trim() : "Workout"

            try {
                const cleanedExercises = selectedExercises.map((exercise) => ({
                    name: exercise.name,
                    category: exercise.category,
                    sets: exercise.sets.map((set) =>
                        exercise.category === 'cardio'
                        ? {
                            setNumber: set.setNumber,
                            distance: Number(set.distance) || 0,
                            time: set.time || '00:00:00',
                            }
                        : {
                            setNumber: set.setNumber,
                            weight: Number(set.weight) || 0,
                            reps: Number(set.reps) || 0,
                            }
                    ),
                }))
                await addDoc(collection(db, 'users', user.uid, 'workoutLogs'), {
                    title: finalWorkoutTitle,
                    date: new Date().toLocaleDateString('en-CA'),
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
            category: exercise.category,
            sets: [
                exercise.category === "cardio"
                ? {
                    setNumber: 1,
                    distance: '',
                    time: '',
                }
                : {
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
                    exercise.category === "cardio"
                    ? {
                        setNumber: exercise.sets.length + 1,
                        distance: '',
                        time: '',
                    }
                    : {
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

    const formatTimeInput = (text) => {
        const numbersOnly = text.replace(/[^0-9]/g, '').slice(0, 6)

        if (numbersOnly.length <= 2) {
            return numbersOnly
        }

        if (numbersOnly.length <= 4) {
            const minutes = numbersOnly.slice(0, numbersOnly.length - 2)
            const seconds = numbersOnly.slice(-2)

            return `${minutes}:${seconds}`
        }

        const hours = numbersOnly.slice(0, numbersOnly.length - 4)
        const minutes = numbersOnly.slice(-4, -2)
        const seconds = numbersOnly.slice(-2)

        return `${hours}:${minutes}:${seconds}`
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

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {muscleOptions.map((muscle) => (
                        <ThemedButton
                            key={muscle}
                            onPress={() => setSelectedMuscle(muscle)}
                            style={[
                            styles.filterButton,
                            selectedMuscle === muscle && styles.selectedFilterButton,
                            ]}
                        >
                            <ThemedText style={styles.filterButtonText}>
                            {muscle}
                            </ThemedText>
                        </ThemedButton>
                        ))}
                    </ScrollView>

                    <Spacer height={12} />

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
                                {exercise.category === 'cardio' ? (
                                    <>
                                        <ThemedText style={styles.setColumn}>Distance (km)</ThemedText>
                                        <ThemedText style={styles.setColumn}>Time</ThemedText>
                                    </>
                                    ) : (
                                    <>
                                        <ThemedText style={styles.setColumn}>Weight</ThemedText>
                                        <ThemedText style={styles.setColumn}>Reps</ThemedText>
                                    </>
                                )}
                            </View>


                            {exercise.sets.map((set, index) => (
                                <View key={index} style={styles.setRow}>
                                    <ThemedText style={styles.setNumber}>
                                    {set.setNumber}
                                    </ThemedText>

                                    {exercise.category === 'cardio' ? (
                                        <>
                                        <ThemedTextInput
                                        style={styles.setColumnInputWeight}
                                        placeholder="km"
                                        keyboardType="decimal-pad"
                                        value={set.distance}
                                        onChangeText={(text) =>
                                            updateSetField(
                                            exercise.id,
                                            index,
                                            'distance',
                                            text.replace(/[^0-9.]/g, '')
                                            )
                                        }
                                        />

                                        <ThemedTextInput
                                            style={styles.setColumnInputReps, styles.timeInput}
                                            placeholder="00:00:00"
                                            keyboardType="numeric"
                                            value={set.time}
                                            maxLength={8}
                                            onChangeText={(text) => updateSetField(
                                                exercise.id,
                                                index,
                                                'time',
                                                formatTimeInput(text)
                                            )}
                                        />
                                    </>
                                    ) : (
                                    <>
                                        <ThemedTextInput
                                        style={styles.setColumnInputWeight}
                                        placeholder="kg"
                                        keyboardType="decimal-pad"
                                        value={set.weight}
                                        onChangeText={(text) =>
                                            updateSetField(
                                            exercise.id,
                                            index,
                                            'weight',
                                            text.replace(/[^0-9.]/g, '')
                                            )
                                        }
                                        />

                                        <ThemedTextInput
                                        style={styles.setColumnInputReps}
                                        placeholder="reps"
                                        keyboardType="numeric"
                                        value={set.reps}
                                        onChangeText={(text) =>
                                            updateSetField(
                                            exercise.id,
                                            index,
                                            'reps',
                                            text.replace(/[^0-9]/g, '')
                                            )
                                        }
                                        />
                                    </>
                                    )}
                                </View>
                                ))}

                            <ThemedButton onPress={() => addSet(exercise.id)} style={styles.addSetButton}>
                                <ThemedText>+ Add Set</ThemedText>
                            </ThemedButton>

                            <Spacer height={10} />

                            <ThemedButton onPress={() => removeLatestSet(exercise.id)} style={styles.removeButton}>
                                <ThemedText warning={true}>Remove latest set</ThemedText>
                            </ThemedButton>

                            <Spacer height={10} />

                            <ThemedButton onPress={() => removeExercise(exercise.id)} style={styles.removeButton}>
                                <ThemedText warning={true}>
                                    Remove Exercise
                                </ThemedText>
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
        alignSelf: 'center',
        marginTop: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addSetButton: {
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
    filterButton: {
        marginRight: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
        selectedFilterButton: {
        opacity: 0.65,
    },
        filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    timeInput: {
        flex: 1.3,
        paddingLeft: 63,
    },
})