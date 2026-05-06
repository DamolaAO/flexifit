import { useMemo, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, useColorScheme, View } from 'react-native'

import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import ThemedTextInput from '../../components/ThemedTextInput'
import Spacer from '../../components/Spacer'
import { Colours } from '../../constants/Colours'
import { fitnessBotKnowledge } from '../../data/fitnessBotKnowledge'
import { fitnessFacts, fitnessRules } from '../../data/fitnessLogicKnowledge'

const normalisationMap = {
  skuat: 'squat',
  dumbell: 'dumbbell',
  dumbel: 'dumbbell',
  dumbbel: 'dumbbell',
  barbel: 'barbell',
  excercise: 'exercise',
  excersise: 'exercise',
  exsercise: 'exercise',
  ekercise: 'exercise',
  'weight lifting': 'weightlifting',
  'push up': 'pushup',
  'pull up': 'pullup',
  'leg press': 'legpress',
  'bicep curl': 'bicepcurl',
}

const quickPrompts = [
  'What is a squat?',
  'How long should I rest between sets?',
  'What does a push up work?',
  'How can I train my chest?',
]

const cleanText = (text = '') => {
  let cleaned = String(text).toLowerCase().trim()

  Object.entries(normalisationMap).forEach(([wrong, correct]) => {
    cleaned = cleaned.replaceAll(wrong, correct)
  })

  return cleaned
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .join(' ')
}

const getSimilarityScore = (userQuestion, storedQuestion) => {
  const userWords = new Set(cleanText(userQuestion).split(' '))
  const storedWords = new Set(cleanText(storedQuestion).split(' '))

  if (!userWords.size || !storedWords.size) return 0

  const matchingWords = [...userWords].filter((word) => storedWords.has(word)).length
  const totalUniqueWords = new Set([...userWords, ...storedWords]).size

  return matchingWords / totalUniqueWords
}
const normaliseLogicWord = (word = '') => {
  return String(word)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

const checkLogicQuery = (userInput = '') => {
  const cleaned = String(userInput).toLowerCase().trim()

  const match = cleaned.match(/check that (.+?) is (.+)/)

  if (!match) return null

  const item = normaliseLogicWord(match[1])
  const category = normaliseLogicWord(match[2])

  const directMatch = Object.entries(fitnessFacts).some(([factCategory, items]) =>
    normaliseLogicWord(factCategory) === category &&
    items.some((factItem) => normaliseLogicWord(factItem) === item)
  )

  if (directMatch) {
    return `Yes, ${match[1]} is ${match[2]}.`
  }

  const inferredMatch = Object.entries(fitnessFacts).some(([factCategory, items]) => {
    const itemExists = items.some(
      (factItem) => normaliseLogicWord(factItem) === item
    )

    const inferredRules = fitnessRules[factCategory] || []

    return itemExists && inferredRules.some(
      (rule) => normaliseLogicWord(rule) === category
    )
  })

  if (inferredMatch) {
    return `Yes, I can infer that ${match[1]} is ${match[2]}.`
  }

  return `No, I cannot prove that ${match[1]} is ${match[2]}.`
}

const getBotReply = (userInput) => {
  const logicReply = checkLogicQuery(userInput)

  if (logicReply) {
    return logicReply
  }
  const cleanedInput = cleanText(userInput)

  if (!cleanedInput) return 'Type a fitness question and I will try to help.'

  const exactMatch = fitnessBotKnowledge.find(
    (item) =>
      item.keywords.some((keyword) =>
        cleanedInput.includes(cleanText(keyword))
      )
  )

  if (exactMatch) return exactMatch.response

  let bestMatch = null
  let bestScore = 0

  fitnessBotKnowledge.forEach((item) => {
    const score = Math.max(
    ...item.keywords.map((keyword) =>
      getSimilarityScore(cleanedInput, keyword)
    )
  )

    if (score > bestScore) {
      bestScore = score
      bestMatch = item
    }
  })

  if (bestMatch && bestScore >= 0.2) return bestMatch.response

  return "I don't know that one yet. Try asking about exercises, muscles, gym equipment, rest times, or beginner training advice."
}

const Chatbot = () => {
  const colourScheme = useColorScheme()
  const theme = Colours[colourScheme] ?? Colours.light
  const listRef = useRef(null)

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'bot-welcome',
      sender: 'bot',
      text: "Hi, I'm your FlexiFit assistant. Ask me about exercises, equipment, muscles, or training basics.",
    },
  ])

  const styles = useMemo(() => createStyles(theme), [theme])

  const sendMessage = (textToSend = input) => {
    const trimmedText = textToSend.trim()
    if (!trimmedText) return

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmedText,
    }

    const botMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: getBotReply(trimmedText),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage, botMessage])
    setInput('')

    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user'

    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <ThemedText style={[styles.messageText, isUser && styles.userMessageText]}>
          {item.text}
        </ThemedText>
      </View>
    )
  }

  return (
    <ThemedView style={styles.container} safe={true}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ThemedText title={true} style={styles.title}>Chatbot</ThemedText>
        <ThemedText style={styles.subtitle}>Talk to your personal fitness assistant</ThemedText>

        <Spacer height={14} />

        <ThemedCard style={styles.chatCard}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />
        </ThemedCard>

        <View style={styles.promptRow}>
          {quickPrompts.map((prompt) => (
            <Pressable
              key={prompt}
              style={({ pressed }) => [styles.promptChip, pressed && styles.pressed]}
              onPress={() => sendMessage(prompt)}
            >
              <ThemedText style={styles.promptText}>{prompt}</ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.inputRow}>
          <ThemedTextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask a fitness question..."
            placeholderTextColor={theme.mutedText ?? '#9ca3af'}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />

          <Pressable
            style={({ pressed }) => [styles.sendButton, pressed && styles.pressed]}
            onPress={() => sendMessage()}
          >
            <ThemedText style={styles.sendText}>Send</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default Chatbot

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  keyboardView: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.75,
  },
  chatCard: {
    flex: 1,
    marginHorizontal: 0,
    marginVertical: 0,
    padding: 12,
  },
  messageList: {
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 5,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border ?? 'rgba(255,255,255,0.12)',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: theme.buttonBackground ?? '#2563eb',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#ffffff',
  },
  promptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 10,
  },
  promptChip: {
    borderWidth: 1,
    borderColor: theme.border ?? 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.uiBackground,
  },
  promptText: {
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  sendButton: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.buttonBackground ?? '#2563eb',
    borderWidth: 1,
    borderColor: theme.buttonBorder ?? 'rgba(255,255,255,0.18)',
  },
  sendText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.45,
  },
})
