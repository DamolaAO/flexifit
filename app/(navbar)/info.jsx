import { StyleSheet } from 'react-native'
import React from 'react'

import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'

const info = () => {
  return (
    <ThemedView style={styles.container}>
        
      <ThemedText title={true} style={styles.title}>info</ThemedText>
      <Spacer />

    </ThemedView>
  )
}

export default info

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
  }
})