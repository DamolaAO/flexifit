import { Pressable, StyleSheet } from "react-native";
import { Colours } from "../constants/Colours";

function ThemedButton({ style, ...props }) {
  return (
    <Pressable 
        style={({ pressed }) => [styles.btn, pressed && styles.pressed, 
        style]} 
        {...props}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colours.dark.navBackground,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.25,
  },
});

export default ThemedButton;
