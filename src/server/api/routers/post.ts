import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          name: input.name,
        })
        .returning();
      
      return newPost;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, input.id),
      });

      if (!post) {
        throw new Error("Not found");
      }

      return post;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(256),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          name: input.name,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, input.id))
        .returning();

      if (!updatedPost) {
        throw new Error("Not found");
      }

      return updatedPost;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [removedToDo] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      if (!removedToDo) {
        throw new Error("Not found");
      }

      return removedToDo;
    }),
});