import { Box, Flex, Button, Container, Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack } from '@chakra-ui/react'
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { backgrounds } from '../config/backgrounds'

interface HeaderProps {
  onSelectBackground: (background: string) => void
}

const Header: React.FC<HeaderProps> = ({ onSelectBackground }) => {
  const [selectedBackground, setSelectedBackground] = useState('default')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleBackgroundChange = useCallback((value: string) => {
    setSelectedBackground(value)
    onSelectBackground(value)
  }, [onSelectBackground])

  const NavContent = useCallback(() => (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          colorScheme="teal"
          size={["sm", "md"]}
          mr={2}
        >
          Background
        </MenuButton>
        <MenuList>
          {backgrounds.map((bg) => (
            <MenuItem
              key={bg.value}
              onClick={() => handleBackgroundChange(bg.value)}
              fontWeight={selectedBackground === bg.value ? 'bold' : 'normal'}
            >
              {bg.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Link href="/favorites" passHref legacyBehavior>
        <Button as="a" variant="solid" colorScheme="yellow" mr={2} size={["sm", "md"]}>
          Favorites
        </Button>
      </Link>
      <Link href="/history" passHref legacyBehavior>
        <Button as="a" variant="solid" colorScheme="blue" size={["sm", "md"]}>
          History
        </Button>
      </Link>
    </>
  ), [handleBackgroundChange, selectedBackground])

  return (
    <Box
      as="header"
      position="fixed"
      top={["2", "4"]}
      left="50%"
      transform="translateX(-50%)"
      width={["95%", "90%"]}
      maxWidth="container.xl"
      zIndex="1000"
      bg="white"
      boxShadow="md"
      borderRadius="full"
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" py={2} px={[3, 6]}>
          <Link href="/" passHref legacyBehavior>
            <Button as="a" variant="ghost" colorScheme="blue" fontWeight="bold" fontSize={["md", "lg"]}>
              Quran Verses
            </Button>
          </Link>
          <Box display={["none", "none", "block"]}>
            <NavContent />
          </Box>
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            display={["block", "block", "none"]}
            onClick={onOpen}
            variant="outline"
          />
        </Flex>
      </Container>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <NavContent />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Header
