import { StyleSheet, ScrollView, View, Dimensions } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg'
import { Pedometer } from 'expo-sensors'

import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'


const Dashboard = () => {
  const router = useRouter()
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [weightLogs, setWeightLogs] = useState([])
  const [mealLogs, setMealLogs] = useState([])
  const [workoutLogs, setWorkoutLogs] = useState([])
  const [steps, setSteps] = useState(0)
  const [stepsAvailable, setStepsAvailable] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        if (!user) return

        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          setProfile(snap.data())
        }

        const weightQuery = query(
          collection(db, 'users', user.uid, 'weightLogs'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )

        const weightSnapshot = await getDocs(weightQuery)

        const logs = weightSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setWeightLogs(logs)

        const mealSnapshot = await getDocs(collection(db, 'users', user.uid, 'mealLogs'))

        const meals = mealSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setMealLogs(meals)

        const workoutSnapshot = await getDocs(collection(db, 'users', user.uid, 'workoutLogs'))

        const workouts = workoutSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setWorkoutLogs(workouts)

        const isAvailable = await Pedometer.isAvailableAsync()
        setStepsAvailable(isAvailable)

        if (isAvailable) {
          const start = new Date()
          start.setHours(0, 0, 0, 0)

          const end = new Date()

          const result = await Pedometer.getStepCountAsync(start, end)
          setSteps(result.steps || 0)
        }
      }

      loadProfile()
    }, [user])
  )

  const name = profile?.name || 'User'

  const currentWeight = profile?.weight
  const startingWeight = profile?.startingWeight

  const weightChange =
    currentWeight && startingWeight
      ? currentWeight - startingWeight
      : null

  const today = new Date().toLocaleDateString('en-CA')

  const todayMeals = mealLogs.filter((meal) => meal.date === today)
  const todayWorkouts = workoutLogs.filter((workout) => workout.date === today)

  const loggedCalories = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.calories || 0)
  }, 0)

  const loggedProtein = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.protein || 0)
  }, 0)

  const loggedFat = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.fat || 0)
  }, 0)

  const weight = Number(profile?.weight || 0)
  const height = Number(profile?.height || 0)
  const age = Number(profile?.age || 0)
  const goal = String(profile?.fitnessGoal || '').toLowerCase()

  const fitnessLevel = String(profile?.fitnessLevel || '').toLowerCase()

  const activityMultiplier =
    fitnessLevel.includes('beginner') ? 1.2 :
    fitnessLevel.includes('intermediate') ? 1.5 :
    fitnessLevel.includes('advanced') ? 1.7 :
    1.2

  const maintenanceCalories = weight && height && age
    ? Math.round(((10 * weight) + (6.25 * height) - (5 * age) + 5) * activityMultiplier)
    : 0

  const calorieTarget = goal.includes('lose')
    ? maintenanceCalories - 500
    : maintenanceCalories

  const caloriesLeft = calorieTarget
    ? calorieTarget - loggedCalories
    : 0

  const todaysWorkout = todayWorkouts[0]

  const screenWidth = Dimensions.get('window').width
  const chartWidth = screenWidth - 80
  const chartHeight = 180
  const chartPadding = 24

  const sortedWeightLogs = [...weightLogs].reverse()
  const weightValues = sortedWeightLogs.map((log) => Number(log.weight || 0))

  const minWeight = Math.min(...weightValues)
  const maxWeight = Math.max(...weightValues)
  const weightRange = maxWeight - minWeight || 1

  const getX = (index) => {
    if (sortedWeightLogs.length === 1) return chartWidth / 2
    return (chartPadding * 2.5) + (index * (chartWidth - chartPadding * 4)) / (sortedWeightLogs.length - 1)
  }
  const getY = (weight) => {
    return chartPadding + ((maxWeight - weight) / weightRange) * (chartHeight - chartPadding * 2)
  }
  const chartPoints = sortedWeightLogs.map((log, index) => ({
    x: getX(index),
    y: getY(Number(log.weight || 0)),
    weight: Number(log.weight || 0),
    date: log.date,
  }))

  const yAxisLabels = [
    maxWeight,
    (maxWeight + minWeight) / 2,
    minWeight,
  ]

  return (
    <ThemedView style={styles.container} safe={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText title={true} style={styles.greeting}>
          Welcome back, {name}
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Here’s your health and fitness snapshot for today.
        </ThemedText>

        <ThemedCard style={styles.fullCard}>
        <ThemedText style={styles.cardTitle}>Weight Progress</ThemedText>

        <ThemedText>
          Current weight: {profile?.weight ? `${profile.weight} kg` : 'Not available'}
        </ThemedText>

        {weightChange !== null && weightLogs.length > 1 && (
          <ThemedText>
            Your weight has changed by {weightChange > 0 ? '+' : ''}{weightChange} kg!
          </ThemedText>
        )}

        <Spacer height={20} />

        {weightLogs.length > 1 ? (
          <Svg width={chartWidth} height={chartHeight} style={styles.weightChart}>
            {yAxisLabels.map((label, index) => {
              const y = chartPadding + (index * (chartHeight - chartPadding * 2)) / 2

              return (
                <SvgText
                  key={`y-label-${index}`}
                  x={0}
                  y={y + 4}
                  fontSize="10"
                  fill="blue"
                >
                  {label.toFixed(1)}kg
                </SvgText>
              )
            })}

            {chartPoints.map((point, index) => {
              const barWidth = 18
              const barHeight = chartHeight - chartPadding - point.y

              return (
                <React.Fragment key={`bar-${index}`}>
                  <Line
                    x1={point.x}
                    y1={chartHeight - chartPadding}
                    x2={point.x}
                    y2={point.y}
                    stroke="orange"
                    strokeWidth={barWidth}
                    strokeLinecap="round"
                  />

                  <Circle cx={point.x} cy={point.y} r="4" fill="orange" />

                  <SvgText
                    x={point.x}
                    y={point.y - 12}
                    fontSize="10"
                    fill="green"
                    textAnchor="middle"
                  >
                    {point.weight}kg
                  </SvgText>

                  <SvgText
                    x={point.x}
                    y={chartHeight - 4}
                    fontSize="10"
                    fill="red"
                    textAnchor="middle"
                  >
                    {point.date?.slice(5)}
                  </SvgText>
                </React.Fragment>
              )
            })}
          </Svg>
        ) : (
          <ThemedText>Log at least two weights to show a graph.</ThemedText>
        )}

        <ThemedButton
          onPress={() => router.push('/(dashboard)/weightLog')}
          style={styles.weightButton}
        >
          <ThemedText style={styles.weightButtonText}>+ Log new weight</ThemedText>
        </ThemedButton>

        <ThemedButton
          onPress={() => router.push('/(dashboard)/manageWeightLogs')}
          style={styles.weightButton}
        >
          <ThemedText style={styles.weightButtonText}>
            Manage weight logs
          </ThemedText>
        </ThemedButton>

      </ThemedCard>

        <Spacer height={20} />

        <View style={styles.grid}>
          <ThemedCard style={styles.smallCard}>
            <ThemedText style={[styles.cardTitle, { color: 'orange'}]}>Calories</ThemedText>
            <ThemedText style={[styles.cardValue, { color: 'orange'}]}>{caloriesLeft}</ThemedText>
            <ThemedText style={styles.cardSubtext}>calories left</ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.smallCard}>
            <ThemedText style={[styles.cardTitle, { color: 'green'}]}>Protein</ThemedText>
            <ThemedText style={[styles.cardValue, { color: 'green'}]}>{loggedProtein.toFixed(1)}g</ThemedText>
            <ThemedText style={styles.cardSubtext}>protein logged</ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.smallCard}>
            <ThemedText style={[styles.cardTitle, { color: 'blue'}]}>Fat</ThemedText>
            <ThemedText style={[styles.cardValue, { color: 'blue'}]}>{loggedFat.toFixed(1)}g</ThemedText>
            <ThemedText style={styles.cardSubtext}>fat logged</ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.smallCard}>
            <ThemedText style={[styles.cardTitle, { color: 'red'}]}>Steps</ThemedText>
            <ThemedText style={styles.cardValue}>
            {stepsAvailable ? steps : '—'}
            </ThemedText>

            <ThemedText style={styles.cardSubtext}>
              {stepsAvailable ? 'steps today' : 'steps unavailable'}
            </ThemedText>
          </ThemedCard>
        </View>

        <Spacer height={16} />

        <ThemedCard style={styles.fullCard}>
        <ThemedText style={styles.cardTitle}>Today’s Workout</ThemedText>

        {todaysWorkout ? (
          <ThemedText style={styles.workoutLogged}>
            {todaysWorkout.title || 'Workout logged'}
          </ThemedText>
        ) : (
          <ThemedText>No workout logged.</ThemedText>
        )}
      </ThemedCard>

      
      </ScrollView>
    </ThemedView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  greeting: {
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
  card: {
    width: '100%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  smallCard: {
    width: '48%',
    minHeight: 105,
    margin: 0,
    marginBottom: 12,
    padding: 12,
    justifyContent: 'center',
  },
  fullCard: {
    width: '100%',
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  cardSubtext: {
    fontSize: 13,
    opacity: 0.7,
  },
  weightButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,

    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',

    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  weightButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },

  workoutLogged: {
    color: 'green',
    fontWeight: '700',
  },

  weightChart: {
    marginTop: 12,
    alignSelf: 'center',
  },
})