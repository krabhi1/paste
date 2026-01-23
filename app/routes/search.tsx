import {
  useLoaderData,
  useSearchParams,
  Link,
  useFetcher,
  useNavigate,
  Await,
} from "react-router";
import type { Route } from ".react-router/types/app/routes/+types/search";
import { searchPastes } from "~/db/queries";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Clock,
  FileCode,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
  Inbox,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const syntax = url.searchParams.get("syntax") || "all";
  const time = url.searchParams.get("time") || "all";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 20; // High density list

  let fromDate: Date | undefined;
  if (time !== "all") {
    fromDate = new Date();
    if (time === "1h") fromDate.setHours(fromDate.getHours() - 1);
    else if (time === "24h") fromDate.setHours(fromDate.getHours() - 24);
    else if (time === "7d") fromDate.setDate(fromDate.getDate() - 7);
    else if (time === "30d") fromDate.setDate(fromDate.getDate() - 30);
  }

  const resultsPromise = searchPastes(
    { query: q, syntax, from: fromDate },
    page,
    limit,
  );

  return {
    resultsPromise,
    query: q,
    activeSyntax: syntax,
    activeTime: time,
  };
}

export default function SearchPage() {
  const {
    resultsPromise,
    query: initialQuery,
    activeSyntax,
    activeTime,
  } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = (fetcher.data as any[]) || [];
  const isLoadingSuggestions = fetcher.state === "loading";

  useEffect(() => {
    setLocalQuery(initialQuery);
  }, [initialQuery]);

  // Trigger search suggestions
  useEffect(() => {
    if (localQuery.trim().length > 0) {
      // Don't show suggestions if the query matches the current results
      if (localQuery === initialQuery) {
        setIsOpen(false);
        return;
      }
      fetcher.load(`/api/search?q=${encodeURIComponent(localQuery)}`);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [localQuery, initialQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: localQuery.trim(), page: "1" });
  };

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") newParams.delete(key);
      else newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const d = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60),
    );
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSnippet = (text: string, q: string) => {
    if (!q.trim()) return null;
    const cleanText = text.replace(/\s+/g, " ");
    const index = cleanText.toLowerCase().indexOf(q.toLowerCase());
    if (index === -1) return null;

    const start = Math.max(0, index - 40);
    const end = Math.min(cleanText.length, index + q.length + 40);

    const prefix = start > 0 ? "..." : "";
    const suffix = end < cleanText.length ? "..." : "";

    return {
      before: prefix + cleanText.substring(start, index),
      match: cleanText.substring(index, index + q.length),
      after: cleanText.substring(index + q.length, end) + suffix,
    };
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-10 flex flex-col gap-8">
      {/* Search Input Section */}
      <div className="flex flex-col gap-6">
        <div className="relative" ref={containerRef}>
          <form onSubmit={handleSearch} className="relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() =>
                localQuery.trim().length > 0 &&
                localQuery !== initialQuery &&
                setIsOpen(true)
              }
              placeholder="Search by title or content..."
              className="pl-12 py-5 text-lg rounded-xl border-border bg-card/40 focus-visible:ring-primary/20 transition-all"
              autoComplete="off"
            />
            <div
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${isLoadingSuggestions ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/30" />
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {isOpen && localQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="p-1">
                {suggestions.length > 0 ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                        Quick Matches
                      </p>
                    </div>
                    {suggestions.map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setLocalQuery("");
                          setIsOpen(false);
                          navigate(`/${item.id}`);
                        }}
                        className="flex flex-col w-full px-3 py-2.5 text-sm text-left rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium truncate mr-2">
                            {item.title || "Untitled Paste"}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[9px] font-bold lowercase opacity-60 px-1.5 h-4 bg-accent/50"
                          >
                            {item.syntax}
                          </Badge>
                        </div>
                        {item.matchType === "content" && item.snippet && (
                          <div className="mt-1.5 px-2 py-1 rounded border border-primary/10 text-[10px] font-mono text-muted-foreground truncate w-full bg-primary/[0.02]">
                            {(() => {
                              const q = localQuery.trim().toLowerCase();
                              const text = item.snippet;
                              const index = text.toLowerCase().indexOf(q);
                              if (index === -1) return text;
                              return (
                                <>
                                  {text.substring(0, index)}
                                  <span className="text-primary font-bold">
                                    {text.substring(index, index + q.length)}
                                  </span>
                                  {text.substring(index + q.length)}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </button>
                    ))}
                    <div className="border-t border-border/40 my-1" />
                    <button
                      onClick={handleSearch}
                      className="flex items-center w-full px-3 py-2 text-xs font-semibold text-primary hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                    >
                      Search for "{localQuery}"
                    </button>
                  </>
                ) : !isLoadingSuggestions ? (
                  <div className="px-3 py-6 text-sm text-center text-muted-foreground">
                    No matches found
                  </div>
                ) : (
                  <div className="px-3 py-6 text-sm text-center text-muted-foreground">
                    Searching...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-6 border-b pb-6 border-border/50">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-foreground/80 whitespace-nowrap">
              Language
            </label>
            <Select
              value={activeSyntax}
              onValueChange={(v) => updateParams({ syntax: v, page: "1" })}
            >
              <SelectTrigger className="h-9 w-[160px] text-sm bg-card border-border/80">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="plaintext">Plain Text</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-foreground/80 whitespace-nowrap">
              Posted
            </label>
            <Select
              value={activeTime}
              onValueChange={(v) => updateParams({ time: v, page: "1" })}
            >
              <SelectTrigger className="h-9 w-[160px] text-sm bg-card border-border/80">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any time</SelectItem>
                <SelectItem value="1h">Past Hour</SelectItem>
                <SelectItem value="24h">Past 24 Hours</SelectItem>
                <SelectItem value="7d">Past 7 Days</SelectItem>
                <SelectItem value="30d">Past 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto">
            <Suspense fallback={<Skeleton className="h-4 w-24" />}>
              <Await resolve={resultsPromise}>
                {(resolved) => (
                  <p className="text-sm font-medium text-muted-foreground">
                    <span className="text-foreground font-semibold">
                      {resolved.total}
                    </span>{" "}
                    results found
                  </p>
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex flex-col min-h-[400px]">
        <Suspense fallback={<SearchPageSkeleton />}>
          <Await resolve={resultsPromise}>
            {(resolved) => (
              <>
                {resolved.results.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                    <Inbox className="w-12 h-12 mb-4 opacity-10" />
                    <p className="text-base font-medium">
                      No results found for this search
                    </p>
                    <Button
                      variant="link"
                      className="mt-2 text-primary font-semibold"
                      onClick={() => {
                        setLocalQuery("");
                        updateParams({
                          q: "",
                          syntax: "all",
                          time: "all",
                          page: "1",
                        });
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {resolved.results.map((paste) => (
                      <Link
                        key={paste.id}
                        to={`/${paste.id}`}
                        className="group flex items-center justify-between py-4 px-2 transition-colors hover:bg-primary/[0.02]"
                      >
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {paste.title || "Untitled Paste"}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="h-5 px-2 text-[10px] font-bold lowercase tracking-tight shrink-0 bg-accent/50 text-muted-foreground"
                            >
                              {paste.syntax}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formatTimeAgo(paste.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FileCode className="w-3.5 h-3.5" />
                              {(paste.text.length / 1024).toFixed(1)} KB
                            </span>
                          </div>

                          {initialQuery &&
                            getSnippet(paste.text, initialQuery) && (
                              <div className="mt-2 px-2.5 py-1.5  rounded-md border border-primary/10 text-[11px] font-mono text-muted-foreground truncate w-full">
                                {(() => {
                                  const s = getSnippet(
                                    paste.text,
                                    initialQuery,
                                  )!;
                                  return (
                                    <>
                                      {s.before}
                                      <span className="text-primary font-bold px-0.5">
                                        {s.match}
                                      </span>
                                      {s.after}
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination Section */}
                {resolved.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-8 py-10 border-t border-border/40">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={resolved.page <= 1}
                      onClick={() =>
                        updateParams({ page: (resolved.page - 1).toString() })
                      }
                      className="font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-foreground font-bold">
                        {resolved.page}
                      </span>
                      <span className="text-muted-foreground/40">/</span>
                      <span className="text-muted-foreground">
                        {resolved.totalPages}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={resolved.page >= resolved.totalPages}
                      onClick={() =>
                        updateParams({ page: (resolved.page + 1).toString() })
                      }
                      className="font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="divide-y divide-border/60">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="py-4 px-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-1/3" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
