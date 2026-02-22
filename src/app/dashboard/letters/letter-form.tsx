"use client";

import { useRef, useState, useEffect } from "react";
import { Box, Button, Textarea, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useFormStatus } from "react-dom";
import { submitLetter } from "./actions";

const COOLDOWN_MS = 6 * 60 * 60 * 1000;

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      colorPalette="blue"
      loading={pending}
      loadingText="投稿中..."
      alignSelf="flex-end"
      disabled={disabled || pending}
    >
      投稿する
    </Button>
  );
}

function formatRemaining(ms: number) {
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.ceil((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}時間${minutes}分`;
}

export function LetterForm({ nickname, lastPostedAt }: { nickname: string; lastPostedAt: string | null }) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!lastPostedAt) return;

    function calcRemaining() {
      const elapsed = Date.now() - new Date(lastPostedAt!).getTime();
      return Math.max(0, COOLDOWN_MS - elapsed);
    }

    setRemaining(calcRemaining());
    const timer = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r <= 0) clearInterval(timer);
    }, 60000);

    return () => clearInterval(timer);
  }, [lastPostedAt]);

  const isCooldown = remaining > 0;
  const isDisabled = !nickname || isCooldown;

  async function handleSubmit(formData: FormData) {
    const result = await submitLetter(formData);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "おたよりを投稿しました！" });
      formRef.current?.reset();
      setRemaining(COOLDOWN_MS);
    }
  }

  return (
    <Box bg="white" p="6" borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
      <form ref={formRef} action={handleSubmit}>
        <VStack gap="4" align="stretch">
          {message && (
            <Text
              color={message.type === "error" ? "red.500" : "green.600"}
              fontSize="sm"
            >
              {message.text}
            </Text>
          )}
          {nickname ? (
            <Text fontSize="sm" color="gray.700">
              投稿者: <Text as="span" fontWeight="semibold" color="blue.600">{nickname}</Text>
            </Text>
          ) : (
            <Text fontSize="sm" color="orange.500">
              ニックネームが未設定です。
              <NextLink href="/dashboard/profile" style={{ color: "#3182ce", marginLeft: "4px" }}>
                プロフィールで設定する
              </NextLink>
            </Text>
          )}
          {isCooldown ? (
            <Text fontSize="sm" color="orange.500">
              次の投稿まであと{formatRemaining(remaining)}お待ちください。
            </Text>
          ) : (
            <Text fontSize="sm" color="gray.500">
              ※ 投稿すると6時間は次の投稿ができません。
            </Text>
          )}
          <Textarea
            name="body"
            placeholder="おたよりの内容を入力してください..."
            rows={5}
            required
            disabled={isDisabled}
          />
          <SubmitButton disabled={isDisabled} />
        </VStack>
      </form>
    </Box>
  );
}
