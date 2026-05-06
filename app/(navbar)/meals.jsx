import { StyleSheet, ScrollView, View, Pressable } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import { collection, getDocs, orderBy, query, doc, deleteDoc, getDoc } from 'firebase/firestore'

import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'

const mealSections = ['Breakfast', 'Lunch', 'Dinner',  'Snacks']
const mealColours = {Breakfast: 'orange', Lunch: 'green', Dinner: '#800020', Snacks: 'purple',}

const getDateString = (date) => {
  return date.toLocaleDateString('en-CA')
}

const Meals = () => {
  const router = useRouter()
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useFocusEffect(
    useCallback(() => {
      const fetchMeals = async () => {
        if (!user) return

        try {
          setLoading(true)

          const mealsQuery = query(
            collection(db, 'users', user.uid, 'mealLogs'),
          )

          const snapshot = await getDocs(mealsQuery)

          const mealData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          setMeals(mealData)

          const profileRef = doc(db, 'users', user.uid)
          const profileSnap = await getDoc(profileRef)

          if (profileSnap.exists()) {
            setProfile(profileSnap.data())
          }
        } catch (error) {
          console.log('Error fetching meals:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchMeals()
    }, [user])
  )

  const selectedDateString = getDateString(selectedDate)

  const todayMeals = meals.filter((meal) => {
    return meal.date === selectedDateString
  })

  const totalCalories = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.calories || 0)
  }, 0)

  const totalProtein = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.protein || 0)
  }, 0)

  const totalCarbs = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.carbs || 0)
  }, 0)

  const totalFat = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.fat || 0)
  }, 0)

  const openMealLog = (mealType) => {
    router.push({
      pathname: '/(meals)/mealLog',
      params: {
        mealType,
        date: selectedDateString,
      },
    })
  }

  const quickDelete = async (mealId) => {
    if (!user) return

    try {
      const mealRef = doc(db, 'users', user.uid, 'mealLogs', mealId)

      await deleteDoc(mealRef)

      setMeals((prevMeals) =>
        prevMeals.filter((meal) => meal.id !== mealId)
      )
    } catch (error) {
      console.log('Error deleting meal:', error)
    }
  }

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

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

  const proteinTarget = goal.includes('build')
    ? Number((weight * 0.75).toFixed(1))
    : 0

  return (
    <ThemedView style={styles.container} safe={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dateRow}>
          <Pressable onPress={goToPreviousDay}>
            <ThemedText style={styles.dateArrow}>‹</ThemedText>
          </Pressable>

          <ThemedText style={styles.dateText}>
            {selectedDate.toDateString()}
          </ThemedText>

          <Pressable onPress={goToNextDay}>
            <ThemedText style={styles.dateArrow}>›</ThemedText>
          </Pressable>
        </View>
        <ThemedText title={true} style={styles.title}>
          Food Diary
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Log your meals and track today’s nutrition.
        </ThemedText>

        <Spacer height={20} />

        {mealSections.map((section) => {
          const sectionMeals = todayMeals.filter((meal) => {
            return meal.mealType === section
          })

          return (
            <ThemedCard key={section} style={styles.fullCard}>
              <Pressable
                style={({ pressed }) => [
                  styles.sectionHeader,
                  pressed && styles.sectionPressed,
                ]}
                onPress={() => openMealLog(section)}
              >
                <ThemedText
                  style={[
                    styles.cardTitle,
                    { color: mealColours[section] },
                  ]}
                >
                  {section}
                </ThemedText>

                <ThemedText
                  style={[
                    styles.addText,
                    { color: mealColours[section] },
                  ]}
                >
                  + Add
                </ThemedText>
              </Pressable>

              <Spacer height={10} />

              {loading ? (
                <ThemedText>Loading meals...</ThemedText>
              ) : sectionMeals.length > 0 ? (
                sectionMeals.map((meal) => (
                  <Pressable
                    key={meal.id}
                    style={({ pressed }) => [
                      styles.mealItem,
                      pressed && styles.mealPressed,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: '/(meals)/mealLog',
                        params: {
                          mealId: meal.id,
                        },
                      })
                    }
                  >
                    <View style={styles.mealRow}>
                        <View style={styles.mealInfo}>
                          <ThemedText style={styles.mealName}>
                            {meal.name}
                          </ThemedText>

                          <ThemedText style={styles.mealDetails}>
                            Portion: {meal.portion || 100}g
                          </ThemedText>
                          <ThemedText style={styles.mealDetails}>
                            {meal.calories || 0} kcal | {meal.protein || 0}g protein | {meal.carbs || 0}g carbs | {meal.fat || 0}g fat
                          </ThemedText>
                        </View>

                        <Pressable
                          style={styles.deleteButton}
                          onPress={() => quickDelete(meal.id)}
                        >
                          <ThemedText style={styles.deleteText}>
                            −
                          </ThemedText>
                        </Pressable>
                      </View>
                  </Pressable>
                ))
              ) : (
                <ThemedText>No meals logged yet.</ThemedText>
              )}
            </ThemedCard>
          )
        })}

        <ThemedCard style={styles.fullCard}>
          <ThemedText style={[styles.cardTitle, { color: "#024baa" }]}>
            Today’s Summary
          </ThemedText>

          <View style={styles.summaryRow}>
            <ThemedText>Total calories</ThemedText>
            <ThemedText> {totalCalories} / {calorieTarget || '—'} kcal</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText>Total protein</ThemedText>
            <ThemedText>{totalProtein.toFixed(1)} / {proteinTarget ? proteinTarget.toFixed(1) : '—'}g</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText>Total carbs</ThemedText>
            <ThemedText>{totalCarbs.toFixed(1)}g</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText>Total fat</ThemedText>
            <ThemedText>{totalFat.toFixed(1)}g</ThemedText>
          </View>
        </ThemedCard>

        <Spacer height={50} />
      </ScrollView>
    </ThemedView>
  )
}

export default Meals

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
  },

  sectionHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addText: {
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.8,
  },

  mealItem: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },

  mealName: {
    fontSize: 16,
    fontWeight: '700',
  },

  mealDetails: {
    fontSize: 14,
    opacity: 0.75,
    marginTop: 4,
  },

  summaryRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  sectionPressed: {
    opacity: 0.4,
  },

  mealPressed: {
    opacity: 0.4,
  },

  mealRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mealInfo: {
    flex: 1,
  },

  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  deleteText: {
    fontSize: 22,
    fontWeight: '700',
  },
  dateRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  dateArrow: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  dateText: {
    fontSize: 16,
    fontWeight: '700',
  },
})