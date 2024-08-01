import { ConvexError, v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    if (!args.clerkId) return;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      return;
    }

    return user;
  },
});

// this query is used to get the top user by podcast count. first the podcast is sorted by views and then the user is sorted by total podcasts, so the user with the most podcasts will be at the top.
export const getTopUserByPodcastCount = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();

    const usersData = await Promise.all(
      users.map(async (u) => {
        const podcasts = await ctx.db
          .query("podcasts")
          .filter((q) => q.eq(q.field("authorId"), u.clerkId))
          .collect();

        const sortedPodcasts = podcasts
          ?.map((podcast) => ({
            ...podcast,
            views: podcast.viewedBy.length || 0,
          }))
          .sort((a, b) => b.views - a.views);

        return {
          ...u,
          totalPodcasts: podcasts.length,
          podcast: sortedPodcasts.map((p) => ({
            podcastTitle: p.podcastTitle,
            podcastId: p._id,
          })),
        };
      })
    );

    return usersData
      ?.filter(
        (podcaster) =>
          podcaster.clerkId !== args.clerkId && podcaster.totalPodcasts > 0
      )
      ?.sort((a, b) => b.totalPodcasts - a.totalPodcasts);
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    let firstName, lastName;

    const name = args.name.split(" ");
    if (name.length === 1) {
      firstName = name[0];
      lastName = "";
    } else {
      firstName = name[0];
      lastName = name.slice(1).join(" ");
    }

    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
      firstName,
      lastName,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    let firstName, lastName;

    const name = args.name.split(" ");
    if (name.length === 1) {
      firstName = name[0];
      lastName = "";
    } else {
      firstName = name[0];
      lastName = name.slice(1).join(" ");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
      name: args.name,
      firstName,
      lastName,
    });

    const podcast = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.clerkId))
      .collect();

    await Promise.all(
      podcast.map(async (p) => {
        await ctx.db.patch(p._id, {
          authorImageUrl: args.imageUrl,
        });
      })
    );
  },
});

export const deleteUser = mutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const allPodcasts = await ctx.db.query("podcasts").collect();
    const userPodcasts = allPodcasts.filter((p) => p.authorId === user.clerkId);
    const followedPodcasts = allPodcasts.filter((p) =>
      p.viewedBy.includes(user._id)
    );

    if (userPodcasts.length > 0) {
      await Promise.all(
        userPodcasts.map(async (p) => {
          if (p.audioStorageId) await ctx.storage.delete(p.audioStorageId);
          if (p.imageStorageId) await ctx.storage.delete(p.imageStorageId);

          await ctx.db.delete(p._id);
        })
      );
    }

    if (followedPodcasts.length > 0) {
      await Promise.all(
        followedPodcasts.map(async (p) => {
          if (p.audioStorageId)
            await ctx.db.patch(p._id, {
              viewedBy: p.viewedBy.filter((u) => u !== user._id),
            });
        })
      );
    }

    await ctx.db.delete(user._id);
  },
});

export const deleteUserInternal = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);

    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), user.clerkId))
      .collect();

    if (podcasts.length > 0) {
      await Promise.all(
        podcasts.map(async (p) => {
          if (p.audioStorageId) await ctx.storage.delete(p.audioStorageId);
          if (p.imageStorageId) await ctx.storage.delete(p.imageStorageId);

          await ctx.db.delete(p._id);
        })
      );
    }
  },
});

export const getFollowersByPodcastId = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    if (!args.podcastId) return;

    const podcast = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("_id"), args.podcastId))
      .unique();

    if (!podcast) {
      return;
    }

    const users = await Promise.all(
      podcast.viewedBy.map(async (user) => {
        return await ctx.db.get(user);
      })
    );

    return users;
  },
});
