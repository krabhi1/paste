import {
  Flex,
  Box,
  Text,
  Button,
  Badge,
  Code,
  Separator,
} from "@radix-ui/themes";
import {
  CopyIcon,
  CalendarIcon,
  CodeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import type { Route } from "./+types/paste";
import { getPasteById } from "~/db/queries";
import { useState } from "react";
export async function loader({ request, params }: Route.LoaderArgs) {
  const { id } = params;
  const paste = await getPasteById(id!);
  if (!paste) {
    throw new Response("Not Found", { status: 404 });
  }
  return { paste };
}
export default function Page({ loaderData }: Route.ComponentProps) {
  const { paste } = loaderData;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      width="100%"
      flexGrow={"1"}
      p="6"
      style={{
        background:
          "linear-gradient(135deg, var(--gray-1) 0%, var(--gray-2) 100%)",
      }}
    >
      <Flex
        style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}
        direction="column"
        height="100%"
      >
        {/* Header */}
        <Box mb="6">
          <Flex justify="between" align="start" mb="4">
            <Box>
              <Text
                size="6"
                weight="bold"
                style={{
                  background:
                    "linear-gradient(135deg, var(--blue-9), var(--purple-9))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {paste.title || "Untitled Paste"}
              </Text>
              <Text
                size="2"
                color="gray"
                style={{ display: "block", marginTop: "4px" }}
              >
                ID: {paste.id}
              </Text>
            </Box>

            <Flex gap="3">
              <Button
                onClick={handleCopy}
                variant={copied ? "solid" : "soft"}
                color={copied ? "green" : "blue"}
                size="2"
              >
                <CopyIcon width="16" height="16" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Flex>
          </Flex>

          {/* Metadata */}
          <Flex gap="4" align="center" wrap="wrap">
            <Flex align="center" gap="2">
              <CalendarIcon width="14" height="14" color="var(--gray-11)" />
              <Text size="2" color="gray">
                Created {formatDate(paste.createdAt)}
              </Text>
            </Flex>

            <Flex align="center" gap="2">
              <CodeIcon width="14" height="14" color="var(--gray-11)" />
              <Badge variant="soft" size="1">
                {"plaintext"}
              </Badge>
            </Flex>

            <Flex align="center" gap="2">
              <PersonIcon width="14" height="14" color="var(--gray-11)" />
              <Text size="2" color="gray">
                {paste.text.length} characters
              </Text>
            </Flex>
          </Flex>
        </Box>

        <Separator size="4" mb="6" />
        {/* Code Content */}
        <Flex
          direction={"column"}
          flexGrow="1"
          style={{
            minHeight: 0,
            background: "var(--color-surface)",
            borderRadius: "var(--radius-4)",
            boxShadow: "var(--shadow-3)",
          }}
        >
          <Flex
            justify="between"
            align="center"
            p={"3"}
            style={{
              borderBottom: "1px solid var(--gray-4)",
            }}
          >
            <Badge variant="soft" size="2">
              {paste.syntax || "plaintext"}
            </Badge>
            <Flex justify="center" gap="3">
              <Button variant="soft" size="1">
                View Raw
              </Button>
              <Button variant="soft" size="1">
                Download
              </Button>
              <Button variant="soft" size="1" color="red">
                Report
              </Button>
            </Flex>
          </Flex>
          <Box
            style={{ background: "var(--gray-1)" }}
            overflow={"auto"}
            flexGrow="1"
          >
            <Code
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-size-2)",
                lineHeight: "1.6",
                whiteSpace: "pre",
                color: "var(--gray-12)",
                background: "transparent",
                border: "none",
                padding: "1rem",
                margin: 0,
                overflow: "auto",
              }}
            >
              {paste.text}
            </Code>
          </Box>
        </Flex>
        {/* Footer Actions */}
        <Flex justify="between" align="center" mt="6" gap="3">
          <Flex gap="3">
            <Button variant="soft" size="2">
              Edit Paste
            </Button>
            <Button variant="soft" size="2">
              Fork
            </Button>
          </Flex>
          <Button variant="soft" size="2" color="red">
            Delete Paste
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
