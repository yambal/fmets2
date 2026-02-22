"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Spacer,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";

function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Flex
      as="header"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px="8"
      py="4"
      align="center"
    >
      <Heading as="h1" size="md" color="gray.800">
        FM ETS2 JP
      </Heading>
      <Spacer />
      <HStack gap="6">
        <Link href="#features" fontWeight="medium" color="gray.600">
          Features
        </Link>
        <Link href="#about" fontWeight="medium" color="gray.600">
          About
        </Link>
        {isLoggedIn ? (
          <Button asChild colorPalette="blue" size="sm">
            <NextLink href="/dashboard">ダッシュボード</NextLink>
          </Button>
        ) : (
          <Button asChild colorPalette="blue" size="sm">
            <NextLink href="/login">ログイン</NextLink>
          </Button>
        )}
      </HStack>
    </Flex>
  );
}

function Hero() {
  return (
    <Box bg="gray.50" py="20">
      <Container maxW="breakpoint-lg">
        <VStack gap="6" textAlign="center">
          <Heading as="h2" size="4xl" color="gray.900">
            Welcome to FM ETS2 JP
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="600px">
            Built with Next.js, TypeScript, and Chakra UI. Ready to deploy on
            Vercel.
          </Text>
          <HStack gap="4">
            <Button colorPalette="blue" size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

function Features() {
  const features = [
    {
      title: "Fast",
      description:
        "Optimized for speed with Next.js App Router and server-side rendering.",
    },
    {
      title: "Type Safe",
      description:
        "Full TypeScript support for a reliable development experience.",
    },
    {
      title: "Beautiful UI",
      description:
        "Chakra UI provides accessible, composable components out of the box.",
    },
  ];

  return (
    <Box id="features" py="20">
      <Container maxW="breakpoint-lg">
        <VStack gap="12">
          <Heading size="3xl" color="gray.900">
            Features
          </Heading>
          <HStack gap="8" align="start" wrap="wrap" justify="center">
            {features.map((f) => (
              <Box
                key={f.title}
                p="8"
                bg="white"
                borderRadius="lg"
                shadow="md"
                maxW="300px"
                flex="1"
                minW="250px"
              >
                <VStack gap="3" align="start">
                  <Heading size="lg" color="gray.800">
                    {f.title}
                  </Heading>
                  <Text color="gray.600">{f.description}</Text>
                </VStack>
              </Box>
            ))}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Box as="footer" bg="gray.800" color="white" py="8">
      <Container maxW="breakpoint-lg">
        <Text textAlign="center" fontSize="sm">
          &copy; 2026 FM ETS2 JP. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}

export function LandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Box minH="100vh">
      <Header isLoggedIn={isLoggedIn} />
      <Hero />
      <Features />
      <Spacer />
      <Footer />
    </Box>
  );
}
