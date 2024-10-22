import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, VStack, Text, Spinner, useToast, Grid, Flex, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { FaPrayingHands, FaSun, FaCloudSun, FaCloudMoon, FaMoon, FaStar } from 'react-icons/fa';

interface PrayerTime {
  [key: string]: string;
}

interface PrayerTimesProps {
  country: string;
  method: string;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ country, method }) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState<string>('');
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
          params: {
            city: 'New York', // Default city for USA
            country: country,
            method: method,
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
  }, [toast, country, method]);

  useEffect(() => {
    if (prayerTimes) {
      const updateNextPrayer = () => {
        const now = new Date();
        const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        let nextPrayerName = null;
        let smallestDiff = Infinity;

        prayerOrder.forEach((prayer) => {
          const prayerTime = new Date();
          const [hours, minutes] = prayerTimes[prayer].split(':');
          prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          let diff = prayerTime.getTime() - now.getTime();
          if (diff < 0) {
            diff += 24 * 60 * 60 * 1000; // Add 24 hours if prayer time has passed
          }

          if (diff < smallestDiff) {
            smallestDiff = diff;
            nextPrayerName = prayer;
          }
        });

        setNextPrayer(nextPrayerName);

        // Calculate time until next prayer
        const hours = Math.floor(smallestDiff / (1000 * 60 * 60));
        const minutes = Math.floor((smallestDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((smallestDiff % (1000 * 60)) / 1000);

        setTimeUntilNextPrayer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };

      updateNextPrayer();
      const timer = setInterval(updateNextPrayer, 1000);

      return () => clearInterval(timer);
    }
  }, [prayerTimes]);

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
        return <FaPrayingHands color="#FFA500" />;
      case 'Sunrise':
        return <FaSun color="#FFD700" />;
      case 'Dhuhr':
        return <FaCloudSun color="#87CEEB" />;
      case 'Asr':
        return <FaCloudMoon color="#4682B4" />;
      case 'Maghrib':
        return <FaMoon color="#1E90FF" />;
      case 'Isha':
        return <FaStar color="#4B0082" />;
      default:
        return <SunIcon color="yellow.400" />;
    }
  };

  return (
    <Box bg={bgColor} borderRadius="lg" boxShadow="xl" p={6} width="100%">
      <Box mb={6} textAlign="center">
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Next Prayer: {nextPrayer}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Time Remaining: {timeUntilNextPrayer}
        </Text>
      </Box>
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
