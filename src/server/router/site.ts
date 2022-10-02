import { createProtectedRouter } from "./context";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const siteRouter = createProtectedRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.site.findMany({
        where: { userId: ctx.session.user.id },
      });
    },
  })
  .query("get", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.site.findFirst({
        where: { userId: ctx.session.user.id, AND: { id: input.id } },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string().nullish(),
      description: z.string().nullish(),
      logo: z.string().nullish(),
      image: z.string().nullish(),
      imageBlurhash: z.string().nullish(),
      subdomain: z.string().nullish(),
      customDomain: z.string().nullish(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.site.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      updates: z.object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        logo: z.string().nullish(),
        image: z.string().nullish(),
        imageBlurhash: z.string().nullish(),
        subdomain: z.string().nullish(),
        customDomain: z.string().nullish(),
      }),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.site.updateMany({
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
      return await ctx.prisma.site.deleteMany({
        where: {
          id: input.id,
          AND: {
            userId: ctx.session.user.id,
          },
        },
      });
    },
  });
