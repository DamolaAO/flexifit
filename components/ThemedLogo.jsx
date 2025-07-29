import { StyleSheet, Image, useColorScheme, View } from 'react-native'
import React from 'react'

import DarkLogo from '../assets/img/flexifit dark logo.png'
import LightLogo from '../assets/img/flexifit light logo.png'

const ThemedLogo = ({...props}) => {
    const colourScheme = useColorScheme() // Get the current color scheme
    const logo = colourScheme === 'dark' ? DarkLogo : LightLogo // Choose logo based on color scheme
  return (
    <Image source={logo} {...props} />
  )
}

export default ThemedLogo

const styles = StyleSheet.create({})