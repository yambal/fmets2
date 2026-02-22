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
import { signUp } from "../actions";
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
      loadingText="作成中..."
    >
      アカウント作成
    </Button>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <form action={signUp} style={{ width: "100%" }}>
      <VStack gap="4">
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
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
          placeholder="パスワード（6文字以上）"
          required
          minLength={6}
        />
        <SubmitButton />
        <Text fontSize="sm" color="gray.600">
          すでにアカウントをお持ちの方は{" "}
          <Link asChild color="blue.500">
            <NextLink href="/login">ログイン</NextLink>
          </Link>
        </Text>
      </VStack>
    </form>
  );
}

export default function SignupPage() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="400px">
        <VStack gap="6" bg="white" p="8" borderRadius="lg" shadow="md">
          <Heading size="xl">新規登録</Heading>
          <Suspense>
            <SignupForm />
          </Suspense>
        </VStack>
      </Container>
    </Box>
  );
}
