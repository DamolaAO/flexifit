import { Pressable, StyleSheet } from "react-native"
import { useColorScheme } from "react-native"
import { Colours } from "../constants/Colours"

function ThemedButton({ style, ...props }) {
  const colourScheme = useColorScheme(); // Get the current color scheme
  const theme = Colours[colourScheme] ?? Colours.light; // Fallback to light theme

  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        {
          backgroundColor: theme.buttonBackground ?? 'rgba(255,255,255,0.08)',
          borderColor: theme.buttonBorder ?? 'rgba(255,255,255,0.18)',
        },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5
  },
  pressed: {
    opacity: 0.25,
  },
});

export default ThemedButton;
