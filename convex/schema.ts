import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  agents: defineTable({
    name: v.string(),
    description: v.string(),
    systemPrompt: v.string(),
    avatar: v.string(),
    gradient: v.string(),
    category: v.string(),
    questionnaireSteps: v.array(v.object({
      phase: v.string(),
      questions: v.array(v.string()),
    })),
  }),

  conversations: defineTable({
    userId: v.id("users"),
    agentId: v.id("agents"),
    currentPhase: v.number(),
    currentQuestion: v.number(),
    isComplete: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_agent", ["userId", "agentId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  userProgress: defineTable({
    userId: v.id("users"),
    agentId: v.id("agents"),
    completedPhases: v.number(),
    totalPhases: v.number(),
    insights: v.array(v.string()),
    lastSessionAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_agent", ["userId", "agentId"]),
});
