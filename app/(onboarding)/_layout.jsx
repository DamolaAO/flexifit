import React from 'react'
import { StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'
import { needsOnboarding } from '../../lib/onboarding'


const OnboardingLayout = () => {
    const { user } = useAuth()
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: false,
            }}
        />
    )
}

export default OnboardingLayout

const styles = StyleSheet.create({})