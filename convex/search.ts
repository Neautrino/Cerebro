import { ConvexError, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { action, internalQuery, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const embed = async (content: string) => {
  const result = await model.embedContent(content);
  return result.embedding.values;
}

// import OpenAI from "openai";

// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     baseURL: process.env.OPENAI_BASE_URL
// })

// export const embed = async (content: string) => {
//     const response = await client.embeddings.create({
//         model: "provider-4/text-embedding-3-large",
//         input: content
//     })
//     return response.data[0].embedding
// }

type SearchResult = 
  | { type: "note"; data: Doc<"notes">; score: number }
  | { type: "document"; data: Doc<"documents">; score: number }
  | { type: "link"; data: Doc<"links">; score: number }
  | { type: "tweet"; data: Doc<"tweets">; score: number };

export const searchAllRecords = action({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args): Promise<SearchResult[]> => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new ConvexError("Not authorized");
    }

    const embedding = await embed(args.search);
    const similarityThreshold = 0.7;

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

    const results: SearchResult[] = [];

    await Promise.all([
      ...noteResults
        .filter(result => result._score >= similarityThreshold)
        .map(async (result) => {
          const note = await ctx.runQuery(api.notes.getNoteById, { id: result._id });
          if (note) {
            results.push({ type: "note" as const, data: note, score: result._score });
          }
        }),
      ...documentResults
        .filter(result => result._score >= similarityThreshold)
        .map(async (result) => {
          const doc = await ctx.runQuery(api.documents.getDocumentById, { id: result._id });
          if (doc) {
            results.push({ type: "document" as const, data: doc, score: result._score });
          }
        }),
      ...linkResults
        .filter(result => result._score >= similarityThreshold)
        .map(async (result) => {
          const link = await ctx.runQuery(api.links.getLinkById, { id: result._id });
          if (link) {
            results.push({ type: "link" as const, data: link, score: result._score });
          }
        }),
      ...tweetResults
        .filter(result => result._score >= similarityThreshold)
        .map(async (result) => {
          const tweet = await ctx.runQuery(api.tweets.getTweetById, { id: result._id });
          if (tweet) {
            results.push({ type: "tweet" as const, data: tweet, score: result._score });
          }
        })
    ]);

    return results.sort((a, b) => b.score - a.score);
  },
});

export const getRecentRecords = query({
  args: {
    numRecords: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    type Record = 
      | { type: "note"; data: Doc<"notes"> }
      | { type: "document"; data: Doc<"documents"> }
      | { type: "link"; data: Doc<"links"> }
      | { type: "tweet"; data: Doc<"tweets"> };

    const records: Record[] = await ctx.runQuery(internal.search.getRecords, {
      userId: identity.subject,
      numRecords: args.numRecords,
    });

    return records;
  },
});

export const getRecords = internalQuery({
  args: { 
    userId: v.string(),
    numRecords: v.number(),
  },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const links = await ctx.db
      .query("links")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const tweets = await ctx.db
      .query("tweets")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    type Record = 
      | { type: "note"; data: Doc<"notes"> }
      | { type: "document"; data: Doc<"documents"> }
      | { type: "link"; data: Doc<"links"> }
      | { type: "tweet"; data: Doc<"tweets"> };

    const records: Record[] = [
      ...notes.map((note) => ({ type: "note" as const, data: note })),
      ...documents.map((doc) => ({ type: "document" as const, data: doc })),
      ...links.map((link) => ({ type: "link" as const, data: link })),
      ...tweets.map((tweet) => ({ type: "tweet" as const, data: tweet })),
    ];

    records.sort((a, b) => b.data._creationTime - a.data._creationTime);

    return records.slice(0, args.numRecords);
  },
});