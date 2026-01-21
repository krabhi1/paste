import type { Route } from ".react-router/types/app/components/layout/+types/PublicLayout";
import { Outlet, Link } from "react-router";
import { getLatestPastes } from "~/db/queries";
import type { Paste } from "~/db/schema";
import { ClockIcon, FileTextIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";

export async function loader({ request }: Route.LoaderArgs) {
  const pasteList = await getLatestPastes(10);
  return { pasteList };
}

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
  const { pasteList } = loaderData;
  return (
    <div className="flex flex-col lg:flex-row flex-1 lg:min-h-0 gap-6 lg:gap-8 max-w-screen-xl mx-auto w-full px-4 md:px-6">
      {/* Content Area: Independent scroll on desktop, natural on mobile */}
      <div className="flex-1 lg:min-h-0 lg:overflow-auto">
        <Outlet />
      </div>

      {/* Sidebar: Natural flow on mobile, fixed/scrollable on desktop */}
      <aside className="w-full lg:w-72 flex-shrink-0 lg:h-full lg:overflow-hidden pb-12 lg:pb-0 border-t lg:border-t-0 lg:border-l border-border/40">
        <PublicList list={pasteList} />
      </aside>
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

  return (
    <div className="flex flex-col lg:h-full">
      {/* Sidebar Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <FileTextIcon className="w-4 h-4 text-muted-foreground/60" />
          <h3 className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase">
            Recent Activity
          </h3>
        </div>
      </div>

      <div className="flex-1">
        {list.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {list.map((paste, index) => (
              <div key={paste.id}>
                <Link
                  to={`/${paste.id}`}
                  className="no-underline text-inherit group"
                >
                  <div className="p-4 cursor-pointer transition-all hover:bg-accent/30 lg:hover:bg-accent/20">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                        {paste.title || "Untitled Paste"}
                      </p>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-3 h-3 text-muted-foreground/70" />
                        <span className="text-[11px] font-medium text-muted-foreground/70">
                          {formatTimeAgo(paste.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {index < list.length - 1 && (
                  <Separator className="mx-4 opacity-40" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
