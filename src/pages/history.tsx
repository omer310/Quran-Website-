import { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react'
import Header from '../components/Header'
import axios from 'axios'

interface Verse {
  number: number
  text: string
  translation: string
  surah: {
    number: number
    name: string
    englishName: string
  }
  date: string
}

export default function History() {
  const [verses, setVerses] = useState<Verse[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/verses/history');
        setVerses(response.data);
      } catch (error) {
        console.error('Error fetching verse history:', error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Box minHeight="100vh">
      <Header />
      <VStack spacing={8} textAlign="center" p={8}>
        <Heading as="h1" size="2xl">Verse History</Heading>
        {verses.length > 0 ? (
          verses.map((verse, index) => (
            <Box key={index} borderWidth={1} borderRadius="lg" p={4}>
              <Text fontSize="xl" fontWeight="bold">{verse.surah.englishName} - Verse {verse.number}</Text>
              <Text fontSize="md" mb={2}>{verse.date}</Text>
              <Text fontSize="xl" fontStyle="italic">{verse.text}</Text>
              <Text fontSize="lg">{verse.translation}</Text>
            </Box>
          ))
        ) : (
          <Text>No verses in history yet.</Text>
        )}
      </VStack>
    </Box>
  )
}