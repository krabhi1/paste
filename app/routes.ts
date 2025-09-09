import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("components/layout/RootLayout.tsx", [
    layout("components/layout/PublicLayout.tsx", [
      index("routes/home.tsx"),
      route("/:id", "routes/paste.tsx"),
    ]),
    route("about", "routes/about.tsx"),
    route("search", "routes/search.tsx"),
  ]),
] satisfies RouteConfig;
