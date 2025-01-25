import { ConvexError, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
// const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

// export const embed = async (content: string) => {
//   const result = await model.embedContent(content);
//   return result.embedding.values;
// }

const API_KEY = "Free-For-YT-Subscribers-@DevsDoCode-WatchFullVideo"
const BASE_URL = "https://api.ddc.xiolabs.xyz/v1"

const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL
})

export const embed = async (content: string) => {
    const response = await client.embeddings.create({
        model: "provider-4/text-embedding-3-large",
        input: content
    })
    return response.data[0].embedding
}

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

    const matchesSearch = (record: any) => {
      const searchLower = args.search.toLowerCase();
      return (
        record.title.toLowerCase().includes(searchLower) ||
        (record.content && record.content.toLowerCase().includes(searchLower)) ||
        (record.tags && record.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchLower)
        ))
      );
    };

    await Promise.all([
      ...noteResults.map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNoteById, { id: result._id });
        if (note && matchesSearch(note)) {
          records.push({ type: "note", data: note });
        }
      }),
      ...documentResults.map(async (result) => {
        const document = await ctx.runQuery(api.documents.getDocumentById, { id: result._id });
        if (document && matchesSearch(document)) {
          records.push({ type: "document", data: document });
        }
      }),
      ...linkResults.map(async (result) => {
        const link = await ctx.runQuery(api.links.getLinkById, { id: result._id });
        if (link && matchesSearch(link)) {
          records.push({ type: "link", data: link });
        }
      }),
      ...tweetResults.map(async (result) => {
        const tweet = await ctx.runQuery(api.tweets.getTweetById, { id: result._id });
        if (tweet && matchesSearch(tweet)) {
          records.push({ type: "tweet", data: tweet });
        }
      })
    ]);

    return records;
  },
});
