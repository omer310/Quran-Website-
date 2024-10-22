import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, useColorModeValue, Icon, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { FaUserAlt, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';

interface Reciter {
  identifier: string;
  name: string;
  englishName: string;
}

interface ReciterSelectorProps {
  onSelectReciter: (identifier: string) => void;
}

const ReciterSelector: React.FC<ReciterSelectorProps> = ({ onSelectReciter }) => {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);

  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/verses/reciters');
        setReciters(response.data);
        setSelectedReciter(response.data.find((r: Reciter) => r.identifier === 'ar.alafasy') || null);
      } catch (error) {
        console.error('Error fetching reciters:', error);
      }
    };
    fetchReciters();
  }, []);

  const handleReciterChange = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    onSelectReciter(reciter.identifier);
  };

  const sudaneseReciters = reciters.filter(reciter => 
    reciter.englishName.toLowerCase().includes('sudanese') ||
    reciter.name.toLowerCase().includes('سوداني')
  );

  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');

  return (
    <Box width="100%" mb={4}>
      <Flex 
        direction={["column", "row"]} 
        align={["flex-start", "center"]} 
        justify="space-between"
        wrap="wrap"
        bg={useColorModeValue('gray.100', 'gray.800')}
        p={3}
        borderRadius="md"
        boxShadow="sm"
      >
        <Flex align="center" mb={[2, 0]}>
          <Icon as={FaUserAlt} color={iconColor} mr={2} />
          <Text 
            fontSize="sm" 
            fontWeight="medium" 
            color={textColor}
          >
            Select Reciter:
          </Text>
        </Flex>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<FaChevronDown />}
            bg={bgColor}
            color={textColor}
            borderColor={borderColor}
            _hover={{ bg: hoverBgColor }}
            _active={{ bg: hoverBgColor }}
          >
            {selectedReciter ? selectedReciter.englishName : 'Choose a reciter'}
          </MenuButton>
          <MenuList maxHeight="300px" overflowY="auto">
            {reciters.map(reciter => (
              <MenuItem 
                key={reciter.identifier} 
                onClick={() => handleReciterChange(reciter)}
                bg={selectedReciter?.identifier === reciter.identifier ? hoverBgColor : 'transparent'}
              >
                {reciter.englishName}
              </MenuItem>
            ))}
            {sudaneseReciters.length > 0 && (
              <>
                <MenuDivider />
                <MenuItem as="div" isDisabled fontWeight="bold">
                  Sudanese Reciters
                </MenuItem>
                {sudaneseReciters.map(reciter => (
                  <MenuItem 
                    key={reciter.identifier} 
                    onClick={() => handleReciterChange(reciter)}
                    bg={selectedReciter?.identifier === reciter.identifier ? hoverBgColor : 'transparent'}
                  >
                    {reciter.englishName}
                  </MenuItem>
                ))}
              </>
            )}
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default ReciterSelector;
