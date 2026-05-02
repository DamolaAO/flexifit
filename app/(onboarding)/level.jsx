import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OnboardingFitnessLevel = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Enter your date of birth
      </ThemedText>

      <Spacer size={24} />

      
      <Spacer size={30} />
      <ThemedButton onPress={onContinue} disabled={!isComplete}>
        <ThemedText>Continue</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

export default OnboardingFitnessLevel

const styles = StyleSheet.create({})