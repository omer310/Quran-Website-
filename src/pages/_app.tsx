import { useState, useEffect, useCallback } from 'react'
import { ChakraProvider, extendTheme, ThemeConfig, Box } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Header from '../components/Header'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
      },
    }),
  },
})

const backgrounds = [
  'default',
  'islamic1',
  'islamic2',
  'islamic3',
  'islamic4',
  'islamic5',
  'islamic6',
  'islamic7',
  'islamic8',
  'islamic9',
  // Add more backgrounds as needed
]

function MyApp({ Component, pageProps }: AppProps) {
  const [background, setBackground] = useState('default')
  const [cycleIndex, setCycleIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (background === 'default') {
      intervalId = setInterval(() => {
        setFadeOut(true);
        setTimeout(() => {
          setCycleIndex((prevIndex) => (prevIndex + 1) % (backgrounds.length - 1));
          setFadeOut(false);
        }, 500); // Half of the transition duration
      }, 30000); // Change background every 30 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [background]);

  const getBackgroundStyle = () => {
    if (background === 'default') {
      const cycledBackground = backgrounds[cycleIndex + 1]; // +1 to skip 'default'
      return cycledBackground === 'default' ? "url('/backgrounds/default.jpg')" : `url('/backgrounds/${cycledBackground}.jpg')`;
    }
    return background === 'default' ? "url('/backgrounds/default.jpg')" : `url('/backgrounds/${background}.jpg')`;
  }

  const handleBackgroundChange = useCallback((newBackground: string) => {
    setBackground(newBackground);
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage={getBackgroundStyle()}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        transition="opacity 1s ease-in-out"
        opacity={fadeOut ? 0 : 1}
        zIndex="-1"
      />
      <Box
        minHeight="100vh"
        position="relative"
        zIndex="1"
      >
        <Component {...pageProps} onSelectBackground={handleBackgroundChange} />
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
