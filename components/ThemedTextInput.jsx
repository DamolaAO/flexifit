import { TextInput, useColorScheme } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'
import { Colours } from '../constants/Colours'

const ThemedTextInput = ({ style, ...props }) => {
    const colorScheme = useColorScheme()
    const theme = Colours[colorScheme] || Colours.light

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          borderColor: theme.border,
          padding: 20,
          borderRadius: 6,
        },
        style,
      ]}
      {...props}
    />
  )
}

export default ThemedTextInput
