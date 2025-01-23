import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { ConvexError } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const sendMessage = action({
  args: {
    message: v.string(),
    chatId: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }
    const userId = identity.subject;

    // Get relevant context from notes using vector search
    const embedding = await embed(args.message);
    const relevantNotes = await ctx.vectorSearch("notes", "by_embedding", {
      vector: embedding,
      limit: 5,
      filter: (q) => q.eq("userId", userId),
    });

    // Prepare context from relevant notes
    const context = relevantNotes
      .map((note) => `${note.title}\n${note.content}`)
      .join("\n\n");

    // Prepare chat history
    let chatHistory: { role: "user" | "assistant"; content: string }[] = [];
    if (args.chatId) {
      const chat = await ctx.db.get(args.chatId);
      if (chat) {
        chatHistory = chat.messages;
      }
    }

    // Generate AI response
    const chat = model.startChat({
      history: chatHistory.map(msg => ({
        role: msg.role,
        parts: msg.content,
      })),
    });

    const prompt = `Context from your notes:\n${context}\n\nUser message: ${args.message}`;
    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    // Store the conversation
    const timestamp = Date.now();
    const newMessages = [
      ...chatHistory,
      { role: "user", content: args.message, timestamp },
      { role: "assistant", content: response, timestamp },
    ];

    let chatId = args.chatId;
    if (!chatId) {
      chatId = await ctx.db.insert("chats", {
        userId,
        messages: newMessages,
        title: args.message.slice(0, 100), // Use first message as title
      });
    } else {
      await ctx.db.patch(chatId, {
        messages: newMessages,
      });
    }

    return { chatId, response };
  },
});

export const listChats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();
  },
});

export const getChat = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new ConvexError("Chat not found");
    }
    return chat;
  },
}); 