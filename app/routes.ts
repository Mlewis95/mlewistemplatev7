import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("pets", "routes/pets.tsx"),
  route("dog-walking", "routes/dog-walking.tsx"),
  route("auth/login", "routes/auth.login.tsx"),
  route("auth/signup", "routes/auth.signup.tsx"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
