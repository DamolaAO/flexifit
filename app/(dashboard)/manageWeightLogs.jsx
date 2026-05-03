import { StyleSheet, Alert, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from 'expo-router'
import { collection, doc, getDocs, query, orderBy, limit, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

const ManageWeightLogs = () => {
  const { user } = useAuth()
  const navigation = useNavigation()
  const [logs, setLogs] = useState([])

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Manage Weight Logs',
        headerBackTitle: 'Dashboard',
        headerBackTitleStyle: { fontSize: 14 },
        headerTitleStyle: { fontSize: 20 }
      })

      loadLogs()
    }, [user])
  )

  const loadLogs = async () => {
    if (!user) return

    const q = query(
      collection(db, 'users', user.uid, 'weightLogs'),
      orderBy('createdAt', 'desc'),
      limit(5)
    )

    const snap = await getDocs(q)

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))

    setLogs(data)
  }

  const deleteLog = async (logId) => {
    if (!user) return

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'weightLogs', logId))

      const remaining = logs.filter((log) => log.id !== logId)

      if (remaining.length > 0) {
        await updateDoc(doc(db, 'users', user.uid), {
          weight: remaining[0].weight,
          updatedAt: serverTimestamp(),
        })
      }

      setLogs(remaining)

      Alert.alert('Deleted', 'Weight log removed.')
    } catch (error) {
      console.log('Error deleting weight log:', error)
      Alert.alert('Error', 'Could not delete this weight log.')
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Manage weight logs
        </ThemedText>

        <Spacer size={20} />

        {logs.length > 0 ? (
          logs.map((log) => (
            <ThemedCard key={log.id} style={styles.card}>
              <ThemedText style={styles.weight}>{log.weight} kg</ThemedText>
              <ThemedText style={styles.date}>{log.date}</ThemedText>

              <Spacer size={12} />

              <ThemedButton
                onPress={() => deleteLog(log.id)}
                style={styles.deleteButton}
              >
                <ThemedText>Delete</ThemedText>
              </ThemedButton>
            </ThemedCard>
          ))
        ) : (
          <ThemedText>No recent weight logs found.</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  )
}

export default ManageWeightLogs

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    margin: 0,
    marginBottom: 12,
    padding: 16,
  },
  weight: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 15,
    opacity: 0.7,
    marginTop: 4,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    opacity: 0.8,
  },
})