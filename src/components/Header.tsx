import React from 'react';
import { Box, Flex, useColorMode, useColorModeValue, IconButton, Link as ChakraLink, Menu, MenuButton, MenuList, MenuItem, chakra } from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface HeaderProps {
  onSelectBackground: (background: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSelectBackground }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('rgba(237, 242, 247, 0.8)', 'rgba(45, 55, 72, 0.8)');
  const activeBg = useColorModeValue('rgba(226, 232, 240, 0.8)', 'rgba(74, 85, 104, 0.8)');
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/favorites', label: 'Favorites' },
    { path: '/history', label: 'History' },
    { path: '/prayer-times', label: 'Prayer Times' },
  ];

  const NavLink = chakra(({ path, label }: { path: string; label: string }) => (
    <NextLink href={path} passHref>
      <ChakraLink
        px={2}
        py={1}
        rounded={'md'}
        color={textColor}
        bg={isActive(path) ? activeBg : 'transparent'}
        _hover={{ bg: hoverBg, textDecoration: 'none' }}
        position="relative"
        overflow="hidden"
      >
        {label}
        {isActive(path) && (
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            height="2px"
            bg={colorMode === 'light' ? 'blue.500' : 'blue.200'}
            borderRadius="full"
          />
        )}
      </ChakraLink>
    </NextLink>
  ));

  return (
    <Box
      as="header"
      position="fixed"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={10}
      bg={bg}
      boxShadow="lg"
      borderRadius="full"
      backdropFilter="blur(10px)"
      width={["95%", "90%", "auto"]}
      maxWidth={["95%", "90%", "container.xl"]}
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="nowrap"
        padding="0.5rem 1.5rem"
      >
        <NextLink href="/" passHref>
          <ChakraLink fontSize="lg" fontWeight="bold" mr={4} color={textColor}>
            Quran Verse
          </ChakraLink>
        </NextLink>
        <Flex align="center" display={["none", "none", "flex"]}>
          {navItems.map((item) => (
            <NavLink key={item.path} path={item.path} label={item.label} />
          ))}
        </Flex>
        <Flex align="center">
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            mr={2}
            color={textColor}
            _hover={{ bg: hoverBg }}
          />
          <Box display={["block", "block", "none"]}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="ghost"
                color={textColor}
                _hover={{ bg: hoverBg }}
              />
              <MenuList>
                {navItems.map((item) => (
                  <NextLink key={item.path} href={item.path} passHref>
                    <MenuItem as={ChakraLink} bg={isActive(item.path) ? activeBg : undefined}>
                      {item.label}
                    </MenuItem>
                  </NextLink>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
