import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Paste" },
    { name: "description", content: "Share text with anyone" },
  ];
}
export async function action({ request, context }: Route.ActionArgs) {}
export function loader({}: Route.LoaderArgs) {}
export default function Page({}: Route.ComponentProps): React.ReactNode {
  return null;
}
