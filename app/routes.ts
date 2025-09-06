import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("/:id", "routes/paste.tsx"),
  route("search", "routes/search.tsx"),
] satisfies RouteConfig;
