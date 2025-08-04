import { postRouter } from "~/server/api/routers/post";
import { cvRouter } from "~/server/api/routers/cv"; // ← Add this
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  cv: cvRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
