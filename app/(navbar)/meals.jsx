import { StyleSheet, ScrollView, View, Pressable } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import { collection, getDocs, orderBy, query, doc, deleteDoc } from 'firebase/firestore'

import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'

const mealSections = ['Breakfast', 'Lunch', 'Dinner',  'Snacks']
const mealColours = {Breakfast: 'orange', Lunch: 'green', Dinner: '#800020', Snacks: 'purple',}

const Meals = () => {
  const router = useRouter()
  const { user } = useAuth()

  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const fetchMeals = async () => {
        if (!user) return

        try {
          setLoading(true)

          const mealsQuery = query(
            collection(db, 'users', user.uid, 'mealLogs'),
            orderBy('createdAt', 'desc')
          )

          const snapshot = await getDocs(mealsQuery)

          const mealData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          setMeals(mealData)
        } catch (error) {
          console.log('Error fetching meals:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchMeals()
    }, [user])
  )

  const today = new Date().toISOString().split('T')[0]

  const todayMeals = meals.filter((meal) => {
    return meal.date === today
  })

  const totalCalories = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.calories || 0)
  }, 0)

  const totalProtein = todayMeals.reduce((sum, meal) => {
    return sum + Number(meal.protein || 0)
  }, 0)

  const openMealLog = (mealType) => {
    router.push({
      pathname: '/(meals)/mealLog',
      params: {
        mealType,
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

  return (
    <ThemedView style={styles.container} safe={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText title={true} style={styles.title}>
          Meals
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
                            {meal.calories || 0} kcal • {meal.protein || 0}g protein
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
            <ThemedText>{totalCalories} kcal</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText>Total protein</ThemedText>
            <ThemedText>{totalProtein}g</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText>Water</ThemedText>
            <ThemedText>0 cups</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText>Macros</ThemedText>
            <ThemedText>Coming soon</ThemedText>
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
})