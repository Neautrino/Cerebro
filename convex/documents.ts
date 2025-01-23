import { ConvexError, v } from "convex/values";
import { action, internalAction, internalMutation, mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { embed } from "./notes";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getDocuments = query({
    handler: async (ctx) => {

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }
        const documents = await ctx.db.query("documents")
            .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
            .collect();
        return documents;
    }
})

export const getDocumentById = query({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {

        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new ConvexError("Not a user");
        }

        const document = await ctx.db.get(args.id);

        if (!document) {
            throw new ConvexError("Document not found");
        }

        if (document.userId !== userId.subject) {
            throw new ConvexError("Not authorized");
        }

        return {
            ...document,
            fileUrl: document.fileId ? await ctx.storage.getUrl(document.fileId) : null,
        };
    }
})

export const setDocumentEmbedding = internalMutation({
    args: {
        documentId: v.id("documents"),
        embedding: v.array(v.float64())
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.documentId, { embedding: args.embedding });
    }
})

export const createDocumentEmbedding = internalAction({
    args: {
        documentId: v.id("documents"),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const embedding = await embed(args.content);

        await ctx.runMutation(internal.documents.setDocumentEmbedding, {
            documentId: args.documentId,
            embedding: embedding
        });
    }
})

export const createDocument = mutation({
    args: {
        title: v.string(),
        content: v.optional(v.string()),
        fileId: v.id("_storage"),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const documentId = await ctx.db.insert("documents", {
            title: args.title,
            content: args.content,
            fileId: args.fileId,
            userId: user.subject,
            updatedTime: Date.now(),
            tags: args.tags
        });

        let generatedContent = args.content;

        if (args.content === undefined) {
            generatedContent =  await ctx.scheduler.runAfter(0, api.documents.askQuestion, {
                question: "Generate a summary of the document",
                documentId: documentId
            });

            await ctx.db.patch(documentId, { content: generatedContent });
        }

        await ctx.scheduler.runAfter(0, internal.documents.createDocumentEmbedding, {
            documentId: documentId,
            content: generatedContent ?? ""
        });

        return documentId;
    },
});

export const updateDocument = mutation({
    args: {
        id: v.id("documents"),
        title: v.string(),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, { title: args.title, content: args.content });
    },
});

export const deleteDocument = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const document = await ctx.db.get(args.id);
        if (!document) {
            throw new ConvexError("Document not found");
        }

        if (document.userId !== user.subject) {
            throw new ConvexError("Not authorized");
        }

        const file = await ctx.db.system.get(document.fileId);

        if (file) {
            await ctx.storage.delete(document.fileId);
        }

        return await ctx.db.delete(args.id);
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const getFile = query({
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
        documentId: v.id("documents"),
    },
    handler: async (ctx, args) => {

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new ConvexError("Not authorized");
        }

        const document = await ctx.runQuery(api.documents.getDocumentById, { id: args.documentId });

        if (!document) {
            throw new ConvexError("Document not found");
        }

        if (!document.fileId) {
            throw new ConvexError("File ID not found");
        }

        const file = await ctx.storage.get(document.fileId);

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

            `Take the given file and understand it properly. ${document.content} This is some additional context. Don't give any response regarding the file unless i asked anything about it. You need to only answer the following question: ${args.question} and interact well try to act friendly.`,
        ]);
        return result.response.text()
    }
})