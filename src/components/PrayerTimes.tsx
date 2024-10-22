import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, VStack, Text, Spinner, useToast, Grid, Flex, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

interface PrayerTime {
  [key: string]: string;
}

const PrayerTimes: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
          params: {
            city: 'London',
            country: 'United Kingdom',
            method: 2,
          },
        });
        setPrayerTimes(response.data.data.timings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch prayer times. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [toast]);

  if (loading) {
    return <Spinner size="xl" color="blue.500" />;
  }

  if (!prayerTimes) {
    return <Text color="red.500">Failed to load prayer times. Please try again.</Text>;
  }

  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const getIcon = (prayer: string) => {
    switch (prayer) {
      case 'Fajr':
      case 'Sunrise':
        return <SunIcon color="orange.400" />;
      case 'Maghrib':
      case 'Isha':
        return <MoonIcon color="blue.400" />;
      default:
        return <SunIcon color="yellow.400" />;
    }
  };

  return (
    <Box bg={bgColor} borderRadius="lg" boxShadow="xl" p={6} width="100%">
      <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={6}>
        {prayerOrder.map((prayer) => (
          <Box key={prayer} bg={cardBg} p={4} borderRadius="md" boxShadow="md">
            <Flex align="center" justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {prayer}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {prayerTimes[prayer]}
                </Text>
              </VStack>
              {getIcon(prayer)}
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default PrayerTimes;
