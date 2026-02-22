"use client";

import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { updatePassword } from "../actions";
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
      loadingText="更新中..."
    >
      パスワードを更新
    </Button>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <form action={updatePassword} style={{ width: "100%" }}>
      <VStack gap="4">
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
        <Text fontSize="sm" color="gray.600">
          新しいパスワードを入力してください。
        </Text>
        <Input
          name="password"
          type="password"
          placeholder="新しいパスワード（6文字以上）"
          required
          minLength={6}
        />
        <SubmitButton />
      </VStack>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="400px">
        <VStack gap="6" bg="white" p="8" borderRadius="lg" shadow="md">
          <Heading size="xl">新しいパスワード</Heading>
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </VStack>
      </Container>
    </Box>
  );
}
