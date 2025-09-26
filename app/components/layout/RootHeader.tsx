import { SearchIcon, PlusIcon, BookIcon } from "lucide-react";
import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function RootHeader() {
  return (
    <div className="bg-card border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 mx-auto max-w-screen-xl">
        {/* Logo/Brand */}
        <Link to="/" className="no-underline">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-md p-1.5">
              <BookIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Paste
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm mx-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pastes..." className="pl-10 w-full" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/" className="no-underline">
            <Button variant="secondary" size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Paste
            </Button>
          </Link>

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
    </div>
  );
}
