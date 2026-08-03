"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  X,
  User,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { askRimbaAI, ChatMessage } from "@/app/actions/chat";

// Helper untuk memformat teks markdown (bold, link) ke elemen Tailwind
function renderFormattedText(text: string) {
  return text.split("\n").map((line, lineIdx) => {
    let content = line;
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      content = line.trim().substring(2);
    }

    const parts: React.ReactNode[] = [];
    let idx = 0;

    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={`${lineIdx}-${idx}`} className="font-extrabold text-primary-dark">
            {token.substring(2, token.length - 2)}
          </strong>
        );
      } else if (token.startsWith("[")) {
        const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          parts.push(
            <a
              key={`${lineIdx}-${idx}`}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold underline hover:text-primary-dark inline-flex items-center gap-0.5 ml-0.5"
            >
              {linkMatch[1]}
              <ExternalLink className="w-3 h-3 inline text-accent" />
            </a>
          );
        }
      }
      idx++;
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return (
      <div key={lineIdx} className={line.trim() === "" ? "h-2.5" : "my-0.5 text-text/90 leading-relaxed"}>
        {parts.length > 0 ? parts : content}
      </div>
    );
  });
}

const CHAT_STORAGE_KEY = "rimba_chat_messages_v1";

const DEFAULT_INITIAL_MESSAGE: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Assalamu'alaikum warahmatullahi wabarakatuh! Saya **Tanya RIMBA**, asisten virtual yang siap memberikan informasi lengkap seputar kegiatan di RIMBA Masjid Al-Barkah Bekasi. Ada yang bisa saya bantu hari ini?",
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_INITIAL_MESSAGE);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on initial render in browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error("Gagal membaca riwayat pesan dari localStorage:", e);
    }
  }, []);

  // Sync messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("Gagal menyimpan riwayat pesan ke localStorage:", e);
      }
    }
  }, [messages]);

  const quickPrompts = [
    "Kapan jadwal kajian berikutnya?",
    "Siapa saja pengurus RIMBA saat ini?",
    "Bagaimana cara pendaftaran agenda?",
    "Apa itu RIMBA Masjid Al-Barkah?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: messageText.trim() },
    ];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await askRimbaAI(messageText.trim(), newMessages.slice(1, -1));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply || "Mohon maaf, saat ini layanan sedang sibuk. Silakan coba kembali beberapa saat lagi.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Mohon maaf, layanan sedang dalam pemeliharaan sementara. Silakan dapatkan informasi kegiatan melalui menu utama atau halaman Kontak di website ini. 🙏",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const resetMessages: ChatMessage[] = [
      {
        role: "assistant",
        content:
          "Assalamu'alaikum! Percakapan telah direset. Silakan ajukan pertanyaan kembali tentang kegiatan dan kajian di RIMBA Masjid Al-Barkah!",
      },
    ];
    setMessages(resetMessages);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {}
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Widget Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3 bg-linear-to-r from-primary to-primary-dark hover:from-primary/95 hover:to-primary text-white font-extrabold rounded-full shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105 border border-secondary/40"
          aria-label="Buka Tanya RIMBA"
        >
          <Bot className="w-6 h-6 text-secondary" />
          <span className="text-sm tracking-wide drop-shadow-xs">
            Tanya RIMBA
          </span>
        </button>
      )}

      {/* Expandable Chat Dialog Window */}
      {isOpen && (
        <div className="w-87.5 sm:w-100 h-135 rounded-3xl shadow-2xl shadow-primary/15 border border-border bg-surface text-text flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="px-4 py-3.5 bg-linear-to-r from-primary to-primary-dark border-b border-secondary/30 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-inner">
                <Bot className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  Tanya RIMBA
                </h3>
                <p className="text-[11px] text-white/85 font-medium">
                  Asisten Virtual Resmi RIMBA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Reset Percakapan"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Tutup Obrolan"
                className="p-1.5 text-white/80 hover:text-white hover:bg-red-500/80 rounded-xl transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 bg-background overflow-y-auto space-y-4 text-xs sm:text-sm scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role !== "user" && (
                  <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl shadow-xs leading-relaxed transition-all ${
                    msg.role === "user"
                      ? "bg-linear-to-r from-primary to-primary-dark text-white rounded-br-none font-semibold shadow-md shadow-primary/10"
                      : "bg-surface text-text border border-border/80 rounded-bl-none font-normal"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="space-y-1 text-[13px] text-text">
                      {renderFormattedText(msg.content)}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-primary text-xs font-bold italic bg-surface px-4 py-2.5 rounded-2xl w-fit border border-border shadow-xs animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin shrink-0 text-accent" />
                <span>Tanya RIMBA sedang berpikir...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Prompts */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3.5 pt-2.5 pb-3 flex flex-wrap gap-1.5 bg-surface/90 border-t border-border/60">
              <span className="w-full text-[11px] font-extrabold text-text/70 block mb-0.5">
                Pertanyaan Populer:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] font-semibold text-primary-dark bg-background hover:bg-primary/5 px-3 py-1.5 rounded-xl border border-border shadow-2xs hover:border-primary/40 transition-all text-left truncate max-w-46.25 sm:max-w-52.5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3.5 bg-surface border-t border-border flex items-center gap-2 shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan seputar kegiatan, kajian..."
              className="flex-1 bg-background border border-border rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-text/50 font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary disabled:opacity-50 text-white rounded-2xl shadow-md shadow-primary/15 transition-all active:scale-95 border border-secondary/30 shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
