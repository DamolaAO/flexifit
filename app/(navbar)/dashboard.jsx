import { StyleSheet, ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'

import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

const Dashboard = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return

      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        setProfile(snap.data())
      }
    }

    loadProfile()
  }, [user])

  const name = profile?.name || 'there'

  return (
    <ThemedView style={styles.container} safe={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText title={true} style={styles.greeting}>
          Welcome back, {name}
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Here’s your health and fitness snapshot for today.
        </ThemedText>

        <Spacer size={20} />

        <View style={styles.grid}>
          <ThemedCard style={styles.smallCard}>
            <ThemedText style={styles.cardTitle}>Calories</ThemedText>
            <ThemedText style={styles.cardValue}>—</ThemedText>
            <ThemedText style={styles.cardSubtext}>Not logged yet</ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.smallCard}>
            <ThemedText style={styles.cardTitle}>Protein</ThemedText>
            <ThemedText style={styles.cardValue}>—</ThemedText>
            <ThemedText style={styles.cardSubtext}>Not logged yet</ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.smallCard}>
            <ThemedText style={styles.cardTitle}>Water</ThemedText>
            <ThemedText style={styles.cardValue}>—</ThemedText>
            <ThemedText style={styles.cardSubtext}>Not logged yet</ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.smallCard}>
            <ThemedText style={styles.cardTitle}>Steps</ThemedText>
            <ThemedText style={styles.cardValue}>—</ThemedText>
            <ThemedText style={styles.cardSubtext}>Not logged yet</ThemedText>
          </ThemedCard>
        </View>

        <Spacer size={16} />

        <ThemedCard style={styles.fullCard}>
          <ThemedText style={styles.cardTitle}>Today’s Workout</ThemedText>
          <ThemedText>No workout planned yet.</ThemedText>
        </ThemedCard>

        <ThemedCard style={styles.fullCard}>
          <ThemedText style={styles.cardTitle}>Meal Progress</ThemedText>
          <ThemedText>Breakfast: Pending</ThemedText>
          <ThemedText>Lunch: Pending</ThemedText>
          <ThemedText>Dinner: Pending</ThemedText>
        </ThemedCard>

        <ThemedCard style={styles.fullCard}>
          <ThemedText style={styles.cardTitle}>Weight Progress</ThemedText>
          <ThemedText>
            Current weight: {profile?.weight ? `${profile.weight} kg` : 'Not available'}
          </ThemedText>
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
})