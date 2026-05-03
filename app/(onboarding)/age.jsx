// app/(onboarding)/dob.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Modal, FlatList, Pressable, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import Spacer from '../../components/Spacer';
import { useOnboarding } from '../../context/OnboardingContext';


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
            <Spacer size={8} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const OnboardingAge = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { editMode } = useLocalSearchParams();
  const isEditMode = editMode === 'true';

  const { onboardingData, updateOnboardingData } = useOnboarding()
  console.log('Onboarding Data:', onboardingData); // FOR DEBUGGING PURPOSES **** REMOVE 

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const months = useMemo(() => ([
    { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' }, { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' }, { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' },
  ]), []);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const start = 1900;
    return Array.from({ length: current - start + 1 }, (_, i) => {
      const y = current - i;
      return { value: y, label: String(y) };
    });
  }, []);

  const [year, setYear] = useState(onboardingData.dobYear);
  const [month, setMonth] = useState(onboardingData.dobMonth);
  const daysInMonth = useMemo(() => {
    if (!year || !month) return 31;
    // day 0 of next month = last day of current month
    return new Date(year, month, 0).getDate();
  }, [year, month]);

  const dayOptions = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: String(i + 1) })),
    [daysInMonth]
  );

  const [day, setDay] = useState(onboardingData.dobDay);

  // If month/year change and the selected day is now invalid and clamp it.
  useEffect(() => {
    if (day && daysInMonth && day > daysInMonth) setDay(daysInMonth);
  }, [daysInMonth, day]);

  const isComplete = !!day && !!month && !!year;

  const onContinue = () => {
    if (!isComplete) {
      Alert.alert(
        'Missing details',
        'Please enter your date of birth.'
      )
      return
    }

  const dob = new Date(year, month - 1, day);

  const today = new Date();
  let calculatedAge = today.getFullYear() - year;

  const hasBirthdayPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasBirthdayPassed) {
    calculatedAge--;
  }

  updateOnboardingData({
    dob: dob.toISOString(),
    dobDay: day,
    dobMonth: month,
    dobYear: year,
    age: calculatedAge,
  });

  router.push(isEditMode ? '/(onboarding)/review' : '/(onboarding)/body');
};

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Enter your date of birth
      </ThemedText>

      <Spacer size={24} />

      <View style={styles.row}>
        <DropdownSelect
          value={day}
          onChange={setDay}
          options={dayOptions}
          placeholder="Day"
          width={100}
          testID="dd-day"
        />
        <DropdownSelect
          value={month}
          onChange={setMonth}
          options={months}
          placeholder="Mon"
          width={120}
          testID="dd-month"
        />
        <DropdownSelect
          value={year}
          onChange={setYear}
          options={years}
          placeholder="Year"
          width={140}
          testID="dd-year"
        />
      </View>

      <Spacer size={30} />
      <ThemedButton onPress={onContinue}>
        <ThemedText>{isEditMode ? "Save Changes" : "Continue"}</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
};

export default OnboardingAge;

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
