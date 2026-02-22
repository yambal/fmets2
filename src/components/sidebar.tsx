"use client";

import { Box, Flex, Heading, VStack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: "ダッシュボード", href: "/dashboard" },
  { label: "おたより投稿", href: "/dashboard/letters" },
  { label: "プロフィール", href: "/dashboard/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      w="240px"
      minH="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      py="0"
      flexShrink={0}
    >
      <Flex h="16" align="center" px="6" borderBottom="1px solid" borderColor="gray.200">
        <Heading size="md" color="gray.800" fontWeight="bold">
          FM ETS2 JP
        </Heading>
      </Flex>
      <VStack gap="1" align="stretch" px="3" pt="2">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <NextLink key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <Box
                px="3"
                py="2"
                borderRadius="md"
                bg={isActive ? "blue.50" : "transparent"}
                color={isActive ? "blue.700" : "gray.700"}
                fontWeight={isActive ? "semibold" : "normal"}
                fontSize="sm"
                _hover={{ bg: isActive ? "blue.50" : "gray.100" }}
              >
                <Text>{item.label}</Text>
              </Box>
            </NextLink>
          );
        })}
      </VStack>
    </Box>
  );
}
