import type { Route } from ".react-router/types/app/components/layout/+types/PublicLayout";
import { Outlet, Link, Await } from "react-router";
import { Suspense } from "react";
import { getLatestPastes } from "~/db/queries";
import type { Paste } from "~/db/schema";
import { ClockIcon, FileTextIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { formatRelativeTime } from "~/lib/utils";

export async function loader({ context }: Route.LoaderArgs) {
  const { paste: pasteKV } = context.cloudflare.env;
  const cacheList = (await pasteKV.get("latest_pastes", { type: "json" })) as
    | Paste[]
    | null;

  if (!cacheList) {
    const latestPastes = await getLatestPastes(10);
    context.cloudflare.ctx.waitUntil(
      pasteKV.put("latest_pastes", JSON.stringify(latestPastes)),
    );
    return {
      pasteList: latestPastes,
    };
  }

  return {
    pasteList: cacheList || [],
  };
}

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
  const { pasteList } = loaderData;
  return (
    <div className="flex flex-col lg:flex-row flex-1 gap-6 lg:gap-8 max-w-screen-xl mx-auto w-full px-4 md:px-6 py-4 md:py-6">
      {/* Main Content: Flows naturally with page scroll */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>

      {/* Sidebar: Sticky on desktop, flows below content on mobile */}
      <aside className="w-full lg:w-72 flex-shrink-0 pb-12 lg:pb-0">
        <div className="lg:sticky lg:top-[88px]">
          <PublicList list={pasteList} />
        </div>
      </aside>
    </div>
  );
}

function PublicListSkeleton() {
  return (
    <div className="flex flex-col bg-card/20 rounded-xl border border-border/40 overflow-hidden">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <FileTextIcon className="w-4 h-4 text-muted-foreground/40" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <div className="flex flex-col">
        {[...Array(8)].map((_, i) => (
          <div key={i}>
            <div className="px-4 py-2.5">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            {i < 7 && <Separator className="mx-4 opacity-40" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicList({ list }: { list: Paste[] }) {
  return (
    <div className="flex flex-col bg-card/20 rounded-xl border border-border/40 overflow-hidden">
      {/* Sidebar Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <FileTextIcon className="w-4 h-4 text-muted-foreground/60" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Recent
          </h3>
        </div>
      </div>

      <div className="flex flex-col">
        {list.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No recent pastes</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {list.map((paste, index) => (
              <div key={paste.id}>
                <Link
                  to={`/${paste.id}`}
                  className="no-underline text-inherit group"
                >
                  <div className="px-4 py-2.5 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                        {paste.title || "Untitled Paste"}
                      </p>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-3 h-3 text-muted-foreground/70" />
                        <span className="text-[11px] font-medium text-muted-foreground/70">
                          {formatRelativeTime(paste.createdAt)}
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
