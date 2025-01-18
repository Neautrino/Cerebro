import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getNotes = query({
    handler: async (ctx) => {

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }
        const documents = await ctx.db.query("notes")
            .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
            .collect();
        return documents;
    }
})

export const getNoteById = query({
    args: { id: v.id("notes") },
    handler: async (ctx, args) => {

        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new ConvexError("Not a user");
        }

        const note = await ctx.db.get(args.id);

        if (!note) {
            throw new ConvexError("Note not found");
        }

        if (note.userId !== userId.subject) {
            throw new ConvexError("Not authorized");
        }

        return {
            ...note,
            fileUrl: note.fileId ? await ctx.storage.getUrl(note.fileId) : null,
        };
    }
})

export const createNotes = mutation({
    args: {
        title: v.string(),
        content: v.optional(v.string()),
        fileId: v.optional(v.id("_storage")),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        console.log(user.subject);
        const document = await ctx.db.insert("notes", {
            title: args.title,
            content: args.content,
            fileId: args.fileId,
            userId: user.subject,
            updatedTime: Date.now(),
            tags: args.tags
        });
        return document;
    },
});

export const updateNotes = mutation({
    args: {
        id: v.id("notes"),
        title: v.string(),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, { title: args.title, content: args.content });
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const getMetadata = query({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.system.get(args.storageId);
    },
});

export const askQuestion = action({
    args: {
        question: v.string(),
        noteId: v.id("notes"),
    },
    handler: async (ctx, args) => {

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const note = await ctx.runQuery(api.notes.getNoteById, { id: args.noteId });

        if (!note) {
            throw new ConvexError("Note not found");
        }

        if (!note.fileId) {
            throw new ConvexError("File ID not found");
        }

        const file = await ctx.storage.get(note.fileId);

        if (!file) {
            throw new ConvexError("File not found");
        }

        const fileBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(fileBuffer);
        const base64String = btoa(String.fromCharCode(...uint8Array));

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                },
            },

            `Take the given file and understand it properly. ${note.content} This is some additional context. Don't give any response regarding the file unless i asked anything about it. You need to only answer the following question: ${args.question} and interact well try to act friendly.`,
        ]);
        return result.response.text()
    }
})