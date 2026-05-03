"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2, User } from "lucide-react";
import { products } from "@/data/products";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  productIds?: string[];
  shouldHandoff?: boolean;
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content: "您好！有什麼我可以幫忙的嗎？\n\n可以試著問我：「有什麼推薦的咖啡機？」",
};

const QUICK_QUESTIONS = [
  "有什麼推薦的咖啡機？",
  "義式機和滴漏機有什麼差別？",
  "保固多久？可以退換嗎？",
  "我要轉接真人客服",
];

// 查看全部商品的特殊指令
const SHOW_ALL_CMD = "查看全部商品";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHandoff, setIsHandoff] = useState(false);
  const [queuePos] = useState(Math.floor(Math.random() * 3) + 1);
  const [now, setNow] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 更新時鐘
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  // 判斷是否在服務時間內（每日 12:00–20:00）
  const isWithinServiceHours = (() => {
    const hour = now.getHours();
    const minute = now.getMinutes();
    const totalMinutes = hour * 60 + minute;
    return totalMinutes >= 12 * 60 && totalMinutes < 20 * 60;
  })();

  const timeStr = now.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const HANDOFF_KEYWORDS = ["真人", "人工", "轉接", "真人客服", "人工客服", "客服人員", "真人服務"];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || isHandoff) return;
    const trimmed = text.trim();

    // 前端直接偵測轉接關鍵字，不依賴 AI 回傳 HANDOFF_TRIGGER
    if (HANDOFF_KEYWORDS.some((kw) => trimmed.includes(kw))) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: trimmed }]);
      setInput("");
      handleHandoff();
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
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
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (data.shouldHandoff) handleHandoff();
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "抱歉，連線似乎有點問題，請稍後再試～",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHandoff = () => {
    // 判斷是否在服務時間內（每日 12:00–20:00）
    if (!isWithinServiceHours) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: `目前客服服務時間為每日 12:00–20:00，現在是 ${timeStr}，暫時無法轉接真人。\n\n您可以先輸入問題，我不會不見的！☕`,
      }]);
      return;
    }
    setIsHandoff(true);
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      role: "assistant",
      content: `正在為您安排真人客服，請稍候...\n\n您前面還有 ${queuePos} 位，預計等待約 ${queuePos * 2} 分鐘。`,
    }]);
  };

  const cancelHandoff = () => {
    setIsHandoff(false);
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      role: "assistant",
      content: "已取消等待，我繼續為您服務 ☕ 還有什麼問題嗎？",
    }]);
  };

  // 当客戶點擊「查看全部商品」時，直接在對話中顯示所有商品卡片（不經 AI）
  const showAllProducts = () => {
    if (isLoading || isHandoff) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: SHOW_ALL_CMD };
    const allIds = products.map((p) => p.id);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "以下是我們目前所有的商品，點擊各卡片可了解詳情和對比 ☕",
      productIds: allIds,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  return (
    <>
      {/* 懸浮按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-black text-white rounded-full shadow-2xl hover:bg-neutral-800 transition-all z-50 flex items-center justify-center group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />}
      </button>

      {/* 聊天視窗 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-neutral-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">

          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">智能客服-咖比</h3>
                <p className="text-xs text-neutral-400">
                  {isHandoff ? "等待轉接中..." : "目前在線為您服務"}
                </p>
              </div>
            </div>
            <span className="text-xs text-neutral-500">{timeStr}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 bg-neutral-50/50">
            {messages.map((m) => (
              <div key={m.id} className="flex flex-col gap-3">
                {/* AI 氣泡 附帶昵稱 */}
                <div className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[10px] text-neutral-400 whitespace-nowrap">咖比</span>
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-black text-white rounded-br-none whitespace-pre-line"
                      : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-none shadow-sm"
                  }`}>
                    {m.role === "user" ? m.content : <MarkdownMessage content={m.content} />}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-neutral-600" />
                    </div>
                  )}
                </div>

                {/* 商品卡片 */}
                {m.productIds && m.productIds.length > 0 && (
                  <div className="pl-8 flex flex-col gap-3">
                    {m.productIds.map((pid) => {
                      const p = products.find((x) => x.id === pid);
                      if (!p) return null;
                      return <ProductCard key={pid} product={p} />;
                    })}
                  </div>
                )}

              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {/* 轉接等待狀態 */}
            {isHandoff && (
              <div className="flex flex-col items-center gap-2 my-2">
                <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs px-4 py-2 rounded-full flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  正在為您安排真人客服，請稍候...
                </div>
                <p className="text-xs text-neutral-500">目前等待人數：{queuePos} 人</p>
                <button
                  onClick={cancelHandoff}
                  className="text-xs px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                >
                  取消等待
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 快速提問 — 最後一則為 AI 回覆時持續顯示 */}
          {!isHandoff && !isLoading && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
            <div className="px-5 pb-4 pt-3 bg-neutral-50/50 border-t border-neutral-100 shrink-0">
              <p className="text-xs text-neutral-400 mb-2">可以試著問我：</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => q === "我要轉接真人客服" ? handleHandoff() : sendMessage(q)}
                    className="text-xs px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}

              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-5 py-4 bg-white border-t border-neutral-100 shrink-0">
            {isHandoff ? (
              <p className="text-xs text-center text-neutral-400 py-1">AI 對話已暫停，等待客服接手中...</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="輸入訊息..."
                  maxLength={500}
                  className="w-full bg-neutral-100 rounded-full pl-4 pr-12 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black/5"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-black rounded-full hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
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

function ProductCard({ product }: { product: (typeof products)[0] }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-full font-medium">{product.badge}</span>
              <span className="text-[10px] text-neutral-400">{product.category}</span>
            </div>
            <p className="font-semibold text-sm text-neutral-900 truncate">{product.name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-sm">NT${product.price.toLocaleString()}</p>
            <p className="text-[10px] text-neutral-400 line-through">NT${product.originalPrice.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex flex-wrap gap-1 mt-2 mb-3">
          {product.features.slice(0, 3).map((f) => (
            <span key={f} className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full border border-neutral-200">{f}</span>
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
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
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

    // 有序列表 "1. text"
    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const text = lines[i].replace(/^\d+\.\s+/, "");
        items.push(<li key={i}>{renderInline(text)}</li>);
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1 my-1.5">
          {items}
        </ol>
      );
      continue;
    }

    // 無序列表 "- text" 或 "* text"
    if (/^[-*]\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        const text = lines[i].replace(/^[-*]\s+/, "");
        items.push(<li key={i}>{renderInline(text)}</li>);
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 my-1.5">
          {items}
        </ul>
      );
      continue;
    }

    // 空行
    if (line.trim() === "") {
      nodes.push(<div key={`gap-${i}`} className="h-1" />);
      i++;
      continue;
    }

    // 一般段落
    nodes.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{nodes}</div>;
}
