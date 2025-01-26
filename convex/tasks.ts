import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllTasks = query({
    handler: async (ctx) => {
        const userId = await ctx.auth.getUserIdentity();

        if( !userId ) {
            throw new ConvexError("Not authorized");
        }

        const tasks = await ctx.db.query("tasks")
            .withIndex("by_user_id", (q) => q.eq("userId", userId.subject))
            .order("desc")
            .collect();
        return tasks;
    }
})

export const createTask = mutation({
    args: {
        title: v.string(),
        completed: v.boolean(),
        dueDate: v.number(),
        priority: v.union(
            v.literal("low"),
            v.literal("medium"),
            v.literal("high"),
        )
    },
    handler: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();

        if( !userId ) {
            throw new ConvexError("Not authorized");
        }

        await ctx.db.insert("tasks", {
            ...args,
            userId: userId.subject,
        });
    }
})


export const updateCompletion = mutation({
    args: {
        id: v.id("tasks"),
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();

        if( !userId ) {
            throw new ConvexError("Not authorized");
        }

        await ctx.db.patch(args.id, { completed: args.completed });
    }
})

export const deleteTask = mutation({
    args: {
        id: v.id("tasks"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
})