import type { Route } from ".react-router/types/app/routes/+types/raw";
import { getPasteById } from "~/db/queries";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;

  if (!id) {
    throw new Response("ID is required", { status: 400 });
  }

  const paste = await getPasteById(id);

  if (!paste) {
    throw new Response("Paste not found", { status: 404 });
  }

  return new Response(paste.text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
