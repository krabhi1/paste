import { SearchIcon, PlusIcon, BookIcon } from "lucide-react";
import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function RootHeader() {
  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 mx-auto max-w-screen-xl">
        {/* Left Section: Equal buffer to ensure center centering */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="no-underline text-foreground">
            <div className="flex items-center gap-2">
              <div className="rounded-md p-1.5">
                <BookIcon className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold hidden sm:block tracking-tight">
                Paste
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Locked in the middle of the screen */}
        <div className="flex-shrink-0 w-full max-w-md px-2 sm:px-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pastes..." className="pl-10 w-full" />
          </div>
        </div>

        {/* Right Section: Equal buffer to ensure center centering */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <Link to="/" className="no-underline">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 sm:h-9 sm:w-auto sm:px-4 p-0"
            >
              <PlusIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">New Paste</span>
            </Button>
          </Link>

          {/* Hidden Browse/About links for clean look, easy to restore */}
          {/* <Link to="/search" className="no-underline">
            <Button variant="ghost" size="sm">
              Browse
            </Button>
          </Link>

          <Link to="/about" className="no-underline">
            <Button variant="ghost" size="sm">
              About
            </Button>
          </Link> */}
        </div>
      </div>
    </header>
  );
}
