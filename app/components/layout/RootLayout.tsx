import { Outlet } from "react-router";
import RootHeader from "~/components/layout/RootHeader";

export default function RootLayout() {
  return (
    <div className="fixed inset-0 flex flex-col p-2 sm:p-3 md:p-5 bg-background gap-2 overflow-hidden">
      <RootHeader />
      <main className="flex-1 min-h-0 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
