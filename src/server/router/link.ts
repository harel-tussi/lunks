import { createProtectedRouter } from "./context";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const linkRouter = createProtectedRouter()
  .query("getAllBySiteId", {
    input: z.object({ siteId: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.link.findMany({
        where: { siteId: input.siteId },
      });
    },
  })
  .query("getOne", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.link.findUnique({
        where: { id: input.id },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      siteId: z.string(),
      to: z.string(),
      title: z.string(),
      description: z.string().nullish(),
      icon: z.string().nullish(),
      active: z.boolean().default(false),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.link.create({
        data: {
          userId: ctx.session.user.id,
          ...input,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      updates: z.object({
        title: z.string(),
        description: z.string().nullish(),
        icon: z.string().nullish(),
        active: z.boolean(),
      }),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.link.updateMany({
        where: {
          id: input.id,
          AND: {
            userId: ctx.session.user.id,
          },
        },
        data: input.updates,
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.link.deleteMany({
        where: {
          id: input.id,
          AND: {
            userId: ctx.session.user.id,
          },
        },
      });
    },
  });
