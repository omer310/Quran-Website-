import React, { useState } from 'react';
import { Box, Container, VStack, Heading, Text, useColorModeValue, Select } from '@chakra-ui/react';
import Header from '../components/Header';
import PrayerTimes from '../components/PrayerTimes';

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "India", "Pakistan", "Saudi Arabia", "Egypt", "Turkey", "Indonesia",
  "Malaysia", "United Arab Emirates", "Qatar", "Kuwait", "Bahrain", "Oman", "Jordan", "Lebanon", "Morocco", "Algeria",
  "Tunisia", "Libya", "Sudan", "Somalia", "Nigeria", "South Africa", "Kenya", "Tanzania", "Bangladesh", "Sri Lanka",
  "Afghanistan", "Iran", "Iraq", "Syria", "Yemen", "Palestine", "France", "Germany", "Italy",
  "Spain", "Netherlands", "Belgium", "Sweden", "Norway", "Denmark", "Finland", "Russia", "China", "Japan"
];

const PrayerTimesPage: React.FC = () => {
  const textColor = useColorModeValue('gray.800', 'white');
  const [country, setCountry] = useState('United States');
  const [method, setMethod] = useState('2'); // ISNA method

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
              Daily prayer schedule for {country}
            </Text>
          </Box>
          <Box width="full">
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              mb={4}
              bg="white"
              color="black"
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              mb={4}
              bg="white"
              color="black"
            >
              <option value="2">ISNA</option>
              <option value="1">MWL</option>
              <option value="3">Egyptian General Authority of Survey</option>
              <option value="4">Umm Al-Qura University, Makkah</option>
              <option value="5">Islamic Society of North America</option>
            </Select>
          </Box>
          <PrayerTimes country={country} method={method} />
        </VStack>
      </Container>
    </Box>
  );
};

export default PrayerTimesPage;
