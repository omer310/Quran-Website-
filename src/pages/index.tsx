import { useState, useEffect, useCallback } from 'react'
import { Box, VStack, Heading, Text, useToast, IconButton, Container, Flex, Spinner, Fade, useColorModeValue, Input, Button, useDisclosure } from '@chakra-ui/react'
import { StarIcon, RepeatIcon, ExternalLinkIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon, InfoIcon } from '@chakra-ui/icons'
import axios from 'axios'
import Header from '../components/Header'
import moment from 'moment-hijri'
import TafsirModal from '../components/TafsirModal'

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

const ISLAMIC_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-awwal', 'Rabi al-thani', 'Jumada al-awwal', 'Jumada al-thani',
  'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
];

interface HomeProps {
  onSelectBackground: (background: string) => void;
}

export default function Home({ onSelectBackground }: HomeProps) {
  const [verse, setVerse] = useState<Verse | null>(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentDate, setCurrentDate] = useState({
    gregorian: '',
    time: '',
    hijri: ''
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    fetchVerse();
    updateCurrentDate();
    const timer = setInterval(updateCurrentDate, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchVerse = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/verses/random');
      setVerse(response.data);
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
        const newFavorite = {
          ...verse,
          date: new Date().toISOString()
        }
        localStorage.setItem('favorites', JSON.stringify([...favorites, newFavorite]))
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

  const updateCurrentDate = () => {
    const now = moment();
    const hijriNow = now.clone().locale('en-US');
    
    setCurrentDate({
      gregorian: now.format('MMMM D, YYYY'),
      time: now.format('hh:mm:ss A'),
      hijri: `${ISLAMIC_MONTHS[hijriNow.iMonth()]} ${hijriNow.iDate()}, ${hijriNow.iYear()} AH`
    });
  };

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const textColor = useColorModeValue('gray.800', 'white')
  const arabicTextColor = useColorModeValue('gray.900', 'gray.100')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const fetchSpecificVerse = async (surahNumber: number, verseNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/verses/${surahNumber}/${verseNumber}`);
      setVerse(response.data);
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

  const goToNextVerse = () => {
    if (verse) {
      const nextVerseNumber = verse.number + 1;
      fetchSpecificVerse(verse.surah.number, nextVerseNumber);
    }
  };

  const goToPreviousVerse = () => {
    if (verse && verse.number > 1) {
      const previousVerseNumber = verse.number - 1;
      fetchSpecificVerse(verse.surah.number, previousVerseNumber);
    }
  };

  const handleBackgroundChange = useCallback((newBackground: string) => {
    // This function should be implemented in your _app.tsx
    // and passed down as a prop to this component
  }, [])

  return (
    <Box minHeight="100vh" pt={["16", "20", "24"]}>
      <Header onSelectBackground={onSelectBackground} />
      <Container maxW="container.md" py={[4, 8, 12]}>
        <VStack spacing={[4, 6, 8]} textAlign="center">
          <Box
            bg="rgba(0, 0, 0, 0.6)"
            p={[2, 3, 4]}
            borderRadius="lg"
            width="full"
          >
            <Heading as="h1" size={["lg", "xl", "2xl"]} color="white">Quran Verse of the Day</Heading>
          </Box>
            <Flex
            direction={["column", "row"]}
            justify="space-between"
            align={["center", "flex-start"]}
            width="full"
            bg="rgba(0, 0, 0, 0.6)"
            p={[2, 3, 4]}
            borderRadius="lg"
            color="white"
          >
            <Text fontSize={["sm", "md", "lg"]} mb={[2, 0]}>{currentDate.gregorian}</Text>
            <Text fontSize={["sm", "md", "lg"]} fontWeight="bold">{currentDate.time}</Text>
            <Text fontSize={["sm", "md", "lg"]}>{currentDate.hijri}</Text>
          </Flex>
          <Box 
            w="100%" 
            bg={bgColor} 
            borderRadius="lg" 
            boxShadow="xl" 
            p={[4, 6, 8]}
            position="relative"
            overflow="hidden"
            borderWidth="1px"
            borderColor={borderColor}
          >
            {loading ? (
              <Spinner size="xl" color="blue.500" />
            ) : verse ? (
              <Fade in={!loading}>
                <VStack spacing={[4, 6, 8]} align="stretch">
                  <Text 
                    fontSize={["2xl", "3xl", "4xl"]} 
                    fontWeight="bold"
                    color={arabicTextColor}
                    textAlign="center"
                    lineHeight="1.6"
                    fontFamily="'Amiri', serif"
                    mb={[2, 4]}
                  >
                    {verse.text}
                  </Text>
                  <Text 
                    fontSize={["md", "lg", "xl"]} 
                    color={textColor}
                    textAlign="center"
                    fontStyle="italic"
                    mb={[2, 4]}
                  >
                    {verse.translation}
                  </Text>
                  <Flex justify="space-between" align="center" borderTopWidth="1px" borderColor={borderColor} pt={[2, 3]}>
                    <Text fontSize={["sm", "md"]} fontWeight="bold" color={textColor}>
                      {verse.surah.englishName}
                    </Text>
                    <Text fontSize={["sm", "md"]} color={textColor}>
                      Verse {verse.number}
                    </Text>
                  </Flex>
                </VStack>
              </Fade>
            ) : (
              <Text color="red.500">Failed to load verse. Please try again.</Text>
            )}
          </Box>
          <Flex justify="center" gap={[2, 3, 4]} wrap="wrap">
            <IconButton
              aria-label="Previous verse"
              icon={<ChevronLeftIcon />}
              onClick={goToPreviousVerse}
              colorScheme="teal"
              size={["md", "lg"]}
              isRound
              isDisabled={!verse || verse.number === 1}
            />
            <IconButton
              aria-label="Share verse"
              icon={<ExternalLinkIcon />}
              onClick={shareVerse}
              colorScheme="blue"
              size={["md", "lg"]}
              isRound
            />
            <IconButton
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              icon={<StarIcon />}
              onClick={toggleFavorite}
              colorScheme={isFavorite ? 'yellow' : 'gray'}
              size={["md", "lg"]}
              isRound
            />
            <IconButton
              aria-label="Get random verse"
              icon={<RepeatIcon />}
              onClick={fetchVerse}
              colorScheme="green"
              size={["md", "lg"]}
              isRound
            />
            <IconButton
              aria-label="Next verse"
              icon={<ChevronRightIcon />}
              onClick={goToNextVerse}
              colorScheme="teal"
              size={["md", "lg"]}
              isRound
            />
            <IconButton
              aria-label="Show Tafsir"
              icon={<InfoIcon />}
              onClick={onOpen}
              colorScheme="purple"
              size={["md", "lg"]}
              isRound
            />
          </Flex>
        </VStack>
      </Container>
      {verse && (
        <TafsirModal
          isOpen={isOpen}
          onClose={onClose}
          surahNumber={verse.surah.number}
          verseNumber={verse.number}
        />
      )}
    </Box>
  )
}
