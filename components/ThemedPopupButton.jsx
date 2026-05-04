import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { Colours } from '../constants/Colours'

const ThemedPopupButton = ({ style, children, ...props }) => {
  const colourScheme = useColorScheme()
  const theme = Colours[colourScheme] ?? Colours.light

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.buttonBackground,
          borderColor: theme.buttonBorder,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  )
}

export default ThemedPopupButton

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
})