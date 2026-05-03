import React, { createContext, useContext, useState } from 'react'

const OnboardingContext = createContext(null)

export function OnboardingProvider({ children }) {
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    dob: '',
    dobDay: null,
    dobMonth: null,
    dobYear: null,
    age: '',
    height: '',
    weight: '',
    fitnessLevel: '',
    fitnessGoal: [],
  })

  const updateOnboardingData = (newData) => {
    setOnboardingData((prev) => ({
      ...prev,
      ...newData,
    }))
  }

  const resetOnboardingData = () => {
    setOnboardingData({
      name: '',
      dob: '',
      dobDay: null,
      dobMonth: null,
      dobYear: null,
      age: '',
      height: '',
      weight: '',
      fitnessLevel: '',
      fitnessGoal: [],
    })
  }

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        resetOnboardingData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)

  if (!context) {
    throw new Error('useOnboarding must be used inside OnboardingProvider')
  }

  return context
}

export default OnboardingProvider