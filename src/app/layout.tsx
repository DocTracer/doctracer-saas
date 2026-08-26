import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocTracer - Partage de PDF Sécurisé, Tatouage & Tracking",
  description: "Protegez vos devis et propositions commerciales contre les fuites. Tatouage binaire automatique et notifications de lecture en temps réel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
