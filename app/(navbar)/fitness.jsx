import { StyleSheet, ScrollView, View } from 'react-native'
import React, { useCallback, useState, useRef } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'

import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import ThemedPopupButton from '../../components/ThemedPopupButton'

const Fitness = () => {
  const router = useRouter()
  const { user } = useAuth()
  const scrollRef = useRef(null)

  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  

  useFocusEffect(
    useCallback(() => {
      const fetchWorkouts = async () => {
        if (!user) return

        try {
          setLoading(true)

          const workoutQuery = query(
            collection(db, 'users', user.uid, 'workoutLogs'),
            orderBy('createdAt', 'desc'),
            limit(10)
          )

          const snapshot = await getDocs(workoutQuery)

          const workoutData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          setWorkouts(workoutData)
        } catch (error) {
          console.log('Error fetching workouts:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchWorkouts()
    }, [user])
  )

  return (
    <ThemedView style={styles.container} safe={true}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} onScroll={(event) => {
        setShowScrollTop(
          event.nativeEvent.contentOffset.y > 250
        )
      }} scrollEventThrottle={16}>
        <ThemedText title={true} style={styles.title}>
          Fitness
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Track your workout sessions and review your recent training history.
        </ThemedText>

        <Spacer height={20} />

        <ThemedCard style={styles.fullCard}>
          <ThemedText style={styles.cardTitle}>Workout History</ThemedText>

          <Spacer height={10} />

          {loading ? (
            <ThemedText>Loading workouts...</ThemedText>
          ) : workouts.length > 0 ? (
            workouts.map((workout) => (
              <View key={workout.id} style={styles.workoutItem}>
                <ThemedText style={styles.workoutTitle}>
                  {workout.title || `${workout.exercises?.length || 0} exercise session`}
                </ThemedText>

                <ThemedText style={styles.workoutDate}>
                  {workout.date || 'No date saved'}
                </ThemedText>

                <Spacer height={6} />

                {workout.exercises?.slice(0, 3).map((exercise, index) => (
                  <ThemedText key={index} style={styles.exerciseText}>
                    • {exercise.name}
                  </ThemedText>
                ))}
              </View>
            ))
          ) : (
            <ThemedText>No workouts logged yet.</ThemedText>
          )}
        </ThemedCard>
        <Spacer height={200}/>
      </ScrollView>

      {showScrollTop && (
        <ThemedPopupButton
          onPress={() => {
            if (scrollRef.current){
              scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
              })
            }
          }
      }
          style={styles.scrollTopButton}
        >
          <ThemedText>
            ↑
          </ThemedText>
        </ThemedPopupButton>
      )}

      <ThemedView style={styles.bottomBanner}>
        <ThemedButton
          onPress={() => router.push('/(fitness)/workoutLog')}
          style={styles.workoutButton}
        >
          <ThemedText style={styles.workoutButtonText}>
            + Log new workout
          </ThemedText>
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  )
}

export default Fitness

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
  workoutButton: {
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingVertical: 8,
  },
  workoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  workoutItem: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  workoutDate: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  exerciseText: {
    fontSize: 14,
    opacity: 0.85,
  },
  bottomBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  scrollTopButton: {
    top: 70,
    right: 20,
  },
})