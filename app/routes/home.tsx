import type { Route } from ".react-router/types/app/routes/+types/home";
import { Box, Flex, Text as Label } from "@radix-ui/themes"; // Added Label import
import { Outlet } from "react-router";
import { Form } from "react-router";
import { TextField, Select, TextArea, Button } from "@radix-ui/themes"; // Assuming Radix Themes for consistency

// ...existing code...

export default function Page({}: Route.ComponentProps) {
  return (
    <Flex
      width="100%"
      height="100vh"
      direction="column"
      align="center"
      justify="start"
      p="4"
      style={{
        background:
          "linear-gradient(135deg, var(--gray-1) 0%, var(--gray-2) 100%)",
        minHeight: "100vh",
      }}
    >
      <Box width="100%" style={{ maxWidth: "600px" }} mt="4">
        <Box mb="6" style={{ textAlign: "center" }}>
          <Label
            as="p"
            size="8"
            weight="bold"
            mb="2"
            style={{
              background:
                "linear-gradient(135deg, var(--blue-9), var(--purple-9))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              display: "block",
              fontSize: "2rem",
            }}
          >
            Create New Paste
          </Label>
          <Label size="3" color="gray" style={{ textAlign: "center" }}>
            Share your code and text with others
          </Label>
        </Box>

        <Box
          p="6"
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-4)",
            boxShadow: "var(--shadow-5)",
            border: "1px solid var(--gray-6)",
          }}
        >
          <Form method="post">
            <Flex direction="column" gap="4">
              <Box>
                <Label
                  htmlFor="title"
                  size="3"
                  weight="medium"
                  mb="2"
                  style={{
                    display: "block",
                    color: "var(--gray-12)",
                  }}
                >
                  Paste Title
                </Label>
                <TextField.Root
                  size="3"
                  id="title"
                  name="title"
                  placeholder="Enter a descriptive title..."
                  required
                />
              </Box>

              <Flex gap="4">
                <Box style={{ flex: 1 }}>
                  <Label
                    htmlFor="expiry"
                    size="3"
                    weight="medium"
                    mb="2"
                    style={{
                      display: "block",
                      color: "var(--gray-12)",
                    }}
                  >
                    Expiry
                  </Label>
                  <Select.Root name="expiry" defaultValue="never">
                    <Select.Trigger
                      id="expiry"
                      placeholder="Select Expiry"
                      style={{ width: "100%" }}
                    />
                    <Select.Content>
                      <Select.Item value="never">Never</Select.Item>
                      <Select.Item value="1hr">1 Hour</Select.Item>
                      <Select.Item value="24hr">24 Hours</Select.Item>
                      <Select.Item value="7days">7 Days</Select.Item>
                      <Select.Item value="30days">30 Days</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                <Box style={{ flex: 1 }}>
                  <Label
                    htmlFor="syntax"
                    size="3"
                    weight="medium"
                    mb="2"
                    style={{
                      display: "block",
                      color: "var(--gray-12)",
                    }}
                  >
                    Syntax Highlighting
                  </Label>
                  <Select.Root name="syntax" defaultValue="plaintext">
                    <Select.Trigger
                      id="syntax"
                      placeholder="Select Language"
                      style={{ width: "100%" }}
                    />
                    <Select.Content>
                      <Select.Item value="plaintext">Plain Text</Select.Item>
                      <Select.Item value="cpp">C++</Select.Item>
                      <Select.Item value="java">Java</Select.Item>
                      <Select.Item value="javascript">JavaScript</Select.Item>
                      <Select.Item value="typescript">TypeScript</Select.Item>
                      <Select.Item value="python">Python</Select.Item>
                      <Select.Item value="yaml">YAML</Select.Item>
                      <Select.Item value="json">JSON</Select.Item>
                      <Select.Item value="css">CSS</Select.Item>
                      <Select.Item value="html">HTML</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Flex>

              <Box>
                <Label
                  htmlFor="text"
                  size="3"
                  weight="medium"
                  mb="2"
                  style={{
                    display: "block",
                    color: "var(--gray-12)",
                  }}
                >
                  Content
                </Label>
                <TextArea
                  size="3"
                  id="text"
                  name="text"
                  placeholder="Paste your code or text here..."
                  rows={12}
                  required
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--font-size-2)",
                    resize: "vertical",
                    minHeight: "200px",
                  }}
                />
              </Box>

              <Button
                type="submit"
                size="3"
                mt="2"
                style={{
                  background:
                    "linear-gradient(135deg, var(--blue-9), var(--purple-9))",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🚀 Create Paste
              </Button>
            </Flex>
          </Form>
        </Box>
      </Box>
    </Flex>
  );
}
