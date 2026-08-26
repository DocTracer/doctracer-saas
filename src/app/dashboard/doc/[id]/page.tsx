"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Clock, Eye, Lock, Unlock, Copy, Check, BarChart2, Globe, FileText } from "lucide-react";

interface ViewLog {
  id: string;
  recipientIp: string;
  userAgent: string;
  totalDurationSeconds: number;
  createdAt: string;
  pageAnalytics: {
    pageNumber: number;
    durationSeconds: number;
  }[];
}

interface DocDetails {
  id: string;
  title: string;
  linkId: string;
  recipientEmail: string;
  customWatermark: string;
  isRevoked: boolean;
  createdAt: string;
  viewLogs: ViewLog[];
}

export default function DocAnalyticsPage() {
  const params = useParams();
  const docId = params.id as string;

  const [doc, setDoc] = useState<DocDetails | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDocDetails();
  }, [docId]);

  const fetchDocDetails = async () => {
    try {
      const res = await fetch(`/api/upload?id=${docId}`);
      if (res.ok) {
        const data = await res.json();
        setDoc(data.document || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyLink = () => {
    if (!doc) return;
    const fullUrl = `${window.location.origin}/v/${doc.linkId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  const totalViews = doc.viewLogs.length;
  const totalSeconds = doc.viewLogs.reduce((acc, log) => acc + log.totalDurationSeconds, 0);

  // Aggregate page duration across all views
  const pageStats: { [page: number]: number } = {};
  doc.viewLogs.forEach((log) => {
    log.pageAnalytics.forEach((p) => {
      pageStats[p.pageNumber] = (pageStats[p.pageNumber] || 0) + p.durationSeconds;
    });
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Retour au Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold hover:bg-sky-500/20 transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copier le lien sécurisé
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Doc Header Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Statistiques de Lecture
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">{doc.title}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Destinataire : <span className="text-slate-200 font-mono">{doc.recipientEmail}</span> • Filigrane : <span className="text-sky-400 italic">"{doc.customWatermark}"</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/v/${doc.linkId}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-2"
              >
                Tester le lien public
              </a>
            </div>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
              <Eye className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-semibold uppercase">Total Ouvertures</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{totalViews}</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold uppercase">Temps Total de Lecture</span>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {Math.floor(totalSeconds / 60)} min {totalSeconds % 60} sec
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
              <BarChart2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-semibold uppercase">Moyenne par Ouverture</span>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalViews > 0 ? Math.round(totalSeconds / totalViews) : 0} sec
            </div>
          </div>
        </div>

        {/* Page-by-Page Time Analytics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Temps de Lecture par Page</h2>
          {Object.keys(pageStats).length === 0 ? (
            <p className="text-xs text-slate-400 py-4">Aucune donnée par page enregistrée pour l'instant.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(pageStats).map(([pageNum, duration]) => {
                const maxDuration = Math.max(...Object.values(pageStats), 1);
                const percent = Math.round((duration / maxDuration) * 100);
                return (
                  <div key={pageNum} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">Page {pageNum}</span>
                      <span className="text-sky-400 font-mono">{duration} secondes</span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Access Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Historique des Consultations</h2>
          {doc.viewLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">Le destinataire n'a pas encore ouvert ce lien.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400 uppercase">
                  <tr>
                    <th className="py-3 px-4">Horodatage</th>
                    <th className="py-3 px-4">Adresse IP</th>
                    <th className="py-3 px-4">Navigateur</th>
                    <th className="py-3 px-4 text-right">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {doc.viewLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-3 px-4 font-mono">{new Date(log.createdAt).toLocaleString("fr-FR")}</td>
                      <td className="py-3 px-4 font-mono text-sky-400">{log.recipientIp || "Masquée"}</td>
                      <td className="py-3 px-4 truncate max-w-xs text-slate-400">{log.userAgent || "Inconnu"}</td>
                      <td className="py-3 px-4 text-right font-bold text-white">{log.totalDurationSeconds} sec</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
