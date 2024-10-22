import React, { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, Container, Button, useColorModeValue } from '@chakra-ui/react'
import Header from '../components/Header'

interface Verse {
  number: number
  text: string
  translation: string
  surah: {
    number: number
    name: string
    englishName: string
  }
  viewedAt: string
}

interface HistoryProps {
  onSelectBackground: (background: string) => void;
}

export default function History({ onSelectBackground }: HistoryProps) {
  const [history, setHistory] = useState<Verse[]>([])

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('verseHistory') || '[]')
    setHistory(storedHistory)
  }, [])

  const removeFromHistory = (verse: Verse) => {
    const updatedHistory = history.filter(
      (item) => item.surah.number !== verse.surah.number || item.number !== verse.number
    )
    setHistory(updatedHistory)
    localStorage.setItem('verseHistory', JSON.stringify(updatedHistory))
  }

  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box minHeight="100vh" pt={["20", "24", "28"]}>
      <Header onSelectBackground={onSelectBackground} />
      <Container maxW="container.md" py={[8, 12, 16]}>
        <VStack spacing={[6, 8, 10]} textAlign="center">
          <Box
            bg="rgba(0, 0, 0, 0.6)"
            p={4}
            borderRadius="lg"
            width="full"
          >
            <Heading as="h1" size={["xl", "2xl", "3xl"]} color="white" mb={2}>
              Verse History
            </Heading>
            <Text fontSize={["md", "lg"]} color="white" opacity={0.8}>
              Your recently viewed verses
            </Text>
          </Box>
          {history.length > 0 ? (
            history.map((verse, index) => (
              <Box key={index} borderWidth={1} borderRadius="lg" p={4} bg={cardBg} w="100%" boxShadow="md">
                <Text fontSize="xl" fontWeight="bold" color={textColor}>{verse.surah.englishName} - Verse {verse.number}</Text>
                <Text fontSize="xl" fontStyle="italic" mb={2} color={textColor}>{verse.text}</Text>
                <Text fontSize="lg" mb={4} color={textColor}>{verse.translation}</Text>
                <Text fontSize="sm" mb={2} color={textColor}>Viewed on: {new Date(verse.viewedAt).toLocaleString()}</Text>
                <Button colorScheme="red" size="sm" onClick={() => removeFromHistory(verse)}>
                  Remove from History
                </Button>
              </Box>
            ))
          ) : (
            <Text color={textColor}>No verse history yet.</Text>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
