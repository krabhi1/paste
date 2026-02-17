import type { Route } from ".react-router/types/app/routes/+types/paste";
import {
  Copy,
  Calendar,
  User,
  Clock,
  Download,
  FileText,
  Flag,
  Check,
  Share2,
  WrapText,
  Tag as TagIcon,
} from "lucide-react";
import { getPasteById } from "~/db/queries";
import { renderMarkdown } from "~/lib/markdown.server";
import { useState } from "react";
import { useFetcher, data, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import type { Paste, Tag } from "~/db/schema";

export const meta: Route.MetaFunction = ({ data }) => {
  const typedData = data as
    | { paste: Paste & { tags: Tag[] }; markdownHtml?: string }
    | undefined;

  if (!typedData || !typedData.paste) {
    return [{ title: "Paste Not Found | Paste" }];
  }

  const title = typedData.paste.title || "Untitled Paste";
  const description =
    typedData.paste.text.slice(0, 150).replace(/\s+/g, " ").trim() +
    (typedData.paste.text.length > 150 ? "..." : "");

  return [
    { title: `${title} | Paste` },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary" },
  ];
};

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const { id } = params;
  // We only care about the URL, not the user's cookies/headers
  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString(), {
    method: "GET",
  });
  // @ts-ignore
  const cache = caches.default;

  //  Check Cache
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    const cachedData = (await cachedResponse.json()) as {
      paste: Paste & { tags: Tag[] };
      markdownHtml?: string;
    };
    // If it's markdown but HTML is missing (stale cache), continue to generate it
    if (cachedData.paste.syntax !== "markdown" || cachedData.markdownHtml) {
      return cachedData;
    }
  }
  // Fetch from DB
  const paste = await getPasteById(id!);
  if (!paste) {
    throw new Response("Not Found", { status: 404 });
  }

  let markdownHtml: string | undefined;
  if (paste.syntax === "markdown") {
    markdownHtml = await renderMarkdown(paste.text);
  }

  const data = { paste, markdownHtml };

  // Background Cache Write
  // We use waitUntil so the response is sent to the user immediately
  // while the cache write happens in the background.
  const responseToCache = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=604800", // s-maxage is for shared caches (Cloudflare)
    },
  });

  context.cloudflare.ctx.waitUntil(cache.put(cacheKey, responseToCache));

  return data;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "report") {
    // In a real app, you'd save the report to a database
    console.log("Report received for paste");
    return { success: true, message: "Paste reported successfully." };
  }

  return data({ success: false }, { status: 400 });
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { paste, markdownHtml } = loaderData;
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isWrapped, setIsWrapped] = useState(paste.syntax === "plaintext");
  const [viewMode, setViewMode] = useState<"code" | "preview">(
    paste.syntax === "markdown" ? "preview" : "code",
  );
  const fetcher = useFetcher();

  const isReported = fetcher.data?.success;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([paste.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const extension =
      paste.syntax === "plaintext" ? "txt" : paste.syntax || "txt";
    a.href = url;
    a.download = `${paste.title || "paste"}-${paste.id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div className="w-full flex-grow p-3 sm:p-6 bg-background">
      <div className="max-w-6xl mx-auto w-full lg:h-full lg:flex lg:flex-col">
        {/* Header Section */}
        <div className="mb-6 px-1">
          <h1 className="text-xl sm:text-3xl font-bold break-words  mb-4">
            {paste.title}
          </h1>

          {/* Metadata Grid */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">
                <span className="font-semibold text-foreground/70">
                  Created:
                </span>{" "}
                {formatDate(paste.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {paste.text.length} chars
              </span>
            </div>

            {paste.expiresAt && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">
                  <span className="font-semibold text-foreground/70">
                    Expires:
                  </span>{" "}
                  {formatDate(paste.expiresAt)}
                </span>
              </div>
            )}
          </div>

          {/* Tags Section */}
          {paste.tags && paste.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {paste.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/search?tags=${tag.normalized}`}
                  className="no-underline"
                >
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Separator className="mb-6 opacity-50" />

        {/* Code View with Toolbar */}
        <Card className="lg:flex-grow lg:flex lg:flex-col lg:min-h-0 py-3">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between [.border-b]:pb-3  px-3 sm:px-4 border-b bg-card/50">
            <div className="flex justify-between w-full md:w-fit gap-3">
              <Badge
                variant="secondary"
                className="text-[10px] uppercase font-bold tracking-wider"
              >
                {paste.syntax || "plaintext"}
              </Badge>

              {paste.syntax === "markdown" && (
                <div className="flex items-center bg-muted rounded-md p-0.5 border border-border/50">
                  <button
                    onClick={() => setViewMode("code")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold uppercase tracking-tight rounded-sm transition-all",
                      viewMode === "code"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => setViewMode("preview")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold uppercase tracking-tight rounded-sm transition-all",
                      viewMode === "preview"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Preview
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {/* Copy Content */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy Content"
                className="size-8"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>

              {/* Share Link */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                title="Copy Link"
                className="size-8"
              >
                {shared ? (
                  <Check className="size-4" />
                ) : (
                  <Share2 className="size-4" />
                )}
              </Button>

              <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

              {/* Toggle Wrap */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWrapped(!isWrapped)}
                title={isWrapped ? "Disable Wrap" : "Enable Wrap"}
                className={cn(
                  "size-8",
                  isWrapped && "bg-accent text-accent-foreground",
                )}
              >
                <WrapText className="size-4" />
              </Button>

              <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

              {/* View Raw */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                title="View Raw"
                className="size-8"
              >
                <a href={`/raw/${paste.id}`} target="_blank" rel="noreferrer">
                  <FileText className="size-4" />
                </a>
              </Button>

              {/* Download */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                title="Download"
                className="size-8"
              >
                <Download className="size-4" />
              </Button>

              {/* Report */}
              <fetcher.Form method="post" className="flex">
                <input type="hidden" name="intent" value="report" />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isReported || fetcher.state !== "idle"}
                  title={isReported ? "Reported" : "Report"}
                  className={`size-8 ${isReported ? "text-primary" : "hover:text-destructive"}`}
                >
                  <Flag className="size-4 fill-current" />
                </Button>
              </fetcher.Form>
            </div>
          </CardHeader>

          <CardContent className="lg:flex-grow p-0 bg-card/30 max-h-[70vh] overflow-y-auto">
            {viewMode === "preview" && markdownHtml ? (
              <div
                className="p-4 sm:p-8 prose prose-sm sm:prose-base dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-muted/50 prose-pre:border"
                dangerouslySetInnerHTML={{ __html: markdownHtml }}
              />
            ) : (
              <pre
                className={cn(
                  "p-4 sm:p-6 font-mono text-sm leading-relaxed text-foreground bg-transparent border-none m-0 selection:bg-primary/20",
                  isWrapped
                    ? "whitespace-pre-wrap break-words"
                    : "whitespace-pre overflow-x-auto",
                )}
              >
                {paste.text}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
