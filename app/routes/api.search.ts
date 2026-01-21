import { type LoaderFunctionArgs } from "react-router";
import { getSearchSuggestions } from "~/db/queries";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  // Don't search for empty or extremely short strings to keep things snappy
  if (!q || q.trim().length < 1) {
    return [];
  }

  try {
    const suggestions = await getSearchSuggestions(q.trim());
    return suggestions;
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return [];
  }
}
