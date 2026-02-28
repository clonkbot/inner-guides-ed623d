import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getOrCreate = mutation({
  args: { agentId: v.id("agents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_user_and_agent", (q) =>
        q.eq("userId", userId).eq("agentId", args.agentId)
      )
      .first();

    if (existing) return existing._id;

    const agent = await ctx.db.get(args.agentId);
    if (!agent) throw new Error("Agent not found");

    const conversationId = await ctx.db.insert("conversations", {
      userId,
      agentId: args.agentId,
      currentPhase: 0,
      currentQuestion: 0,
      isComplete: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Send initial greeting
    const firstPhase = agent.questionnaireSteps[0];
    const greeting = `Welcome, seeker. I am ${agent.name}. ${agent.description}\n\nWe'll journey through ${agent.questionnaireSteps.length} phases together. Let's begin with **${firstPhase.phase}**.\n\n${firstPhase.questions[0]}`;

    await ctx.db.insert("messages", {
      conversationId,
      role: "assistant",
      content: greeting,
      createdAt: Date.now(),
    });

    return conversationId;
  },
});

export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
