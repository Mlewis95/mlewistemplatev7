import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("adoptable-pets", "routes/adoptable-pets.tsx"),
  route("adoptable-pets/dogs", "routes/adoptable-pets.dogs.tsx"),
  route("adoptable-pets/cats", "routes/adoptable-pets.cats.tsx"),
  route("volunteer/new", "routes/volunteer.new.tsx"),
  route("volunteer/signin", "routes/volunteer.signin.tsx")
] satisfies RouteConfig;
