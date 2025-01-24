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

  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    tags: v.optional(v.array(v.string())),
    updatedTime: v.number(),
    embedding: v.optional(v.array(v.float64())),
  }).index("by_user_id", ["userId"])
  .vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: ["userId"],
  }),

  documents: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
    fileId: v.id("_storage"),
    tags: v.optional(v.array(v.string())),
    updatedTime: v.number(),
    embedding: v.optional(v.array(v.float64())),
  }).index("by_user_id", ["userId"])
  .vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: ["userId"],
  }),

  links: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    url: v.string(),
    tags: v.optional(v.array(v.string())),
    updatedTime: v.number(),
    embedding: v.optional(v.array(v.float64())),
  }).index("by_user_id", ["userId"])
  .vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: ["userId"],
  }),

  tweets: defineTable({
    userId: v.string(),
    title: v.string(),
    author: v.optional(v.string()),
    content: v.string(),
    url: v.string(),
    updatedTime: v.number(),
    tags: v.optional(v.array(v.string())),
    embedding: v.optional(v.array(v.float64())),
  }).index("by_user_id", ["userId"])
  .vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: ["userId"],
  }),

  tags: defineTable({
    name: v.string(),
  }),

  chats: defineTable({
    userId: v.string(),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.number(),
    })),
    title: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
});