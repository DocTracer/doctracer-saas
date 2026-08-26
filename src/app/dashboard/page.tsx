"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Plus, Link as LinkIcon, Eye, Lock, Unlock, Copy, Check, BarChart2, Zap, ArrowLeft, Trash2 } from "lucide-react";

interface DocItem {
  id: string;
  title: string;
  linkId: string;
  recipientEmail: string;
  customWatermark?: string;
  allowDownload: boolean;
  isRevoked: boolean;
  createdAt: string;
  viewsCount: number;
}

export default function DashboardPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [customWatermark, setCustomWatermark] = useState("");
  const [allowDownload, setAllowDownload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load documents from API or localStorage MVP state
  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/upload");
      if (res.ok) {
        const data = await res.json();
        setDocs(data.documents || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !recipientEmail) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("recipientEmail", recipientEmail);
    formData.append("customWatermark", customWatermark || recipientEmail);
    formData.append("allowDownload", allowDownload ? "true" : "false");
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await fetchDocs();
        setShowModal(false);
        setTitle("");
        setRecipientEmail("");
        setCustomWatermark("");
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRevoke = async (docId: string, currentRevokedStatus: boolean) => {
    try {
      const res = await fetch("/api/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId, isRevoked: !currentRevokedStatus }),
      });
      if (res.ok) {
        fetchDocs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (linkId: string) => {
    const fullUrl = `${window.location.origin}/v/${linkId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">DocTracer</span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Espace Client
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/#pricing"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-3.5 h-3.5" /> Passer en Pro (15€/m)
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Vos Documents Sécurisés</h1>
            <p className="text-sm text-slate-400 mt-1">
              Générez des liens uniques avec tatouage dynamique et suivez la lecture de vos prospects.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            Nouveau Document Sécurisé
          </button>
        </div>

        {/* Documents Table */}
        {docs.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/50">
            <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Aucun document protégé pour l'instant</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Cliquez ci-dessous pour ajouter votre premier devis ou document et générer un lien sécurisé avec tatouage.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Protéger mon 1er document
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Titre du Document</th>
                    <th className="px-6 py-4">Destinataire & Filigrane</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-center">Vues</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {docs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                          <div>
                            <div>{doc.title}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">/v/{doc.linkId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-slate-200">{doc.recipientEmail}</div>
                        <div className="text-xs text-sky-400/80 font-mono italic">
                          "{doc.customWatermark || doc.recipientEmail}"
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {doc.isRevoked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            <Lock className="w-3 h-3" /> Révoqué
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Unlock className="w-3 h-3" /> Actif
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center font-bold text-white">
                        <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-sky-400">
                          {doc.viewsCount} vue(s)
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyToClipboard(doc.linkId)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            title="Copier le lien sécurisé"
                          >
                            {copiedId === doc.linkId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <Link
                            href={`/dashboard/doc/${doc.id}`}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition"
                            title="Voir les statistiques de lecture"
                          >
                            <BarChart2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => toggleRevoke(doc.id, doc.isRevoked)}
                            className={`p-2 rounded-lg transition ${
                              doc.isRevoked ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            }`}
                            title={doc.isRevoked ? "Réactiver l'accès" : "Révoquer l'accès immédiatement"}
                          >
                            {doc.isRevoked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal d'ajout de document */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <h2 className="text-xl font-bold text-white mb-1">Nouveau Document Sécurisé</h2>
              <p className="text-xs text-slate-400 mb-6">
                Le filigrane sera incrusté automatiquement avec le nom/email du destinataire.
              </p>

              <form onSubmit={handleCreateDoc} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Titre du document</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Devis Stratégie Marketing - Agence XYZ"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email du Destinataire</label>
                  <input
                    type="email"
                    required
                    placeholder="ex: client@entreprise.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Texte du Filigrane (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="Par défaut: email du destinataire"
                    value={customWatermark}
                    onChange={(e) => setCustomWatermark(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Fichier PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Si aucun fichier n'est téléversé, un PDF démo sera généré automatiquement.</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="allowDownload"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-500"
                  />
                  <label htmlFor="allowDownload" className="text-xs text-slate-300">
                    Autoriser le téléchargement du PDF brut (Décoché = Téléchargement bloqué)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition disabled:opacity-50"
                  >
                    {loading ? "Génération en cours..." : "Générer le lien sécurisé"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
