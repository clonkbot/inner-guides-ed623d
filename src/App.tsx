import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { Id } from "../convex/_generated/dataModel";

// Type definitions for our data
interface Agent {
  _id: Id<"agents">;
  name: string;
  description: string;
  systemPrompt: string;
  avatar: string;
  gradient: string;
  category: string;
  questionnaireSteps: { phase: string; questions: string[] }[];
}

interface Message {
  _id: Id<"messages">;
  conversationId: Id<"conversations">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-900/5 to-cyan-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 mb-4 shadow-lg shadow-purple-500/25">
            <span className="text-3xl">✧</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-2 tracking-tight">Inner Guides</h1>
          <p className="text-gray-400 text-sm md:text-base">AI companions for your transformation journey</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : flow === "signIn" ? "Enter the Journey" : "Begin Your Path"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {flow === "signIn" ? "New seeker? Create account" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0a0f] text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent, onSelect, isActive }: {
  agent: { _id: Id<"agents">; name: string; description: string; avatar: string; gradient: string; category: string };
  onSelect: () => void;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 ${
        isActive
          ? "bg-white/10 border-white/20 shadow-lg"
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
      }`}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-xl md:text-2xl shadow-lg group-hover:scale-105 transition-transform`}>
          {agent.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-white text-lg font-semibold">{agent.name}</h3>
            <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400 uppercase tracking-wider">
              {agent.category}
            </span>
          </div>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2">{agent.description}</p>
        </div>
      </div>
      {isActive && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      )}
    </button>
  );
}

function ChatMessage({ message, agentGradient }: {
  message: { role: "user" | "assistant"; content: string; createdAt: number };
  agentGradient?: string;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? "order-1" : "order-2"}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-md"
              : "bg-white/[0.05] border border-white/10 text-gray-200 rounded-bl-md"
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={`text-[10px] text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function ChatInterface({ conversationId, agent, onBack }: {
  conversationId: Id<"conversations">;
  agent: { name: string; avatar: string; gradient: string; questionnaireSteps: { phase: string }[] };
  onBack: () => void;
}) {
  const messages = useQuery(api.messages.list, { conversationId });
  const conversation = useQuery(api.conversations.get, { id: conversationId });
  const sendMessage = useMutation(api.messages.send);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    setIsSending(true);
    const message = input;
    setInput("");
    try {
      await sendMessage({ conversationId, content: message });
    } catch (err) {
      setInput(message);
    }
    setIsSending(false);
  };

  const progress = conversation
    ? ((conversation.currentPhase * 3 + conversation.currentQuestion) / (agent.questionnaireSteps.length * 3)) * 100
    : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-lg shadow-lg`}>
            {agent.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-white font-semibold truncate">{agent.name}</h2>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[120px] md:max-w-[200px]">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400">
                Phase {(conversation?.currentPhase ?? 0) + 1}/{agent.questionnaireSteps.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 space-y-4">
        {messages === undefined ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {messages.map((msg: Message) => (
              <ChatMessage key={msg._id} message={msg} agentGradient={agent.gradient} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      {!conversation?.isComplete && (
        <div className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex gap-2 md:gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Share your thoughts..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm md:text-base"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="px-4 md:px-5 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:from-purple-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
            >
              {isSending ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const { signOut } = useAuthActions();
  const agents = useQuery(api.agents.list);
  const seedAgents = useMutation(api.agents.seed);
  const getOrCreateConversation = useMutation(api.conversations.getOrCreate);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

  useEffect(() => {
    if (agents && agents.length === 0) {
      seedAgents();
    }
  }, [agents, seedAgents]);

  const handleSelectAgent = async (agent: Agent) => {
    setSelectedAgent(agent);
    const convId = await getOrCreateConversation({ agentId: agent._id });
    setConversationId(convId);
  };

  const handleBack = () => {
    setSelectedAgent(null);
    setConversationId(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Sidebar - Agent Selection */}
        <div className={`${selectedAgent ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-96 border-r border-white/5`}>
          <div className="px-4 py-4 md:px-6 md:py-5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <span className="text-lg">✧</span>
                </div>
                <div>
                  <h1 className="font-display text-white text-lg font-semibold">Inner Guides</h1>
                  <p className="text-gray-500 text-xs">Choose your companion</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
            {agents === undefined ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>Loading guides...</p>
              </div>
            ) : (
              (agents as Agent[]).map((agent: Agent) => (
                <AgentCard
                  key={agent._id}
                  agent={agent}
                  onSelect={() => handleSelectAgent(agent)}
                  isActive={selectedAgent?._id === agent._id}
                />
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`${selectedAgent ? "flex" : "hidden lg:flex"} flex-1 flex-col`}>
          {selectedAgent && conversationId ? (
            <ChatInterface
              conversationId={conversationId}
              agent={selectedAgent}
              onBack={handleBack}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-4xl opacity-50">✧</span>
                </div>
                <h2 className="font-display text-xl md:text-2xl text-white mb-3">Begin Your Journey</h2>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  Select a guide from the left to start your transformation. Each guide specializes in different aspects of personal growth and self-discovery.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center border-t border-white/5">
        <p className="text-gray-600 text-xs">
          Requested by <span className="text-gray-500">@xyzcryptor</span> · Built by <span className="text-gray-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Awakening...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <SignIn />;
}
