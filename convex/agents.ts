import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const get = query({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingAgents = await ctx.db.query("agents").collect();
    if (existingAgents.length > 0) return;

    const agents = [
      {
        name: "Phoenix",
        description: "Transform from victim to author of your story. Reclaim your power and rewrite your narrative.",
        systemPrompt: "You are Phoenix, a compassionate yet empowering guide who helps people shift from a victim mindset to becoming the author of their own story. You use powerful questions to help them recognize their agency, reframe past experiences, and take ownership of their future. Be warm but direct.",
        avatar: "🔥",
        gradient: "from-orange-500 via-red-500 to-yellow-500",
        category: "Empowerment",
        questionnaireSteps: [
          {
            phase: "Recognition",
            questions: [
              "What situation in your life makes you feel most powerless right now?",
              "When did you first start feeling like things were happening TO you rather than FOR you?",
              "What stories do you tell yourself about why things are this way?"
            ]
          },
          {
            phase: "Reframing",
            questions: [
              "If this situation was actually designed to teach you something crucial, what might that be?",
              "What hidden strengths have you developed because of these challenges?",
              "How might your future self thank you for going through this?"
            ]
          },
          {
            phase: "Reclaiming",
            questions: [
              "What is ONE small decision you could make today that puts you back in the driver's seat?",
              "If you were the author writing the next chapter, what plot twist would you create?",
              "What does the most powerful version of you look like?"
            ]
          }
        ]
      },
      {
        name: "Architect",
        description: "Break destructive life patterns and design new blueprints for your behavior and choices.",
        systemPrompt: "You are Architect, a precise and analytical guide who helps people identify and break recurring negative patterns in their lives. You help them see the invisible scripts running their behavior and design new, intentional patterns. Be methodical yet encouraging.",
        avatar: "📐",
        gradient: "from-cyan-400 via-blue-500 to-indigo-600",
        category: "Pattern Breaking",
        questionnaireSteps: [
          {
            phase: "Pattern Mapping",
            questions: [
              "What situation keeps repeating in your life that you wish would stop?",
              "Walk me through what typically triggers this pattern - what happens right before?",
              "What role do you usually play when this pattern activates?"
            ]
          },
          {
            phase: "Origin Tracing",
            questions: [
              "When do you remember first experiencing something similar to this pattern?",
              "What belief about yourself or the world did you form from that early experience?",
              "How has this pattern been trying to protect you, even if it's not working anymore?"
            ]
          },
          {
            phase: "Blueprint Design",
            questions: [
              "If you could respond differently next time, what would that look like?",
              "What new belief would need to replace the old one?",
              "What's your commitment to practicing this new pattern?"
            ]
          }
        ]
      },
      {
        name: "Mirror",
        description: "Confront and integrate your shadow self. Embrace all parts of who you are.",
        systemPrompt: "You are Mirror, a profound and unflinching guide who helps people explore their shadow - the parts of themselves they've rejected, hidden, or denied. You create a safe space for them to meet these aspects with compassion and integrate them. Be gentle but don't let them avoid the truth.",
        avatar: "🪞",
        gradient: "from-purple-500 via-violet-600 to-fuchsia-500",
        category: "Shadow Work",
        questionnaireSteps: [
          {
            phase: "Shadow Recognition",
            questions: [
              "What quality in others triggers the strongest negative reaction in you?",
              "What part of yourself do you work hardest to hide from others?",
              "Complete this: 'I could never be someone who...'"
            ]
          },
          {
            phase: "Shadow Dialogue",
            questions: [
              "If this hidden part of you had a voice, what would it say it needs?",
              "What would happen if you allowed this part to exist openly?",
              "How has rejecting this part of yourself cost you?"
            ]
          },
          {
            phase: "Shadow Integration",
            questions: [
              "What gift or strength is hidden within this shadow aspect?",
              "How can you express this part of yourself in a healthy way?",
              "What does self-acceptance look like for you now?"
            ]
          }
        ]
      },
      {
        name: "Compass",
        description: "Find your authentic direction when you feel lost. Reconnect with your true values and purpose.",
        systemPrompt: "You are Compass, a wise and grounding guide who helps people find their direction when they feel lost or disconnected from their purpose. You help them reconnect with their core values and authentic desires. Be patient and exploratory.",
        avatar: "🧭",
        gradient: "from-emerald-400 via-teal-500 to-green-600",
        category: "Life Direction",
        questionnaireSteps: [
          {
            phase: "Current Position",
            questions: [
              "Describe where you feel stuck or directionless right now.",
              "What did you used to be passionate about that you've lost touch with?",
              "When was the last time you felt truly aligned with your life?"
            ]
          },
          {
            phase: "Values Excavation",
            questions: [
              "Describe a moment when you felt most alive and true to yourself.",
              "What would you do if money and others' opinions didn't matter?",
              "What injustice or problem in the world moves you most deeply?"
            ]
          },
          {
            phase: "Direction Setting",
            questions: [
              "Based on our conversation, what values are calling to you most strongly?",
              "What's one small experiment you could run to move toward alignment?",
              "What compass heading are you setting for the next chapter?"
            ]
          }
        ]
      },
      {
        name: "Alchemist",
        description: "Transform your pain into power. Turn wounds into wisdom and suffering into strength.",
        systemPrompt: "You are Alchemist, a mystical yet grounded guide who helps people transmute their pain, trauma, and suffering into wisdom and strength. You see the gold hidden in their darkest experiences. Be reverent of their pain while showing them its transformative potential.",
        avatar: "⚗️",
        gradient: "from-amber-400 via-yellow-500 to-orange-500",
        category: "Transformation",
        questionnaireSteps: [
          {
            phase: "Gathering the Lead",
            questions: [
              "What pain or wound have you been carrying that feels too heavy?",
              "How has this pain shaped who you've become?",
              "What have you tried to do with this pain so far?"
            ]
          },
          {
            phase: "The Fire",
            questions: [
              "If your pain could speak, what message is it trying to deliver?",
              "What would it mean to truly honor this experience rather than just survive it?",
              "Who else shares this type of pain that you could help?"
            ]
          },
          {
            phase: "The Gold",
            questions: [
              "What wisdom have you gained that you couldn't have learned any other way?",
              "How can your wound become your gift to others?",
              "What does it feel like to hold this pain as a teacher rather than a burden?"
            ]
          }
        ]
      }
    ];

    for (const agent of agents) {
      await ctx.db.insert("agents", agent);
    }
  },
});
