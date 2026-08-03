"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { summarizeArticleAction } from "@/app/actions/ai-generator";

interface AISummarizerCardProps {
  title: string;
  content: string;
}

export default function AISummarizerCard({ title, content }: AISummarizerCardProps) {
  const [summaryPoints, setSummaryPoints] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateSummary = async () => {
    if (summaryPoints) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    setIsExpanded(true);
    try {
      const res = await summarizeArticleAction(title, content);
      if (res.success && res.summaryPoints) {
        setSummaryPoints(res.summaryPoints);
      }
    } catch (error) {
      console.error("Gagal mendapatkan ringkasan artikel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!summaryPoints) return;
    const textToCopy = `📌 RINGKASAN ARTIKEL: ${title}\n\n` + summaryPoints.map((p) => `- ${p.replace(/\*\*/g, "")}`).join("\n");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function helper untuk merender bold markdown **teks**
  const renderFormattedLine = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-extrabold text-primary-dark dark:text-emerald-400">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="my-8 rounded-3xl border border-primary/20 bg-linear-to-r from-primary/5 via-surface to-accent/5 p-5 sm:p-6 shadow-md transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-text flex items-center gap-2">
              <span>Asisten Ringkasan AI</span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-full">
                Quick Read
              </span>
            </h3>
            <p className="text-xs text-text/70 mt-0.5">
              Pahami 3 poin utama isi artikel ini hanya dalam 10 detik
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md shadow-primary/15 transition-all gap-2 shrink-0 border border-secondary/30 active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span>Membaca & Merangkum...</span>
            </>
          ) : summaryPoints ? (
            <>
              <span>{isExpanded ? "Sembunyikan Ringkasan" : "Tampilkan Ringkasan"}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Ringkas dengan AI</span>
            </>
          )}
        </button>
      </div>

      {/* Expanded Content Box */}
      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-border/80 animate-in fade-in zoom-in-98 duration-200">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-primary">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span className="text-xs font-bold animate-pulse">
                AI sedang menyusun poin-poin penting artikel...
              </span>
            </div>
          ) : summaryPoints && summaryPoints.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-text/70">
                  📌 Poin Penting Artikel:
                </span>
                <button
                  onClick={handleCopySummary}
                  className="text-[11px] font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 bg-surface px-2.5 py-1 rounded-xl border border-border/80 hover:border-primary/40 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Ringkasan</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-2.5">
                {summaryPoints.map((point, index) => (
                  <div key={index} className="flex gap-2.5 text-xs sm:text-sm text-text/90 leading-relaxed">
                    <span className="shrink-0 mt-0.5">•</span>
                    <div>{renderFormattedLine(point)}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs font-medium text-text/60 py-4 text-center">
              Gagal memuat ringkasan. Silakan coba klik tombol kembali.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
