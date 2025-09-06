import type { Route } from "./+types/paste";
export async function loader({ request, params }: Route.LoaderArgs) {
  const { id } = params;
  return { id };
}
export default function Page({ loaderData }: Route.ComponentProps) {
  const { id } = loaderData;
  return <div>Paste {id}</div>;
}
