# KatDigital

Plateforme web de cartes de vœux et d'invitations digitales interactives, optimisée pour une distribution mobile et WhatsApp avec intégration de paiements locaux et internationaux.

---

## Vue d'ensemble

KatDigital est une solution web orientée mobile conçue pour moderniser l'envoi de vœux lors des célébrations de fin d'année (Noël, Nouvel An 2027 et Fête Nationale du 1er Janvier). Le projet s'appuie sur les standards d'animation et de papeterie éditoriale haut de gamme inspirés de références du secteur telles que Greenvelope et Evite, combinant l'élégance du papier traditionnel à l'interactivité numérique.

---

## Caractéristiques techniques et fonctionnelles

### 1. Expérience visuelle et éditoriale
* Direction artistique inspirée de la papeterie fine : teintes chaudes (#FAF7F2, #F4EFE6) et textures subtiles.
* Typographie éditoriale structurée avec les polices Cormorant Garamond, Playfair Display et Montserrat.
* Système de navigation par catégories : Sélection globale, Fêtes de Noël, Nouvel An 2027, Traditions culturelles, Messages personnels.

### 2. Moteur d'animation physique
* Modélisation physique de l'enveloppe avec rabat supérieur interactif animé en 3D via GSAP (rotateX).
* Doublure intérieure texturée respectant la profondeur de plan (z-index dynamique).
* Extraction fluide de la carte d'invitation avec mise à l'échelle centrale optimisée pour écrans mobiles.
* Génération de particules festives calibrées via Canvas-Confetti pour maintenir un taux de rafraîchissement stable à 60 FPS sur navigateur mobile (WebView WhatsApp).
* Synthèse sonore native via l'API Web Audio pour un chargement instantané sans dépendance de fichiers audio volumineux.

### 3. Parcours utilisateur et distribution
* Flux de personnalisation en moins de deux minutes : saisie des expéditeurs et destinataires, sélection de messages prédéfinis ou rédaction personnalisée.
* Génération d'URL uniques prêtes pour le partage instantané via l'API WhatsApp avec balises Open Graph dédiées.
* Passerelle de paiement multidevise : intégration MonCash (HTG) pour le marché national et cartes bancaires/Stripe (USD) pour la diaspora et l'international.

---

## Architecture logicielle

* **Environnement et Framework :** React 19, Vite
* **Animations complexes :** GSAP (GreenSock)
* **Moteur de particules :** Canvas-Confetti
* **Système d'icônes :** Lucide React
* **Intégrations de paiement :** API MonCash (Digicel Business), Stripe Checkout

---

## Installation et démarrage local

### Prérequis
* Node.js (version 18 ou supérieure recommandée)
* Gestionnaire de paquets npm ou yarn

### Procédure de déploiement local

1. Cloner le dépôt :
```bash
git clone https://github.com/CalvertWanguy/katdigital.git
cd katdigital
```

2. Installer les dépendances du projet :
```bash
npm install
```

3. Démarrer le serveur de développement :
```bash
npm run dev
```
L'application est accessible par défaut à l'adresse suivante : `http://localhost:5173/`.

4. Générer la version de production :
```bash
npm run build
```

---

## Organisation de l'équipe

* **Front-end Engineering & UI Architecture :** Calvert Wanguy
* **Back-end Engineering & Infrastructure Paiement :** En cours
* **Design Graphique & Direction Artistique :** En cours de recrutement

---

## Contact et support

Pour toute demande relative au projet ou proposition de collaboration :
* Email : contact@wzcollective.com
