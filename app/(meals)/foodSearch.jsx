import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

const FoodSearch = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const { mealType } = useLocalSearchParams()

    const [search, setSearch] = useState('')
    const [foods, setFoods] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        navigation.setOptions({
            title: 'Food Search',
            headerBackTitle: 'Meal Log',
            headerBackTitleStyle: { fontSize: 14 },
            headerTitleStyle: { fontSize: 20 },
        })
    }, [navigation])

    const searchFoods = async () => {
        if (!search.trim()) return
        if (loading) return

        try {
            setLoading(true)

            const url = `https://uk.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(search)}&search_simple=1&action=process&json=1&page_size=40&fields=product_name,brands,nutriments`

            const response = await fetch(url, {
            headers: {
                Accept: 'application/json',
            },
            })

            const responseText = await response.text()

            if (response.status === 503) {
                setFoods([])

                Alert.alert("The food database is busy right now. Please wait a moment and try again.")

                return
            }

            if (!responseText.trim().startsWith('{')) {
                setFoods([])
                return
            }

            const data = JSON.parse(responseText)

            setFoods(data.products || [])
        } catch (error) {
            console.log("Food search error:", error)
        } finally {
            setLoading(false)
        }
    }

    const selectFood = (food) => {
        router.push({
            pathname: '/(meals)/mealLog',
            params: {
                mealType,
                foodName: food.product_name || '',
                calories: String(food.nutriments?.['energy-kcal_100g'] || 0),
                protein: String(food.nutriments?.proteins_100g || 0),
                carbs: String(food.nutriments?.carbohydrates_100g || 0),
                fat: String(food.nutriments?.fat_100g || 0),
            },
        })
    }

    return (
        <ThemedView style={styles.container} safe={true}>
        <ScrollView contentContainerStyle={styles.content}>
            <ThemedText title={true} style={styles.title}>
            Food Search
            </ThemedText>

            <ThemedText style={styles.subtitle}>
            Search UK foods and add nutrition values to your meal log.
            </ThemedText>

            <Spacer height={20} />

            <ThemedCard style={styles.fullCard}>
            <ThemedTextInput
                placeholder="Search food..."
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={searchFoods}
            />

            <Spacer height={12} />

            <ThemedButton onPress={searchFoods}>
                <ThemedText>Search</ThemedText>
            </ThemedButton>
            </ThemedCard>

            {loading && (
            <ThemedText>Searching...</ThemedText>
            )}

            {!loading && foods.length === 0 && (
            <ThemedText>No foods found yet.</ThemedText>
            )}

            {foods.map((food, index) => (
            <ThemedCard key={index} style={styles.fullCard}>
                <Pressable onPress={() => selectFood(food)}>
                <ThemedText style={styles.foodName}>
                    {food.product_name || 'Unnamed product'}
                </ThemedText>

                <ThemedText style={styles.foodDetails}>
                    {food.nutriments?.['energy-kcal_100g'] || 0} kcal | {food.nutriments?.proteins_100g || 0}g protein | {food.nutriments?.carbohydrates_100g || 0}g carbs | {food.nutriments?.fat_100g || 0}g fat
                </ThemedText>
                </Pressable>
            </ThemedCard>
            ))}

            <Spacer height={100} />
        </ScrollView>
        </ThemedView>
    )
}

export default FoodSearch

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

    foodName: {
        fontSize: 16,
        fontWeight: '700',
    },

    foodDetails: {
        fontSize: 14,
        opacity: 0.75,
        marginTop: 4,
    },
})