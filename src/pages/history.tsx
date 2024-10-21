import { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, Container, Flex } from '@chakra-ui/react'
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

interface HistoryProps {
  onSelectBackground: (background: string) => void;
}

export default function History({ onSelectBackground }: HistoryProps) {
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
      <Header onSelectBackground={onSelectBackground} />
      <Flex direction="column" pt="24" height="calc(100vh - 6rem)">
        <Container maxW="container.md" py={4}>
          <Box
            bg="rgba(0, 0, 0, 0.6)"
            p={4}
            borderRadius="lg"
            width="full"
            mb={4}
          >
            <Heading as="h1" size="2xl" color="white">Verse History</Heading>
          </Box>
        </Container>
        <Box flex="1" overflowY="auto" pb={4}>
          <Container maxW="container.md">
            <VStack spacing={4} align="stretch">
              {verses.length > 0 ? (
                verses.map((verse, index) => (
                  <Box key={index} borderWidth={1} borderRadius="lg" p={4} bg="white">
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
          </Container>
        </Box>
      </Flex>
    </Box>
  )
}
