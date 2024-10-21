import { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, Button, useToast, IconButton } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import axios from 'axios'
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

export default function Home() {
  const [verse, setVerse] = useState<Verse | null>(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchVerse();
  }, []);

  const fetchVerse = async () => {
    setLoading(true);
    console.log('Fetching new verse...');
    try {
      const response = await axios.get('http://localhost:5000/api/verses/random');
      console.log('Received response:', response.data);
      setVerse(response.data);
      // Force a re-render by updating a state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching verse:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch verse. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const shareVerse = () => {
    if (verse) {
      const shareText = `Quran ${verse.surah.englishName} ${verse.number}: ${verse.translation}`
      if (navigator.share) {
        navigator.share({
          title: 'Quran Verse of the Day',
          text: shareText,
          url: window.location.href,
        })
      } else {
        navigator.clipboard.writeText(shareText)
        toast({
          title: 'Copied to clipboard',
          status: 'success',
          duration: 2000,
        })
      }
    }
  }

  const toggleFavorite = () => {
    if (verse) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      if (isFavorite) {
        const updatedFavorites = favorites.filter((fav: Verse) => 
          fav.surah.number !== verse.surah.number || fav.number !== verse.number
        )
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
        setIsFavorite(false)
        toast({
          title: 'Removed from favorites',
          status: 'info',
          duration: 2000,
        })
      } else {
        localStorage.setItem('favorites', JSON.stringify([...favorites, verse]))
        setIsFavorite(true)
        toast({
          title: 'Added to favorites',
          status: 'success',
          duration: 2000,
        })
      }
    }
  }

  useEffect(() => {
    if (verse) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorite(favorites.some((fav: Verse) => 
        fav.surah.number === verse.surah.number && fav.number === verse.number
      ))
    }
  }, [verse])

  return (
    <Box minHeight="100vh">
      <Header />
      <VStack spacing={8} textAlign="center" p={8}>
        <Heading as="h1" size="2xl">Quran Verse of the Day</Heading>
        {loading ? (
          <Text>Loading...</Text>
        ) : verse ? (
          <>
            <Text fontSize="xl" fontWeight="bold">{verse.surah.englishName} - Verse {verse.number}</Text>
            <Text fontSize="2xl" fontStyle="italic">{verse.text}</Text>
            <Text fontSize="xl">{verse.translation}</Text>
          </>
        ) : (
          <Text>Failed to load verse. Please try again.</Text>
        )}
        <Button onClick={shareVerse} colorScheme="blue">Share</Button>
        <IconButton
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          icon={<StarIcon />}
          onClick={toggleFavorite}
          colorScheme={isFavorite ? 'yellow' : 'gray'}
        />
        <Button onClick={fetchVerse} colorScheme="green">Get New Verse</Button>
      </VStack>
    </Box>
  )
}