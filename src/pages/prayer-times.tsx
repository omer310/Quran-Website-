import React from 'react';
import { Box, Container, VStack, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import Header from '../components/Header';
import PrayerTimes from '../components/PrayerTimes';

const PrayerTimesPage: React.FC = () => {
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box minHeight="100vh" pt={["20", "24", "28"]}>
      <Header onSelectBackground={() => {}} />
      <Container maxW="container.lg" py={[8, 12, 16]}>
        <VStack spacing={[6, 8, 10]} textAlign="center">
          <Box
            bg="rgba(0, 0, 0, 0.6)"
            p={4}
            borderRadius="lg"
            width="full"
          >
            <Heading as="h1" size={["xl", "2xl", "3xl"]} color="white" mb={2}>
              Prayer Times
            </Heading>
            <Text fontSize={["md", "lg"]} color="white" opacity={0.8}>
              Daily prayer schedule for London, United Kingdom
            </Text>
          </Box>
          <PrayerTimes />
        </VStack>
      </Container>
    </Box>
  );
};

export default PrayerTimesPage;
