"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
  Spacer,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { signOut } from "@/app/(auth)/actions";
import { useFormStatus } from "react-dom";

function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      loading={pending}
      loadingText="ログアウト中..."
    >
      ログアウト
    </Button>
  );
}

export function DashboardContent({ userEmail }: { userEmail: string }) {
  return (
    <Box minH="100vh">
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
          <Link asChild color="gray.800" textDecoration="none">
            <NextLink href="/">FMETS2</NextLink>
          </Link>
        </Heading>
        <Spacer />
        <Flex align="center" gap="4">
          <Text fontSize="sm" color="gray.600">
            {userEmail}
          </Text>
          <form action={signOut}>
            <SignOutButton />
          </form>
        </Flex>
      </Flex>
      <Container maxW="breakpoint-lg" py="10">
        <VStack gap="6" align="start">
          <Heading size="2xl">ダッシュボード</Heading>
          <Text color="gray.600">ようこそ、{userEmail} さん</Text>
        </VStack>
      </Container>
    </Box>
  );
}
