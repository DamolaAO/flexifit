import { StyleSheet, ScrollView, Alert, View, Modal, FlatList, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router'

import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'

const DropdownSelect = ({ label, 
    value, 
    onChange, 
    options, 
    placeholder = 'Select…', 
    width }) => {
    const [open, setOpen] = useState(false)

    const close = () => setOpen(false)
    const select = (v) => {
        onChange(v)
        close()
    }

    return (
        <View style={[styles.dropdownWrap, width ? { width } : null]}>
        {!!label && <ThemedText type="label" style={styles.ddLabel}>{label}</ThemedText>}

        <Pressable style={styles.ddBox} onPress={() => setOpen(true)}>
            <ThemedText numberOfLines={1} style={styles.ddValue}>
            {options.find(o => o.value === value)?.label ?? placeholder}
            </ThemedText>
        </Pressable>

        <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
            <Pressable style={styles.backdrop} onPress={close}>
            <Pressable style={styles.popup} onPress={() => {}}>
                <ThemedText type="subtitle" style={styles.sheetTitle}>{label ?? 'Choose'}</ThemedText>

                <FlatList
                    data={options}
                    keyExtractor={(item) => String(item.value)}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.itemRow} onPress={() => select(item.value)}>
                        <ThemedText style={styles.itemText}>{item.label}</ThemedText>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />

                <Spacer height={8} />
            </Pressable>
            </Pressable>
        </Modal>
        </View>
    )
}

const MealLog = () => {
    const navigation = useNavigation()
    const { user } = useAuth()
    const { mealType: selectedMealType, mealId, foodName, calories: foodCalories, protein: foodProtein, carbs: foodCarbs, fat: foodFat } = useLocalSearchParams()
    const router = useRouter()

    const [mealName, setMealName] = useState('')
    const [calories, setCalories] = useState('')
    const [protein, setProtein] = useState('')
    const [carbs, setCarbs] = useState('')
    const [fat, setFat] = useState('')
    const [mealType, setMealType] = useState(selectedMealType || '')
    const [loading, setLoading] = useState(false)

    const mealTypeOptions = [
        { value: 'Breakfast', label: 'Breakfast' },
        { value: 'Lunch', label: 'Lunch' },
        { value: 'Dinner', label: 'Dinner' },
        { value: 'Snacks', label: 'Snacks' },
    ]

    const isEditing = !!mealId

    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Meal' : 'Meal Log',
            headerBackTitle: 'Meals',
            headerBackTitleStyle: { fontSize: 14 },
            headerTitleStyle: { fontSize: 20 },
        })
    }, [navigation, isEditing])

    useEffect(() => {
        if (foodName) {
            setMealName(foodName)
            setCalories(foodCalories || '')
            setProtein(foodProtein || '')
            setCarbs(foodCarbs || '')
            setFat(foodFat || '')
        }
        }, [foodName, foodCalories, foodProtein, foodCarbs, foodFat])

    useEffect(() => {
        const fetchMeal = async () => {
            if (!user || !mealId) return

            try {
                setLoading(true)

                const mealRef = doc(db, 'users', user.uid, 'mealLogs', mealId)
                const mealSnap = await getDoc(mealRef)

                if (mealSnap.exists()) {
                    const mealData = mealSnap.data()

                    setMealName(mealData.name || '')
                    setMealType(mealData.mealType || '')
                    setCalories(String(mealData.calories || ''))
                    setProtein(String(mealData.protein || ''))
                }
            } catch (error) {
                Alert.alert('Load failed', 'Could not load meal.')
            } finally {
                setLoading(false)
            }
        }

        fetchMeal()
    }, [user, mealId])

    const saveMeal = async () => {
        if (!user) return

        if (!mealName.trim()) {
            Alert.alert('Missing meal name', 'Please enter a meal name.')
            return
        }

        try {
            if (isEditing) {
                const mealRef = doc(db, 'users', user.uid, 'mealLogs', mealId)

                await updateDoc(mealRef, {
                    name: mealName.trim(),
                    mealType: mealType.trim() || 'Meal',
                    calories: Number(calories) || 0,
                    protein: Number(protein) || 0,
                })
            } else {
                await addDoc(collection(db, 'users', user.uid, 'mealLogs'), {
                    name: mealName.trim(),
                    mealType: mealType.trim() || 'Meal',
                    calories: Number(calories) || 0,
                    protein: Number(protein) || 0,
                    date: new Date().toISOString().split('T')[0],
                    createdAt: serverTimestamp(),
                })
            }

        navigation.goBack()
        } catch (error) {
            Alert.alert('Save failed', 'Could not save meal.')
        }
    }

    const deleteMeal = () => {
        Alert.alert('Delete meal', 'Are you sure you want to delete this meal?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: confirmDeleteMeal },
        ])
    }

    const confirmDeleteMeal = async () => {
        if (!user || !mealId) return

        try {
            const mealRef = doc(db, 'users', user.uid, 'mealLogs', mealId)

            await deleteDoc(mealRef)

            navigation.goBack()
        } catch (error) {
            Alert.alert('Delete failed', 'Could not delete meal.')
        }
    }

    return (
        <ThemedView style={styles.container} safe={true}>
            <ScrollView contentContainerStyle={styles.content}>
                <ThemedText title={true} style={styles.title}>
                {isEditing ? 'Edit Meal' : 'Add Meal'}
                </ThemedText>

                <ThemedText style={styles.subtitle}>
                    Log your meal name, calories, protein and meal type.
                </ThemedText>

                <Spacer height={20} />

                <ThemedCard style={styles.fullCard}>
                    {loading ? (
                    <ThemedText>Loading meal...</ThemedText>
                    ) : (
                        <>
                        <ThemedButton onPress={() => router.push({ pathname: '/(meals)/foodSearch', params: { mealType } })}>
                        <ThemedText>Search Food</ThemedText>
                        </ThemedButton>
                        <Spacer height={16} />
                        <ThemedText>Meal Name</ThemedText>
                        <ThemedTextInput placeholder="Chicken wrap" value={mealName} onChangeText={setMealName} />

                        <Spacer height={12} />

                        <DropdownSelect
                            label="Meal Type"
                            value={mealType}
                            onChange={setMealType}
                            options={mealTypeOptions}
                            placeholder="Select meal type"
                            width="100%"
                        />

                        <Spacer height={12} />

                        <ThemedText>Calories</ThemedText>
                        <ThemedTextInput
                            placeholder="540"
                            keyboardType="numeric"
                            value={calories}
                            onChangeText={(text) => setCalories(text.replace(/[^0-9]/g, ''))}
                        />

                        <Spacer height={12} />

                        <ThemedText>Protein (g)</ThemedText>
                        <ThemedTextInput
                            placeholder="42"
                            keyboardType="numeric"
                            value={protein}
                            onChangeText={(text) => setProtein(text.replace(/[^0-9]/g, ''))}
                        />

                        <Spacer height={20} />

                        <ThemedButton onPress={saveMeal}>
                            <ThemedText>{isEditing ? 'Update Meal' : 'Save Meal'}</ThemedText>
                        </ThemedButton>

                        {isEditing && (
                            <>
                            <Spacer height={12} />

                            <ThemedButton onPress={deleteMeal}>
                                <ThemedText>Delete Meal</ThemedText>
                            </ThemedButton>
                            </>
                        )}
                        </>
                    )}
                </ThemedCard>
            </ScrollView>
        </ThemedView>
    )
}

export default MealLog

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 20,
        alignItems: 'center',
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.75,
        marginTop: 8,
    },

    fullCard: {
        width: '100%',
        marginBottom: 12,
    },

    dropdownWrap: {
        width: '100%',
    },

    ddLabel: {
        marginBottom: 6,
    },

    ddBox: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },

    ddValue: {
        fontSize: 16,
    },

    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        padding: 24,
    },

    popup: {
        width: 220,
        maxHeight: 400,
        borderRadius: 12,
        paddingVertical: 8,
        backgroundColor: 'white',
        alignSelf: 'center',
    },

    sheetTitle: {
        textAlign: 'center',
        marginBottom: 8,
    },

    itemRow: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        minHeight: 40,
        justifyContent: 'center',
    },

    itemText: {
        fontSize: 16,
    },

    separator: {
        height: StyleSheet.hairlineWidth,
        opacity: 0.25,
    },
})