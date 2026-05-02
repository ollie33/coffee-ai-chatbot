"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Loader2,
  Headphones,
  User,
} from "lucide-react";
import { products } from "@/data/products";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  productIds?: string[];
  shouldHandoff?: boolean;
  timestamp: Date;
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "您好！我是智能咖啡顧問 ☕\n\n不管是選購推薦、使用疑問、還是保固問題，都可以問我～有什麼我可以幫你的嗎？",
  timestamp: new Date(),
};

const QUICK_QUESTIONS = [
  "有什麼推薦的咖啡機？",
  "義式機和滴漏機有什麼差別？",
  "保固多久？可以退換嗎？",
  "我要轉接真人客服",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [handedOff, setHandedOff] = useState(false);
  const [queuePos] = useState(Math.floor(Math.random() * 3) + 1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || handedOff) return;
    setInput(""); // clear immediately before any async work
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "抱歉，我暫時無法回應，請稍後再試。",
        productIds: data.productIds || [],
        shouldHandoff: data.shouldHandoff || false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (data.shouldHandoff) triggerHandoff();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "抱歉，連線似乎有點問題，請稍後再試～",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerHandoff = () => {
    setHandedOff(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: `正在為您安排真人客服，請稍候...\n\n您前面還有 ${queuePos} 位，預計等待約 ${
          queuePos * 2
        } 分鐘。`,
        timestamp: new Date(),
      },
    ]);
  };

  const cancelHandoff = () => {
    setHandedOff(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "已取消等待，我繼續為您服務 ☕ 還有什麼問題嗎？",
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-8 bg-black text-white rounded-full shadow-2xl hover:bg-neutral-800 transition-all duration-200 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-12 h-12" />
        ) : (
          <MessageCircle className="w-12 h-12 group-hover:scale-110 transition-transform" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            1
          </span>
        )}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">

          {/* Header */}
          <div className="bg-black text-white p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">智能咖啡顧問</h3>
                <p className="text-xs text-neutral-400">
                  {handedOff ? "等待轉接中..." : "目前在線為您服務"}
                </p>
              </div>
            </div>
            {!handedOff && (
              <button
                onClick={triggerHandoff}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
              >
                <Headphones className="w-3 h-3" />
                轉接專人
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-neutral-50/50">

            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-1.5">
                <div
                  className={`flex items-end gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0 mb-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-br-none"
                        : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <span className="whitespace-pre-line">{msg.content}</span>
                    ) : (
                      <MarkdownMessage content={msg.content} />
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 mb-0.5">
                      <User className="w-3 h-3 text-neutral-600" />
                    </div>
                  )}
                </div>

                {/* Product Cards */}
                {msg.productIds && msg.productIds.length > 0 && (
                  <div className="pl-8 space-y-2 mt-1">
                    {msg.productIds.map((pid) => {
                      const p = products.find((x) => x.id === pid);
                      if (!p) return null;
                      return <ProductCard key={pid} product={p} />;
                    })}
                  </div>
                )}

                {/* Handoff CTA from AI */}
                {msg.shouldHandoff && !handedOff && (
                  <div className="pl-8">
                    <button
                      onClick={triggerHandoff}
                      className="text-xs flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
                    >
                      <Headphones className="w-3 h-3" />
                      立即轉接真人
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {/* Handoff status */}
            {handedOff && (
              <div className="flex flex-col items-center justify-center my-4 gap-2">
                <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs px-4 py-2 rounded-full flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  正在為您安排真人客服，請稍候...
                </div>
                <div className="text-xs text-neutral-500 font-medium">目前等待人數：{queuePos} 人</div>
                <button
                  onClick={cancelHandoff}
                  className="mt-1 text-xs px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                >
                  取消等待
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Questions — show after every AI reply, or when only welcome msg exists */}
          {!handedOff && !loading && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
            <div className="px-6 pb-3 bg-neutral-50/50 border-t border-neutral-100">
              <p className="text-[11px] text-neutral-400 mt-3 mb-2">可以試著問我：</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-6 py-5 bg-white border-t border-neutral-100 shrink-0">
            {handedOff ? (
              <p className="text-xs text-center text-neutral-400 py-1">
                AI 對話已暫停，等待客服接手中...
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="relative"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="輸入訊息..."
                  maxLength={500}
                  className="w-full bg-neutral-100 rounded-full pl-4 pr-12 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-full hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>
      )}
    </>
  );
}

/* ── Product Card ── */
function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-full font-medium">
                {product.badge}
              </span>
              <span className="text-[10px] text-neutral-400">{product.category}</span>
            </div>
            <p className="font-semibold text-sm text-neutral-900 truncate">{product.name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-sm text-neutral-900">
              NT${product.price.toLocaleString()}
            </p>
            <p className="text-[10px] text-neutral-400 line-through">
              NT${product.originalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-2">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full border border-neutral-200"
            >
              {f}
            </span>
          ))}
        </div>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center text-xs font-medium bg-black text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          前往購買 →
        </a>
      </div>
    </div>
  );
}

/* ── Markdown Message Renderer ── */
function renderInline(text: string): React.ReactNode[] {
  // Split on **bold** tokens
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Numbered list item: "1. text"
    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const text = lines[i].replace(/^\d+\.\s+/, "");
        items.push(
          <li key={i} className="ml-1">
            {renderInline(text)}
          </li>
        );
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1 my-1">
          {items}
        </ol>
      );
      continue;
    }

    // Bullet list item: "- text" or "* text"
    if (/^[-*]\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        const text = lines[i].replace(/^[-*]\s+/, "");
        items.push(
          <li key={i} className="ml-1">
            {renderInline(text)}
          </li>
        );
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 my-1">
          {items}
        </ul>
      );
      continue;
    }

    // Empty line → small gap
    if (line.trim() === "") {
      nodes.push(<div key={`gap-${i}`} className="h-1" />);
      i++;
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{nodes}</div>;
}
