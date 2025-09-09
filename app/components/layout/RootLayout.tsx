import { Box } from "@radix-ui/themes";
import { Outlet } from "react-router";
import RootHeader from "~/components/layout/RootHeader";

export default function RootLayout() {
  return (
    <Box
      position={"fixed"}
      left="0"
      top="0"
      height={"100%"}
      width={"100%"}
      overflow={"hidden"}
      style={{
        backgroundColor: "var(--gray-2)",
      }}
    >
      <RootHeader />
      <Outlet />
    </Box>
  );
}
