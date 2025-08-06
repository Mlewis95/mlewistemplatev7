import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("pets", "routes/pets.tsx"),
  route("dog-walking", "routes/dog-walking.tsx")
] satisfies RouteConfig;
