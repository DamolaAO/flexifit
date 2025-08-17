import { StyleSheet, useColorScheme, ActivityIndicator} from 'react-native'
import { Colours } from '../constants/Colours'

import React from 'react'

const ThemedActivityIndicator = (style) => {
    const colourScheme = useColorScheme() // Get the current color scheme
    const theme = Colours[colourScheme] ?? Colours.light
  return (
    <ActivityIndicator size = "large" color={theme.iconColorFocused} style={style} />
  )
}

export default ThemedActivityIndicator

const styles = StyleSheet.create({})