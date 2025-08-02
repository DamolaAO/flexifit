import { Pressable, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { Colours } from "../constants/Colours";

function ThemedButton({ style, ...props }) {
  const colourScheme = useColorScheme(); // Get the current color scheme
  const theme = Colours[colourScheme] ?? Colours.light; // Fallback to light theme

  return (
    <Pressable 
        style={({ pressed }) => [styles.btn, pressed && styles.pressed, 
        { backgroundColor: theme.navBackground }, style]} 
        {...props}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.25,
  },
});

export default ThemedButton;
