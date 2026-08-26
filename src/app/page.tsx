import Link from "next/link";
import { ShieldCheck, Eye, Lock, Zap, ArrowRight, CheckCircle2, FileText, Bell } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-sky-500 selection:text-white">
      {/* Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              DocTracer
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white transition">Tarifs</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-sky-500 hover:bg-sky-400 text-white transition flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              Accéder au Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <Zap className="w-3.5 h-3.5" />
            L'outil indispensable des Freelances & Agences B2B
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-8">
            Ne laissez plus vos devis fuiter chez vos concurrents.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            Partagez vos propositions commerciales avec un tatouage dynamique à l'email du client et sachez <span className="text-sky-400 font-semibold">exactement quand et comment le relancer</span> au parfait moment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white transition shadow-xl shadow-sky-500/25 flex items-center justify-center gap-3"
            >
              Protéger mon premier PDF gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" /> Sans carte bancaire requise
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" /> Tatouage automatique
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" /> Annulation en 1 clic
            </span>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="features" className="py-24 bg-slate-950 border-t border-b border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Pourquoi les pros adorent DocTracer</h2>
            <p className="text-slate-400">Une suite complète d'outils pour sécuriser votre propriété intellectuelle et doubler vos taux de conversion.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400 mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tatouage Anti-Fuite</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Le nom, l'email et l'adresse IP du destinataire sont incrustés directement en filigrane binaire sur chaque page. Impossible de partager votre devis à un concurrent.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400 mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Timing Commercial Parfait</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Soyez notifié dès la seconde où votre client ouvre votre proposition. Appelez-le au moment exact où il réfléchit à votre offre.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-400 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Temps passé par Page</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Découvrez quelles sections ont retenu l'attention du prospect (ex: 4 minutes sur la grille de prix, 10s sur la présentation).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Un tarif simple et rentable dès le 1er devis</h2>
            <p className="text-slate-400">Rentabilisé au centuple si vous signez un seul client supplémentaire dans l'année.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Découverte</h3>
                <p className="text-slate-400 text-sm mb-6">Pour tester et sécuriser vos premiers envois.</p>
                <div className="text-4xl font-extrabold mb-6">0€ <span className="text-base font-normal text-slate-400">/ mois</span></div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Jusqu'à 3 documents actifs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Tatouage email automatique</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Compteur de vues simple</li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="w-full py-3 text-center text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 transition text-white"
              >
                Démarrer gratuitement
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-sky-950 to-slate-900 border-2 border-sky-500 flex flex-col justify-between relative shadow-2xl shadow-sky-500/20">
              <div className="absolute -top-3.5 right-6 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommandé
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Pro Business</h3>
                <p className="text-slate-400 text-sm mb-6">Pour les indépendants et agences actives.</p>
                <div className="text-4xl font-extrabold mb-6">15€ <span className="text-base font-normal text-slate-400">/ mois HT</span></div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Documents illimités</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Tatouage personnalisé</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Statistiques détaillées page par page</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Révocation du lien en 1 clic</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400" /> Notifications d'ouverture instantanées</li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="w-full py-3 text-center text-sm font-semibold rounded-xl bg-sky-500 hover:bg-sky-400 transition text-white shadow-lg shadow-sky-500/25"
              >
                Passer au Plan Pro (15€/mois)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 DocTracer SaaS. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
