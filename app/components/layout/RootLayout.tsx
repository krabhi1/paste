import { Outlet } from "react-router";
import RootHeader from "~/components/layout/RootHeader";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen lg:fixed lg:inset-0 lg:overflow-hidden bg-background">
      <RootHeader />
      <main className="flex-1 lg:min-h-0 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
