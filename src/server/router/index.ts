// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { siteRouter } from "./site";
import { linkRouter } from "./link";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("site.", siteRouter)
  .merge("link.", linkRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
