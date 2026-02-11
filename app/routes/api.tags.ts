import { type LoaderFunctionArgs } from "react-router";
import { getSuggestedTags } from "~/db/queries";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  // Don't search for empty or extremely short strings to keep things snappy
  if (!q || q.trim().length < 1) {
    return [];
  }

  try {
    const suggestions = await getSuggestedTags(q.trim());

    // Return a simple array of tag names/normalized for the UI to consume
    return suggestions.map((tag) => ({
      name: tag.name,
      normalized: tag.normalized,
      count: tag.count,
    }));
  } catch (error) {
    console.error("Error fetching tag suggestions:", error);
    return [];
  }
}
