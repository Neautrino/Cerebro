import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  }).index("by_user_id", ["userId"]),

  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    completed: v.boolean(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
    ),
  }).index("by_user_id", ["userId"]),

  documents: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    fileId: v.id("_storage"),
    tags: v.optional(v.array(v.string())),
    updatedTime: v.number(),
  }).index("by_user_id", ["userId"]),

  links: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    url: v.string(),
    tags: v.optional(v.array(v.string())),
  }).index("by_user_id", ["userId"]),

  tweets: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    url: v.string(),
    tags: v.optional(v.array(v.string())),
  }).index("by_user_id", ["userId"]),

  tags: defineTable({
    name: v.string(),
  }),
});