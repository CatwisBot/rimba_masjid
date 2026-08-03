"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Sparkles,
  MessageSquare,
  Instagram,
  Video,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { generateBroadcastAndCaption } from "@/app/actions/ai-generator";

export interface MediaItemData {
  title: string;
  description: string;
  category?: string;
  formattedDate?: string;
  time?: string | null;
  location?: string | null;
  requirements?: string | null;
  contentType?: "agenda" | "berita";
  slug?: string;
}

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaItemData | null;
}

export default function AIGeneratorModal({ isOpen, onClose, item }: AIGeneratorModalProps) {
  const [targetType, setTargetType] = useState<"whatsapp" | "instagram" | "tiktok" | "story">("whatsapp");
  const [tone, setTone] = useState<"santun" | "semangat" | "formal">("santun");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async (
    type: "whatsapp" | "instagram" | "tiktok" | "story" = targetType,
    selectedTone: "santun" | "semangat" | "formal" = tone
  ) => {
    if (!item) return;
    setIsLoading(true);
    setCopied(false);
    try {
      const res = await generateBroadcastAndCaption({
        title: item.title,
        description: item.description,
        category: item.category,
        formattedDate: item.formattedDate,
        time: item.time,
        location: item.location,
        requirements: item.requirements,
        contentType: item.contentType || "agenda",
        slug: item.slug,
        targetType: type,
        tone: selectedTone,
      });

      if (res.success && res.content) {
        setGeneratedText(res.content);
      }
    } catch (e) {
      console.error("Gagal meregenerasi teks:", e);
    } finally {
      setIsLoading(false);
    }
  }, [item, targetType, tone]);

  useEffect(() => {
    if (isOpen && item) {
      handleGenerate(targetType, tone);
    }
  }, [isOpen, item, handleGenerate, targetType, tone]);

  if (!isOpen || !item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(generatedText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-linear-to-r from-primary to-primary-dark border-b border-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/10 text-secondary border border-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                AI Broadcast & Caption Generator
              </h3>
              <p className="text-xs text-white/80 font-medium">
                Buat konten promosi WA, Instagram, & TikTok dari {item.contentType === "berita" ? "Berita/Artikel" : "Agenda"} secara otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Format Selector Tabs */}
        <div className="px-6 pt-4 pb-2 bg-background border-b border-border/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setTargetType("whatsapp");
              handleGenerate("whatsapp", tone);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              targetType === "whatsapp"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-surface text-text/70 hover:bg-surface/80 border border-border/60"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Broadcast</span>
          </button>

          <button
            onClick={() => {
              setTargetType("instagram");
              handleGenerate("instagram", tone);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              targetType === "instagram"
                ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md"
                : "bg-surface text-text/70 hover:bg-surface/80 border border-border/60"
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram Caption</span>
          </button>

          <button
            onClick={() => {
              setTargetType("tiktok");
              handleGenerate("tiktok", tone);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              targetType === "tiktok"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                : "bg-surface text-text/70 hover:bg-surface/80 border border-border/60"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>TikTok & Reels</span>
          </button>

          <button
            onClick={() => {
              setTargetType("story");
              handleGenerate("story", tone);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              targetType === "story"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-surface text-text/70 hover:bg-surface/80 border border-border/60"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Status / Story</span>
          </button>
        </div>

        {/* Modal Body & Controls */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* Tone selector & Regenerate Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text/70">Gaya Bahasa:</span>
              {(["santun", "semangat", "formal"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTone(t);
                    handleGenerate(targetType, t);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold capitalize transition-all ${
                    tone === t
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-text/60 hover:text-text hover:bg-background"
                  }`}
                >
                  {t === "santun" ? "🌿 Santun" : t === "semangat" ? "🔥 Semangat" : "📖 Formal"}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleGenerate(targetType, tone)}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-background hover:bg-primary/5 text-primary text-xs font-bold rounded-xl border border-primary/30 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Regenerasi AI</span>
            </button>
          </div>

          {/* Generated Result Container */}
          <div className="relative rounded-2xl border border-border bg-background/80 p-4 min-h-[220px]">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 backdrop-blur-xs rounded-2xl z-10">
                <Loader2 className="w-7 h-7 animate-spin text-primary" />
                <span className="text-xs font-bold text-primary animate-pulse">
                  AI sedang menyusun {targetType === "whatsapp" ? "pesan broadcast WA" : targetType === "instagram" ? "caption Instagram" : "konten media sosial"}...
                </span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-xs sm:text-sm text-text/90 font-sans leading-relaxed break-words">
                {generatedText}
              </pre>
            )}
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="p-4 bg-background border-t border-border/60 flex items-center justify-between gap-3">
          <div className="text-xs font-medium text-text/60 hidden sm:block">
            {targetType === "whatsapp"
              ? "Teks berformat bold & italic khas WA."
              : targetType === "instagram"
              ? "Lengkap dengan hashtag & CTA link di bio."
              : "Siap langsung disalin & dibagikan."}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {targetType === "whatsapp" && (
              <button
                onClick={handleOpenWhatsApp}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Kirim via WA</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`px-5 py-2.5 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
