import { Outlet } from "react-router";
import RootHeader from "~/components/layout/RootHeader";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky header stays at the top of the viewport */}
      <div className="sticky top-0 z-50">
        <RootHeader />
      </div>

      {/* Main content area grows naturally with the page */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
