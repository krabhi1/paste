import { Box, Flex } from "@radix-ui/themes";
import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <Flex flexGrow="1" style={{ minHeight: 0 }}>
      <Outlet />
      <Flex width="200px" flexShrink={"0"}>
        Public
      </Flex>
    </Flex>
  );
}
