import React, { useEffect, useMemo, useState } from 'react'
import { View, StyleSheet, Modal, FlatList, Pressable, TouchableOpacity, Alert } from 'react-native'
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import { useOnboarding } from '../../context/OnboardingContext'

const DropdownSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  width,
  testID
}) => {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const select = (v) => { onChange(v); close(); };

  return (
    <View style={[styles.dropdownWrap, width ? { width } : null]} testID={testID}>
      {!!label && <ThemedText type="label" style={styles.ddLabel}>{label}</ThemedText>}

      <Pressable style={styles.ddBox} onPress={() => setOpen(true)}>
        <ThemedText numberOfLines={1} style={styles.ddValue}>
          {options.find(o => o.value === value)?.label ?? placeholder}
        </ThemedText>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={styles.popup} onPress={() => { /* eat taps */ }}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>{label ?? 'Choose'}</ThemedText>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.itemRow} onPress={() => select(item.value)}>
                  <ThemedText style={styles.itemText}>{item.label}</ThemedText>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              initialNumToRender={30}
              getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
            />
            <Spacer height={8} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const OnboardingLevel = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const { editMode } = useLocalSearchParams();
  const isEditMode = editMode === 'true';

  const { onboardingData, updateOnboardingData } = useOnboarding()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const fitnessLevels = useMemo(() => ([
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ]), [])

  const [fitnessLevel, setFitnessLevel] = useState(onboardingData.fitnessLevel)

  const isComplete = !!fitnessLevel

  const onContinue = () => {
    if (!isComplete) {
      Alert.alert(
        'Missing details',
        'Please select your fitness level.'
      )
      return
    }

    updateOnboardingData({
      fitnessLevel,
    })

    router.push(isEditMode ? '/(onboarding)/review' : '/(onboarding)/goal')
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        What is your fitness level?
      </ThemedText>

      <Spacer height={24} />

      <View style={styles.row}>
        <DropdownSelect
          value={fitnessLevel}
          onChange={setFitnessLevel}
          options={fitnessLevels}
          placeholder="Level"
          width={220}
          testID="dd-level"
        />
        </View>

      <Spacer height={30} />

      <ThemedButton style={{alignSelf: 'center'}} onPress={onContinue}>
        <ThemedText>{isEditMode ? "Save Changes" : "Continue"}</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

export default OnboardingLevel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },

  dropdownWrap: { flexGrow: 0, flexShrink: 0 },
  ddLabel: { marginBottom: 6 },
  ddBox: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  ddValue: { fontSize: 16 },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  popup: {
  maxHeight: 400,
  width: 160,
  borderRadius: 12,
  paddingVertical: 8,
  backgroundColor: 'white',
  alignSelf: 'center',
},
  sheetTitle: { textAlign: 'center', marginBottom: 8 },

  itemRow: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  minHeight: 40,
  justifyContent: 'center',
},
  itemText: { fontSize: 16 },
  sep: { height: StyleSheet.hairlineWidth, opacity: 0.25 },
});
