import { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, Container, Button } from '@chakra-ui/react'
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
  date: string
}

interface FavoritesProps {
  onSelectBackground: (background: string) => void;
}

export default function Favorites({ onSelectBackground }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Verse[]>([])

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(storedFavorites)
  }, [])

  const removeFavorite = (verse: Verse) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.surah.number !== verse.surah.number || fav.number !== verse.number
    )
    setFavorites(updatedFavorites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  return (
    <Box minHeight="100vh" pt="24">
      <Header onSelectBackground={onSelectBackground} />
      <Container maxW="container.md" py={12}>
        <VStack spacing={8} textAlign="center">
          <Box
            bg="rgba(0, 0, 0, 0.6)"
            p={4}
            borderRadius="lg"
            width="full"
          >
            <Heading as="h1" size="2xl" color="white">Favorite Verses</Heading>
          </Box>
          {favorites.length > 0 ? (
            favorites.map((verse, index) => (
              <Box key={index} borderWidth={1} borderRadius="lg" p={4} bg="white" w="100%">
                <Text fontSize="xl" fontWeight="bold">{verse.surah.englishName} - Verse {verse.number}</Text>
                <Text fontSize="xl" fontStyle="italic" mb={2}>{verse.text}</Text>
                <Text fontSize="lg" mb={4}>{verse.translation}</Text>
                <Button colorScheme="red" size="sm" onClick={() => removeFavorite(verse)}>
                  Remove from Favorites
                </Button>
              </Box>
            ))
          ) : (
            <Text>No favorite verses yet.</Text>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
