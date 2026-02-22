import { createClient } from "@/lib/supabase/server";
import { Heading, VStack } from "@chakra-ui/react";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user!.id)
    .single();

  return (
    <VStack gap="8" align="stretch">
      <Heading size="2xl">プロフィール</Heading>
      <ProfileForm currentNickname={profile?.nickname ?? ""} />
    </VStack>
  );
}
