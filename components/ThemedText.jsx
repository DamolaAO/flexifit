import { useColorScheme, Text } from 'react-native'
import { Colours } from '../constants/Colours'

const ThemedText = ({ style, title = false, ...props }) => {
    const colourScheme = useColorScheme() // Get the current color scheme
    const theme = Colours[colourScheme] ?? Colours.light // Fallback to light theme if scheme is not recognized

    const textColour = title ? theme.title : theme.text // Use title color for titles, text color for regular text
  return (
    <Text style={[{ color: textColour }, style]}{...props} />
  )
}

export default ThemedText