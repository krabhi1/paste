import { Flex } from "@radix-ui/themes";
import type { Route } from "./+types/paste";
export async function loader({ request, params }: Route.LoaderArgs) {
  const { id } = params;
  return { id };
}
export default function Page({ loaderData }: Route.ComponentProps) {
  const { id } = loaderData;
  return (
    <Flex width={"100%"} height={"100%"}>
      hello
    </Flex>
  );
}
