import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) return [];

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found");
    }

    const agent = await ctx.db.get(conversation.agentId);
    if (!agent) throw new Error("Agent not found");

    // Save user message
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: "user",
      content: args.content,
      createdAt: Date.now(),
    });

    // Calculate next question
    let { currentPhase, currentQuestion } = conversation;
    const phases = agent.questionnaireSteps;

    currentQuestion++;

    let response = "";
    let isComplete = false;

    if (currentQuestion >= phases[currentPhase].questions.length) {
      currentQuestion = 0;
      currentPhase++;

      if (currentPhase >= phases.length) {
        isComplete = true;
        response = `You've completed all ${phases.length} phases of our journey together. Take a moment to reflect on how far you've come.\n\nRemember: transformation isn't a destination—it's a continuous unfolding. The insights you've gained are seeds. Water them daily.\n\nYou can return anytime to explore deeper, or choose another guide for a different aspect of your growth. You are the author now. Write boldly.`;
      } else {
        const phase = phases[currentPhase];
        response = `Beautiful reflection. You've completed the **${phases[currentPhase - 1].phase}** phase.\n\nNow we enter **${phase.phase}**. This is where the work deepens.\n\n${phase.questions[0]}`;
      }
    } else {
      const phase = phases[currentPhase];
      const reflections = [
        "I hear you. Let me ask you this...",
        "That's a powerful insight. Going deeper...",
        "Thank you for your honesty. Consider this...",
        "You're doing important work here. Now...",
        "I sense there's more beneath the surface. Tell me...",
      ];
      const reflection = reflections[Math.floor(Math.random() * reflections.length)];
      response = `${reflection}\n\n${phase.questions[currentQuestion]}`;
    }

    // Save assistant response
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: "assistant",
      content: response,
      createdAt: Date.now(),
    });

    // Update conversation state
    await ctx.db.patch(args.conversationId, {
      currentPhase,
      currentQuestion,
      isComplete,
      updatedAt: Date.now(),
    });

    return { isComplete };
  },
});
