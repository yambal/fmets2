"use client";

import { useRef, useState } from "react";
import { Box, Button, Input, Text, VStack, Heading } from "@chakra-ui/react";
import { useFormStatus } from "react-dom";
import { updateNickname } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      colorPalette="blue"
      loading={pending}
      loadingText="保存中..."
      alignSelf="flex-end"
    >
      保存
    </Button>
  );
}

export function ProfileForm({ currentNickname }: { currentNickname: string }) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const result = await updateNickname(formData);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "ニックネームを保存しました！" });
    }
  }

  return (
    <Box bg="white" p="6" borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
      <form ref={formRef} action={handleSubmit}>
        <VStack gap="4" align="stretch">
          <Heading size="md">ニックネーム</Heading>
          {message && (
            <Text
              color={message.type === "error" ? "red.500" : "green.600"}
              fontSize="sm"
            >
              {message.text}
            </Text>
          )}
          <Input
            name="nickname"
            defaultValue={currentNickname}
            placeholder="ニックネームを入力"
          />
          <SubmitButton />
        </VStack>
      </form>
    </Box>
  );
}
