import { type LoaderFunctionArgs } from "react-router";
import { getSearchSuggestions } from "~/db/queries";
import { SearchSchema } from "~/lib/validations";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const validation = SearchSchema.safeParse({ q });
  if (!validation.success) {
    return [];
  }

  const query = validation.data.q;

  // Don't search for empty or extremely short strings to keep things snappy
  if (!query || query.trim().length < 1) {
    return [];
  }

  try {
    const suggestions = await getSearchSuggestions(query.trim());
    return suggestions;
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return [];
  }
}
