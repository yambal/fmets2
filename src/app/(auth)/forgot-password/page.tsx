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
import { resetPassword } from "../actions";
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
      loadingText="送信中..."
    >
      リセットメールを送信
    </Button>
  );
}

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <form action={resetPassword} style={{ width: "100%" }}>
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
        <Text fontSize="sm" color="gray.600">
          登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
        </Text>
        <Input
          name="email"
          type="email"
          placeholder="メールアドレス"
          required
        />
        <SubmitButton />
        <Link asChild color="blue.500" fontSize="sm">
          <NextLink href="/login">ログインに戻る</NextLink>
        </Link>
      </VStack>
    </form>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="400px">
        <VStack gap="6" bg="white" p="8" borderRadius="lg" shadow="md">
          <Heading size="xl">パスワードをお忘れですか？</Heading>
          <Suspense>
            <ForgotPasswordForm />
          </Suspense>
        </VStack>
      </Container>
    </Box>
  );
}
