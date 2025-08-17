import { StyleSheet} from 'react-native'
import React from 'react'

import ThemedText from './ThemedText'
import ThemedView from './ThemedView'
import ThemedLogo from './ThemedLogo'
import ThemedActivityIndicator from './ThemedActivityIndicator'

const ThemedSplash = ({ style }) => {

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedLogo style={styles.logo} />
      <ThemedActivityIndicator />
    </ThemedView>
  )
}

export default ThemedSplash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  }
})