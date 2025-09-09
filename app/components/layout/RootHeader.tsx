import {
  MagnifyingGlassIcon,
  PlusIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import { Flex, Text, TextField, Button, Box } from "@radix-ui/themes";
import { Link } from "react-router";

export default function RootHeader() {
  return (
    <Box
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--gray-6)",
        boxShadow: "var(--shadow-2)",
      }}
    >
      <Flex
        px="6"
        py="3"
        justify="between"
        align="center"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Logo/Brand */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Flex align="center" gap="2">
            <Box
              style={{
                background:
                  "linear-gradient(135deg, var(--blue-9), var(--purple-9))",
                borderRadius: "var(--radius-2)",
                padding: "6px 8px",
              }}
            >
              <ReaderIcon color="white" width="18" height="18" />
            </Box>
            <Text
              size="5"
              weight="bold"
              style={{
                background:
                  "linear-gradient(135deg, var(--blue-9), var(--purple-9))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Paste
            </Text>
          </Flex>
        </Link>

        {/* Search Bar */}
        <Box style={{ flex: 1, maxWidth: "400px", margin: "0 2rem" }}>
          <TextField.Root
            placeholder="Search pastes..."
            size="2"
            style={{ width: "100%" }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </Box>

        {/* Actions */}
        <Flex align="center" gap="3">
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="soft" size="2">
              <PlusIcon width="16" height="16" />
              New Paste
            </Button>
          </Link>

          {/* <Link to="/search" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="2">
              Browse
            </Button>
          </Link>

          <Link to="/about" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="2">
              About
            </Button>
          </Link> */}
        </Flex>
      </Flex>
    </Box>
  );
}
