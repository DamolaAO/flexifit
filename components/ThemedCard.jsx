import { View, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { Colours } from '../constants/Colours'

const ThemedCard = ({ style, ...props }) => {
    const colourScheme = useColorScheme() // Get the current color scheme
    const theme = Colours[colourScheme] ?? Colours.light // Fallback to light theme if scheme is not recognized

    return (
        <View 
            style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
            {...props}/>
    )
}

export default ThemedCard

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 16,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});