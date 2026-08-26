"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, Lock, AlertTriangle, Eye, Clock } from "lucide-react";

interface DocInfo {
  title: string;
  recipientEmail: string;
  allowDownload: boolean;
  isRevoked: boolean;
}

export default function SecureViewerPage() {
  const params = useParams();
  const linkId = params.linkId as string;

  const [docInfo, setDocInfo] = useState<DocInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const durationRef = useRef(0);

  useEffect(() => {
    fetchDocInfo();
  }, [linkId]);

  // JS Tracker: Pings /api/track every 3s to record viewing time
  useEffect(() => {
    if (!docInfo || docInfo.isRevoked) return;

    const interval = setInterval(() => {
      durationRef.current += 3;
      sendPing(currentPage, 3);
    }, 3000);

    return () => clearInterval(interval);
  }, [docInfo, currentPage]);

  const fetchDocInfo = async () => {
    try {
      const res = await fetch(`/api/upload?linkId=${linkId}`);
      if (res.ok) {
        const data = await res.json();
        setDocInfo(data.document);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendPing = async (page: number, durationSeconds: number) => {
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkId,
          pageNumber: page,
          durationSeconds,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Chargement du document sécurisé...</p>
        </div>
      </div>
    );
  }

  if (!docInfo || docInfo.isRevoked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mx-auto mb-4 border border-red-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Accès Révoqué ou Indisponible</h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            L'expéditeur a révoqué l'accès à ce document confidentiel ou le lien a expiré.
          </p>
          <div className="text-xs text-slate-500 font-mono">Protégé par DocTracer Security</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col"
      onContextMenu={(e) => !docInfo.allowDownload && e.preventDefault()}
    >
      {/* Security Header Banner */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-sky-500/10 rounded-lg text-sky-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">{docInfo.title}</h1>
            <p className="text-[11px] text-slate-400">
              Document tatoué à l'attention exclusive de : <span className="text-sky-400 font-mono">{docInfo.recipientEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {!docInfo.allowDownload && (
            <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-[11px]">
              <AlertTriangle className="w-3 h-3" /> Téléchargement désactivé
            </span>
          )}
        </div>
      </header>

      {/* PDF View Container */}
      <div className="flex-1 bg-slate-900/60 p-4 flex justify-center items-center overflow-auto relative">
        <iframe
          src={`/api/pdf/${linkId}#toolbar=${docInfo.allowDownload ? 1 : 0}&navpanes=0`}
          className="w-full max-w-5xl h-[85vh] rounded-xl border border-slate-800 bg-white shadow-2xl"
          title={docInfo.title}
        />
      </div>

      {/* Footer Tracker Indicator */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-2.5 text-center text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Session de lecture sécurisée en cours
        </span>
        <span className="font-mono text-[11px]">DocTracer Dynamic Watermark Protocol</span>
      </footer>
    </div>
  );
}
