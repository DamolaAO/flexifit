import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Colours } from '../constants/Colours'

const ThemedView = ({ style, ...props }) => {
    const colourScheme = useColorScheme() // Get the current color scheme
    const theme = Colours[colourScheme] ?? Colours.light // Fallback to light theme if scheme is not recognized
    return (
        <View 
            style={[{ backgroundColor: theme.background }, style]}
            {...props}/>
    )
}

export default ThemedView