import { Box, Flex, Button } from '@chakra-ui/react'
import Link from 'next/link'

const Header = () => {
  return (
    <Box as="header" bg="blue.500" py={4}>
      <Flex maxW="container.xl" mx="auto" justify="space-between" align="center" px={4}>
        <Link href="/" passHref legacyBehavior>
          <Button as="a" variant="ghost" color="white">
            Home
          </Button>
        </Link>
        <Link href="/history" passHref legacyBehavior>
          <Button as="a" variant="ghost" color="white">
            History
          </Button>
        </Link>
      </Flex>
    </Box>
  )
}

export default Header