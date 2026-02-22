"use client";

import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Link,
  Box,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "../actions";
import { useFormStatus } from "react-dom";
import { Suspense } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      colorPalette="blue"
      width="full"
      loading={pending}
      loadingText="ログイン中..."
    >
      ログイン
    </Button>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <form action={signIn} style={{ width: "100%" }}>
      <VStack gap="4">
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
        {message && (
          <Text color="green.600" fontSize="sm">
            {message}
          </Text>
        )}
        <Input
          name="email"
          type="email"
          placeholder="メールアドレス"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="パスワード"
          required
          minLength={6}
        />
        <SubmitButton />
        <Text fontSize="sm" color="gray.600">
          アカウントをお持ちでない方は{" "}
          <Link asChild color="blue.500">
            <NextLink href="/signup">新規登録</NextLink>
          </Link>
        </Text>
      </VStack>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="400px">
        <VStack gap="6" bg="white" p="8" borderRadius="lg" shadow="md">
          <Heading size="xl">ログイン</Heading>
          <Suspense>
            <LoginForm />
          </Suspense>
        </VStack>
      </Container>
    </Box>
  );
}
