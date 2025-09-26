import { Outlet } from "react-router";
import RootHeader from "~/components/layout/RootHeader";

export default function RootLayout() {
  return (
    <div className="fixed left-0 top-0 h-full w-full flex flex-col p-5 bg-gray-50 gap-2">
      <RootHeader />
      <Outlet />
    </div>
  );
}
