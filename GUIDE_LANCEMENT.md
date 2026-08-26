# 🚀 Guide de Lancement Pas-à-Pas : DocTracer SaaS

Félicitations ! Ton Micro-SaaS **DocTracer** est entièrement développé et prêt à fonctionner. 
Ce guide t'explique exactement comment lancer le site et commencer à encaisser tes premiers abonnements à **15€/mois** sans aucune connaissance en code.

---

## 🛠️ ÉTAPE 1 : Tester le logiciel sur ton ordinateur (Facultatif mais recommandé)

Si tu souhaites voir ton site fonctionner en direct sur ton écran :

1. Ouvre ton terminal (Invite de commande ou PowerShell) et place-toi dans le dossier du projet :
   ```bash
   cd C:\Users\Enseignant\.gemini\antigravity\scratch\docshield-saas
   ```
2. Installe les dépendances (une seule fois) :
   ```bash
   npm install
   ```
3. Prépare la base de données locale :
   ```bash
   npx prisma db push
   ```
4. Lance le site :
   ```bash
   npm run dev
   ```
5. Ouvre ton navigateur sur `http://localhost:3000`. Tu peux créer un premier document de test et essayer de copier le lien public pour voir le résultat !

---

## 🌐 ÉTAPE 2 : Mettre ton site en ligne GRATUITEMENT sur Vercel (5 minutes)

Pour que tout le monde sur Internet puisse accéder à ton site `doctracer.vercel.app` (ou ton propre nom de domaine) :

1. Crée un compte gratuit sur [GitHub.com](https://github.com).
2. Crée un nouveau dépôt (Repository) nommé `doctracer-saas` et dépose le code dedans (ou glisse-dépose le dossier).
3. Va sur [Vercel.com](https://vercel.com) et connecte-toi avec ton compte GitHub.
4. Clique sur **"Add New" > "Project"** et sélectionne `doctracer-saas`.
5. Clique sur **"Deploy"**. En 60 secondes, ton site est en ligne et accessible par le monde entier !

---

## 💳 ÉTAPE 3 : Brancher ton compte Stripe pour encaisser les abonnements (15€/mois)

1. Crée un compte gratuit sur [Stripe.com](https://stripe.com).
2. Dans ton tableau de bord Stripe, va dans **Clés d'API (API Keys)**.
3. Copie ta `Public Key` (ex: `pk_live_...`) et ta `Secret Key` (ex: `sk_live_...`).
4. Dans l'interface de **Vercel**, va dans **Settings > Environment Variables** de ton projet et ajoute :
   * `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = (ta clé publique)
   * `STRIPE_SECRET_KEY` = (ta clé secrète)
   * `NEXT_PUBLIC_APP_URL` = `https://ton-site.vercel.app`
5. Sauvegarde et reclique sur "Redeploy".
👉 **C'est fini ! Quand un client clique sur "Passer au Plan Pro (15€/mois)", l'argent arrive directement sur ton compte bancaire.**

---

## 📣 ÉTAPE 4 : Trouver tes premiers clients (Stratégie Marketing simple)

Comme le produit résout un problème précis (éviter les fuites de devis), voici comment trouver tes 10 premiers abonnés :

1. **LinkedIn (Freelances & Agences) :**
   Publie un post : *"J'ai créé un petit outil gratuit pour les freelances qui en ont marre d'envoyer un devis et de ne plus jamais avoir de nouvelles... L'outil vous alerte dès que le client ouvre le devis et montre combien de temps il passe sur la page tarif. Dites 'Devis' en commentaire pour essayer !"*

2. **Communautés de Freelances (Groups Facebook, Discord, Slack) :**
   Partage le lien de la Landing Page en expliquant comment l'outil protège les devis des fuites d'idées.

3. **Calculateur de revenus :**
   * 10 abonnés à 15€/mois = **150€ / mois** (Revenu passif)
   * 50 abonnés à 15€/mois = **750€ / mois**
   * 100 abonnés à 15€/mois = **1 500€ / mois**

---

### 🛡️ Besoin d'aide ?
Tout le code est propre, documenté et réutilisable. Tu n'as plus qu'à te concentrer sur la communication et encaisser !
