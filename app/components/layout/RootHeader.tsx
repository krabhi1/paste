import { PlusIcon, BookIcon, SearchIcon, InfoIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";

export default function RootHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 mx-auto max-w-screen-xl">
        {/* Left Section: Logo */}
        <Link to="/" className="no-underline text-foreground shrink-0">
          <div className="flex items-center gap-2 group">
            <div className="rounded-md p-1.5 bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <BookIcon className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Paste</span>
          </div>
        </Link>

        {/* Right Section: Navigation & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/search"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === "/search"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <SearchIcon
                className={`w-4 h-4 ${location.pathname === "/search" ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={` sm:inline ${location.pathname === "/search" ? "text-primary font-semibold" : ""}`}
              >
                Search
              </span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === "/about"
                  ? "text-primary  font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <span
                className={`sm:inline ${location.pathname === "/about" ? "text-primary font-semibold" : ""}`}
              >
                About
              </span>
            </Link>
          </nav>

          {!isHome && (
            <div className="flex items-center ml-1 sm:ml-2 border-l pl-2 sm:pl-4 border-border/50">
              <Link to="/" className="no-underline">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 px-3 sm:px-4 shadow-none border group"
                >
                  <PlusIcon className="w-4 h-4 sm:mr-2 transition-transform group-hover:rotate-90" />
                  <span className="hidden sm:inline">New</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
