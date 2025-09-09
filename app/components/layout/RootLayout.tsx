import { Box, Flex } from "@radix-ui/themes";
import { Outlet } from "react-router";
import RootHeader from "~/components/layout/RootHeader";

export default function RootLayout() {
  return (
    <Flex
      position="fixed"
      left="0"
      top="0"
      height="100vh"
      width="100%"
      direction="column"
      p="5"
      style={{
        backgroundColor: "var(--gray-2)",
        minHeight: 0, // ✅ allow children to shrink
      }}
    >
      <RootHeader />
      <Outlet />
    </Flex>
  );
}
