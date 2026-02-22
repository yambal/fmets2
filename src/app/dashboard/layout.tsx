import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Box, Flex } from "@chakra-ui/react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" display="flex" flexDirection="column">
        <DashboardHeader userEmail={user.email ?? ""} nickname={profile?.nickname ?? ""} />
        <Box flex="1" p="8">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
