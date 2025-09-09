import { Box, Flex } from "@radix-ui/themes";
import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <Flex height={"100%"} className="box">
      <Box flexGrow={"1"}>
        <Outlet />
      </Box>
      <Flex width={"200px"} className="box">
        Public
      </Flex>
    </Flex>
  );
}
