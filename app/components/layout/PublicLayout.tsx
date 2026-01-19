import type { Route } from ".react-router/types/app/components/layout/+types/PublicLayout";
import { Outlet, Link } from "react-router";
import { getLatestPastes } from "~/db/queries";
import type { Paste } from "~/db/schema";
import { ClockIcon, CodeIcon, FileTextIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export async function loader({ request }: Route.LoaderArgs) {
  const pasteList = await getLatestPastes(10);
  return { pasteList };
}
export default function PublicLayout({ loaderData }: Route.ComponentProps) {
  const { pasteList } = loaderData;
  return (
    <div className="flex flex-grow min-h-0 gap-4">
      <Outlet />
      <div className="w-72 flex-shrink-0 overflow-hidden">
        <PublicList list={pasteList} />
      </div>
    </div>
  );
}

function PublicList({ list }: { list: Paste[] }) {
  const formatTimeAgo = (date: Date) => {
    if (isNaN(date.getTime())) return "Invalid date";

    const now = new Date();
    let diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

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
    <Card className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="px-2 ">
        <div className="flex items-center gap-2">
          <FileTextIcon className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-bold text-muted-foreground">
            Recent Pastes
          </h3>
        </div>
      </CardHeader>

      {/* List */}
      <CardContent className="flex-1 overflow-auto p-0">
        {list.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">No pastes yet</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {list.map((paste, index) => (
              <div key={paste.id}>
                <Link to={`/${paste.id}`} className="no-underline text-inherit">
                  <div className="p-3 cursor-pointer transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-1">
                      {/* Title */}
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {paste.title || "Untitled"}
                      </p>

                      {/* Meta info */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(paste.createdAt)}
                          </span>
                        </div>

                        {/*<div className="flex items-center gap-1">
                          <CodeIcon className="w-3 h-3 text-muted-foreground" />
                          <Badge
                            variant="outline"
                            className="text-[10px] h-4 px-1"
                          >
                            {paste.syntax || "txt"}
                          </Badge>
                        </div>*/}
                      </div>
                    </div>
                  </div>
                </Link>
                {index < list.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
