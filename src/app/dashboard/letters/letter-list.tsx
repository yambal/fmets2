"use client";

import { Box, Text, VStack, Flex, Button, Spacer } from "@chakra-ui/react";
import { useTransition } from "react";
import { deleteLetter } from "./actions";
import type { Letter } from "@/types/database";

function LetterItem({ letter }: { letter: Letter }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteLetter(letter.id);
    });
  }

  const date = new Date(letter.created_at);
  const formatted = date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box
      p="4"
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      opacity={isPending ? 0.5 : 1}
    >
      <VStack align="stretch" gap="2">
        <Text whiteSpace="pre-wrap">{letter.body}</Text>
        <Flex align="center">
          <Flex gap="2" align="center">
            <Text
              fontSize="xs"
              px="1.5"
              py="0.5"
              borderRadius="sm"
              bg={letter.processed ? "green.100" : "gray.100"}
              color={letter.processed ? "green.700" : "gray.500"}
              fontWeight="semibold"
            >
              {letter.processed ? "処理済" : "未処理"}
            </Text>
            {letter.nickname && (
              <Text fontSize="xs" color="blue.600" fontWeight="semibold">
                {letter.nickname}
              </Text>
            )}
            <Text fontSize="xs" color="gray.500">
              {formatted}
            </Text>
          </Flex>
          <Spacer />
          {!letter.processed && (
            <Button
              size="xs"
              variant="ghost"
              color="red.500"
              onClick={handleDelete}
              loading={isPending}
              loadingText="削除中..."
            >
              削除
            </Button>
          )}
        </Flex>
      </VStack>
    </Box>
  );
}

export function LetterList({ letters }: { letters: Letter[] }) {
  if (letters.length === 0) {
    return (
      <Text color="gray.500" fontSize="sm">
        まだおたよりはありません。上のフォームから投稿してみましょう！
      </Text>
    );
  }

  return (
    <VStack gap="3" align="stretch">
      {letters.map((letter) => (
        <LetterItem key={letter.id} letter={letter} />
      ))}
    </VStack>
  );
}
