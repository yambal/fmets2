import { Heading, Text, VStack } from "@chakra-ui/react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <VStack gap="6" align="start">
      <Heading size="2xl">ダッシュボード</Heading>
      <Text color="gray.600">ようこそ、{user?.email} さん</Text>
    </VStack>
  );
}
