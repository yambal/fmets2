"use client";

import {
  Button,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
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
      h="16"
      px="8"
      align="center"
    >
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
