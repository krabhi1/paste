import type { Route } from ".react-router/types/app/components/layout/+types/PublicLayout";
import { Box, Flex, Text, Badge, Separator } from "@radix-ui/themes";
import { Outlet, Link } from "react-router";
import { getLatestPastes } from "~/db/queries";
import type { Paste } from "~/db/schema";
import { ClockIcon, CodeIcon } from "@radix-ui/react-icons";

export async function loader({ request }: Route.LoaderArgs) {
  const pasteList = await getLatestPastes(10);
  return { pasteList };
}
export default function PublicLayout({ loaderData }: Route.ComponentProps) {
  const { pasteList } = loaderData;
  return (
    <Flex flexGrow="1" style={{ minHeight: 0 }} gap="4" align="stretch">
      <Outlet />
      <Box
        width="280px"
        flexShrink="0"
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-3)",
          border: "1px solid var(--gray-6)",
          overflow: "hidden",
        }}
      >
        <PublicList list={pasteList} />
      </Box>
    </Flex>
  );
}

function PublicList({ list }: { list: Paste[] }) {
  const formatTimeAgo = (date: Date) => {
    if (isNaN(date.getTime())) return "Invalid date";

    const now = new Date();
    let diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    // Handle future dates
    if (diffInMinutes < 0) diffInMinutes = 0;

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Flex direction="column" style={{ height: "100%" }}>
      {/* Header */}
      <Box
        p="3"
        style={{
          background: "var(--gray-2)",
          borderBottom: "1px solid var(--gray-6)",
        }}
      >
        <Text size="3" weight="bold" color="gray">
          Recent Pastes
        </Text>
      </Box>

      {/* List */}
      <Box style={{ flex: 1, overflow: "auto" }}>
        {list.length === 0 ? (
          <Box p="4" style={{ textAlign: "center" }}>
            <Text size="2" color="gray">
              No pastes yet
            </Text>
          </Box>
        ) : (
          <Flex direction="column">
            {list.map((paste, index) => (
              <Box key={paste.id}>
                <Link
                  to={`/${paste.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Box
                    p="3"
                    style={{
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    className="paste-item"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--gray-3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Flex direction="column" gap="2">
                      {/* Title */}
                      <Text
                        size="2"
                        weight="medium"
                        style={{
                          color: "var(--gray-12)",
                          lineHeight: "1.3",
                        }}
                      >
                        {paste.title || "Untitled"}
                      </Text>

                      {/* Preview text */}
                      <Text
                        size="1"
                        style={{
                          color: "var(--gray-11)",
                          lineHeight: "1.4",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {truncateText(paste.text)}
                      </Text>

                      {/* Meta info */}
                      <Flex justify="between" align="center" mt="1">
                        <Flex align="center" gap="1">
                          <ClockIcon
                            width="12"
                            height="12"
                            color="var(--gray-9)"
                          />
                          <Text size="1" color="gray">
                            {formatTimeAgo(paste.createdAt)}
                          </Text>
                        </Flex>

                        <Flex align="center" gap="1">
                          <CodeIcon
                            width="12"
                            height="12"
                            color="var(--gray-9)"
                          />
                          <Badge
                            variant="outline"
                            size="1"
                            style={{ fontSize: "10px" }}
                          >
                            {paste.syntax || "txt"}
                          </Badge>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Box>
                </Link>
                {index < list.length - 1 && <Separator size="4" />}
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
