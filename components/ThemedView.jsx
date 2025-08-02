import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Colours } from '../constants/Colours'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ThemedView = ({ style, safe = false, ...props }) => {
    const colourScheme = useColorScheme() // Get the current color scheme
    const theme = Colours[colourScheme] ?? Colours.light // Fallback to light theme if scheme is not recognized

    if (!safe) return (
        <View 
            style={[{ backgroundColor: theme.background }, style]}
            {...props}/>
    )

    const insets = useSafeAreaInsets(); // Get safe area insets if needed

    return (
        <View 
            style={[{ 
                backgroundColor: theme.background,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }, style]}
            {...props}/>
    )
}

export default ThemedView