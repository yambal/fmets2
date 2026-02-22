"use client";

import {
  Button,
  Heading,
  Text,
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

export function DashboardHeader({ userEmail, nickname }: { userEmail: string; nickname: string }) {
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
        <Link asChild color="gray.800" textDecoration="none">
          <NextLink href="/">FM ETS2 JP</NextLink>
        </Link>
      </Heading>
      <Spacer />
      <Flex align="center" gap="4">
        <Text fontSize="sm" color="gray.600">
          {nickname || userEmail}
        </Text>
        <form action={signOut}>
          <SignOutButton />
        </form>
      </Flex>
    </Flex>
  );
}
