import { Tabs } from 'expo-router'
import React from 'react'
import ThemedText from '../../components/ThemedText'
import { Colours } from '../../constants/Colours' // Colours.js file for color constants
import { useColorScheme } from 'react-native'
import { icon } from 'react-native-vector-icons/Ionicons'
import Octicons from '@expo/vector-icons/Octicons';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const NavbarLayout = () => {
  const colourScheme = useColorScheme() // or 'light', depending on your preference
  const theme = Colours[colourScheme] ?? Colours.light // Fallback to light theme if scheme is not recognized

  return (

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
            backgroundColor: theme.navBackground,
            borderTopColor: theme.navBackground,
            paddingTop: 10,
            paddingBottom: 30,
            paddingHorizontal: 20,
            height: 80,
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor,
      }}
    >
      <Tabs.Screen 
      name="meals" 
      options={{ 
        title: 'Meals', 
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons name="food-turkey" 
          color={focused ? theme.iconColorFocused : theme.iconColor}
          size={34} />
        )
      }}
      />

      <Tabs.Screen 
      name="fitness" 
      options={{ 
        title: 'Fitness', 
        tabBarIcon: ({ focused}) => (
          <FontAwesome6 name="dumbbell" 
          color={focused ? theme.iconColorFocused : theme.iconColor}
          size={24} />
        )
      }}
      />

      <Tabs.Screen 
      name="dashboard" 
      options={{ 
        title: 'Dashboard',
        tabBarIcon: ({ focused }) => (
          <Octicons name="graph"
            color={focused ? theme.iconColorFocused : theme.iconColor}
            size={24} />
        )
      }}
      />

      <Tabs.Screen 
      name="chatbot" 
      options={{ 
        title: 'Chatbot', 
        tabBarIcon: ({ focused }) => (
          <MaterialCommunityIcons name={focused ? "robot-happy" : "robot-happy-outline"} 
          color={focused ? theme.iconColorFocused : theme.iconColor} 
          size={24} />
        ) 
      }} 
      />

      <Tabs.Screen 
      name="info" 
      options={{ 
        title: 'Info', 
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? "information-circle" : "information-circle-outline"}
          color={focused ? theme.iconColorFocused : theme.iconColor}
          size={28} />
        ) 
      }} 
      />

    </Tabs>

  )
}

export default NavbarLayout