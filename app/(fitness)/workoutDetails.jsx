import { StyleSheet, ScrollView, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'

import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'

const WorkoutDetails = () => {
    const navigation = useNavigation()
    const { workoutId } = useLocalSearchParams()
    const { user } = useAuth()
    const router = useRouter()

    const [workout, setWorkout] = useState(null)

    useEffect(() => {
        navigation.setOptions({
            title: 'Workout Details',
            headerBackTitle: 'Fitness',
            headerBackTitleStyle: { fontSize: 14 },
            headerTitleStyle: { fontSize: 20 },
        })
    }, [navigation])

    useEffect(() => {
        const fetchWorkout = async () => {
            if (!user || !workoutId) return

            const ref = doc(db, 'users', user.uid, 'workoutLogs', workoutId)
            const snap = await getDoc(ref)

            if (snap.exists()) {
                setWorkout({
                id: snap.id,
                ...snap.data(),
                })
            }
        }

        fetchWorkout()
    }, [user, workoutId])

    const totalExercises = workout?.exercises?.length || 0

    const totalSets = workout?.exercises?.reduce((total, exercise) => {
    return total + (exercise.sets?.length || 0)
    }, 0)

    const totalReps = workout?.exercises?.reduce((total, exercise) => {
    return total + exercise.sets?.reduce((setTotal, set) => {
        return setTotal + (Number(set.reps) || 0)
    }, 0)
    }, 0)

    const totalVolume = workout?.exercises?.reduce((total, exercise) => {
    return total + exercise.sets?.reduce((setTotal, set) => {
        return setTotal + ((Number(set.weight) || 0) * (Number(set.reps) || 0))
    }, 0)
    }, 0)

    const editWorkoutTitle = () => {
        Alert.prompt(
            'Edit workout title',
            'Enter a new workout title.',
            async (newTitle) => {
            const finalTitle =
                newTitle && newTitle.trim().length > 0
                ? newTitle.trim()
                : 'Workout'

            try {
                await updateDoc(
                doc(db, 'users', user.uid, 'workoutLogs', workoutId),
                {
                    title: finalTitle,
                }
                )

                setWorkout((current) => ({
                ...current,
                title: finalTitle,
                }))
            } catch (error) {
                Alert.alert(
                'Update failed',
                'Could not update workout title.'
                )
            }
            },
            'plain-text',
            workout.title
        )
    }

    const deleteWorkout = () => {
        Alert.alert(
            'Delete workout?',
            'This workout will be permanently removed.',
            [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                if (!user || !workoutId) return

                try {
                    await deleteDoc(
                    doc(db, 'users', user.uid, 'workoutLogs', workoutId)
                    )

                    router.back()
                } catch (error) {
                    Alert.alert('Delete failed', 'Could not delete this workout.')
                }
                },
            },
            ]
        )
    }

    const totalDistance = workout?.exercises?.reduce((total, exercise) => {
        if (exercise.category !== 'cardio') return total

        return total + exercise.sets?.reduce((setTotal, set) => {
            return setTotal + (Number(set.distance) || 0)
        }, 0)
    }, 0)

    if (!workout) {
        return (
        <ThemedView style={styles.container} safe={true}>
            <ThemedText>Loading workout...</ThemedText>
        </ThemedView>
        )
    }

    return (
        <ThemedView style={styles.container} safe={true}>
            <ScrollView contentContainerStyle={styles.content}>

                <ThemedText title={true}style={styles.title}onPress={editWorkoutTitle}>
                    {workout.title || 'Workout'}
                </ThemedText>

                <ThemedText style={styles.date}>
                {workout.date || 'No date saved'}
                </ThemedText>

                <Spacer height={20} />

                <ThemedCard style={styles.statsCard}>
                    <ThemedText style={styles.statsTitle}>Workout Summary</ThemedText>
                    <ThemedText style={styles.summaryContent}>Exercises: {totalExercises}</ThemedText>
                    <ThemedText style={styles.summaryContent}>Sets: {totalSets}</ThemedText>
                    <ThemedText style={styles.summaryContent}>Reps: {totalReps}</ThemedText>
                    <ThemedText style={styles.summaryContent}>Volume: {totalVolume} kg</ThemedText>
                    <ThemedText style={styles.summaryContent}>Cardio Distance: {totalDistance} km</ThemedText>
                </ThemedCard>

                <Spacer height={20} />

                {workout.exercises?.map((exercise, exerciseIndex) => (
                <ThemedCard key={exerciseIndex} style={styles.exerciseCard}>
                    <ThemedText style={styles.exerciseTitle}>
                    {exercise.name}
                    </ThemedText>

                    <Spacer height={12} />

                    <View style={styles.setHeader}>
                        <ThemedText style={styles.setColumn}>Set</ThemedText>

                        {exercise.category === 'cardio' ? (
                            <>
                            <ThemedText style={styles.setColumn}>Distance</ThemedText>
                            <ThemedText style={styles.setColumn}>Time</ThemedText>
                            </>
                        ) : (
                            <>
                            <ThemedText style={styles.setColumn}>Weight</ThemedText>
                            <ThemedText style={styles.setColumn}>Reps</ThemedText>
                            </>
                        )}
                    </View>

                    {exercise.sets?.map((set, setIndex) => (
                    <View key={setIndex} style={styles.setRow}>
                        <ThemedText style={styles.setColumn}>
                        {set.setNumber}
                        </ThemedText>

                        {exercise.category === 'cardio' ? (
                            <>
                            <ThemedText style={styles.setColumn}>
                            {set.distance || 0} km
                            </ThemedText>

                            <ThemedText style={styles.setColumn}>
                            {set.time || '00:00'}
                            </ThemedText>
                            </>
                        ) : (
                            <>
                            <ThemedText style={styles.setColumn}>
                            {set.weight} kg
                            </ThemedText>

                            <ThemedText style={styles.setColumn}>
                            {set.reps}
                            </ThemedText>
                            </>
                        )}
                    </View>
                    ))}
                </ThemedCard>
                ))}
                <Spacer height={20} />

                <ThemedButton onPress={deleteWorkout} style={styles.deleteButton}>
                    <ThemedText warning={true} style={styles.deleteButtonText}>
                        Delete Workout
                    </ThemedText>
                </ThemedButton>
            </ScrollView>
        </ThemedView>
    )
}

export default WorkoutDetails

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
    date: {
        fontSize: 15,
        fontWeight: '700',
        opacity: 0.75,
        marginTop: 6,
    },
    exerciseCard: {
        width: '100%',
        marginBottom: 14,
    },
    exerciseTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    setHeader: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 8,
    },
    setRow: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 8,
    },
    setColumn: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '600',
    },
    deleteButton: {
        width: '100%',
        alignSelf: 'center',
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    statsCard: {
        width: '100%',
        marginBottom: 14,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    summaryContent: {
        textAlign: 'center',
    }
})