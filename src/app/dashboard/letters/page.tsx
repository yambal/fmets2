import { createClient } from "@/lib/supabase/server";
import { Heading, VStack } from "@chakra-ui/react";
import { LetterForm } from "./letter-form";
import { LetterList } from "./letter-list";
import type { Letter } from "@/types/database";

export default async function LettersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: letters }, { data: profile }, { data: lastLetter }] = await Promise.all([
    supabase
      .from("letters")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("letters")
      .select("created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return (
    <VStack gap="8" align="stretch">
      <Heading size="2xl">おたより投稿</Heading>
      <LetterForm nickname={profile?.nickname ?? ""} lastPostedAt={lastLetter?.created_at ?? null} />
      <VStack gap="4" align="stretch">
        <Heading size="md" color="gray.700">
          投稿したおたより
        </Heading>
        <LetterList letters={(letters as Letter[]) ?? []} />
      </VStack>
    </VStack>
  );
}
