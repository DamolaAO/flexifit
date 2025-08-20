import React, { useRef, useEffect } from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import { useRouter } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'

const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);
const AnimatedThemedButton = Animated.createAnimatedComponent(ThemedButton);

const OnboardingIntro = () => {
    const router = useRouter()

    const fade1 = useRef(new Animated.Value(0)).current
    const fade2 = useRef(new Animated.Value(0)).current
    const fade3 = useRef(new Animated.Value(0)).current
    const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run animations in sequence with delays
    Animated.sequence([
      Animated.timing(fade1, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(fade2, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(fade3, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(btnFade, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true
      })
    ]).start();
  }, [fade1, fade2, fade3, btnFade])

    const handleStart = () => {
        router.replace('/(onboarding)/age')
    }

    return (
      <ThemedView style={styles.container}>
          <AnimatedThemedText title={ true } style={[{ opacity: fade1 }, styles.title]}>Welcome to FlexiFit</AnimatedThemedText>
          <Spacer />

          <AnimatedThemedText style={[{ textAlign: 'center', opacity: fade2 }, styles.subtitle]}> We'll collect some information to set up your profile.
          </AnimatedThemedText>
          <Spacer />

          <AnimatedThemedText style={[{ textAlign: 'center', opacity: fade3 }, styles.subtitle]}> This will help us tailor your experience to achieve your fitness goals.
          </AnimatedThemedText>
          <Spacer height={30} />

          <AnimatedThemedButton onPress={handleStart} style={{ opacity: btnFade }}>
              <ThemedText>Get Started</ThemedText>
          </AnimatedThemedButton>
      </ThemedView>
    )
}

export default OnboardingIntro

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#4b5563',
  }
})