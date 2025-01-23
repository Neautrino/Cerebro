import { ConvexError, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { action } from "./_generated/server";
import { embed } from "./notes";
import { api } from "./_generated/api";

export const searchAllRecords = action({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new ConvexError("Not authorized");
    }

    const embedding = await embed(args.search);

    const noteResults = await ctx.vectorSearch("notes", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq("userId", userId.subject),
    });

    const documentResults = await ctx.vectorSearch("documents", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq("userId", userId.subject),
    });

    const linkResults = await ctx.vectorSearch("links", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq("userId", userId.subject),
    });

    const tweetResults = await ctx.vectorSearch("tweets", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq("userId", userId.subject),
    });

    const records: (
      | { type: "note", data: Doc<"notes"> }
      | { type: "document", data: Doc<"documents"> }
      | { type: "link", data: Doc<"links"> }
      | { type: "tweet", data: Doc<"tweets"> }
    )[] = [];

    await Promise.all(noteResults.map(async (result) => {
      const note = await ctx.runQuery(api.notes.getNoteById, { id: result._id });
      if(!note) return;
      records.push({ type: "note", data: note });
    }))

    await Promise.all(documentResults.map(async (result) => {
      const document = await ctx.runQuery(api.documents.getDocumentById, { id: result._id });
      if(!document) return;
      records.push({ type: "document", data: document });
    }))

    await Promise.all(linkResults.map(async (result) => {
      const link = await ctx.runQuery(api.links.getLinkById, { id: result._id });
      if(!link) return;
      records.push({ type: "link", data: link });
    }))

    await Promise.all(tweetResults.map(async (result) => {
      const tweet = await ctx.runQuery(api.tweets.getTweetById, { id: result._id });
      if(!tweet) return;
      records.push({ type: "tweet", data: tweet });
    }))

    return records;
  },
});
