import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType,
  BorderStyle
} from 'docx';
import fs from 'fs';
import path from 'path';

// Palette de couleurs élégante KatDigital
const primaryColor = "1E3A2F"; // Vert sapin premium
const accentColor = "C59B27";  // Or prestigieux
const darkColor = "18201B";    // Noir textuel doux
const bgLight = "F8F9FA";      // Fond cartes grises claires
const bgTableHead = "E9EFEA";  // Fond vert d'eau très clair
const borderColor = "D1D5DB";  // Bordures grises subtiles
const moncashRed = "D92525";   // Rouge MonCash
const natcashOrange = "E86400";// Orange Natcash
const stripeBlue = "635BFF";   // Violet/Bleu Stripe

const createTitle = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 38,
        color: primaryColor,
        font: "Segoe UI"
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 }
  });
};

const createSubTitle = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
        color: accentColor,
        font: "Segoe UI"
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 }
  });
};

const createHeading1 = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28,
        color: primaryColor,
        font: "Segoe UI"
      })
    ],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 140 }
  });
};

const createHeading2 = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 23,
        color: accentColor,
        font: "Segoe UI"
      })
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 }
  });
};

const createParagraph = (text, bold = false) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        size: 21,
        font: "Segoe UI",
        color: darkColor
      })
    ],
    spacing: { after: 100, line: 280 }
  });
};

const createBullet = (label, text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: "• " + label + " : ",
        bold: true,
        size: 21,
        font: "Segoe UI",
        color: primaryColor
      }),
      new TextRun({
        text: text,
        size: 21,
        font: "Segoe UI",
        color: darkColor
      })
    ],
    spacing: { after: 70, line: 280 },
    indent: { left: 360 }
  });
};

const createCallout = (title, text, badgeColor = primaryColor) => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: "F3F6F4" },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            borders: {
              left: { style: BorderStyle.SINGLE, size: 24, color: badgeColor },
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: title, bold: true, size: 21, color: badgeColor, font: "Segoe UI" })
                ],
                spacing: { after: 60 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text, size: 20, color: "333333", font: "Segoe UI" })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};

const createCodeBlock = (codeString) => {
  const lines = codeString.trim().split("\n");
  const rows = lines.map(line => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: "232B2B" },
          margins: { top: 30, bottom: 30, left: 140, right: 140 },
          borders: {
            left: { style: BorderStyle.NONE },
            top: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE }
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: line.length === 0 ? " " : line,
                  font: "Consolas",
                  size: 18,
                  color: "E0E6ED"
                })
              ],
              spacing: { before: 10, after: 10 }
            })
          ]
        })
      ]
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows
  });
};

const createTable = (headers, rowsData) => {
  const headerRow = new TableRow({
    children: headers.map(h => {
      return new TableCell({
        width: { size: h.width, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: bgTableHead },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: h.text,
                bold: true,
                size: 20,
                color: primaryColor,
                font: "Segoe UI"
              })
            ]
          })
        ]
      });
    })
  });

  const dataRows = rowsData.map((row, idx) => {
    return new TableRow({
      children: row.map((cellText, cellIdx) => {
        return new TableCell({
          width: { size: headers[cellIdx].width, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? "FFFFFF" : bgLight },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText,
                  size: 19,
                  font: "Segoe UI",
                  color: darkColor
                })
              ]
            })
          ]
        });
      })
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows]
  });
};

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 }
        }
      },
      children: [
        createTitle("KATDIGITAL — DOSSIER TECHNIQUE FRONT-END"),
        createSubTitle("Spécifications d'Architecture, Stack Technique & Contrat d'Interface Back-End"),

        createCallout(
          "DESTINATION DU DOCUMENT : DÉVELOPPEUR BACK-END",
          "Ce document est préparé par le développeur Front-End pour présenter exhaustivement la stack technique en place, la mécanique d'affichage et de prévisualisation, les événements de déclenchement du paiement (MonCash, Natcash, Stripe) et le contrat d'API attendu pour assurer une intégration fluide.",
          accentColor
        ),
        new Paragraph({ spacing: { after: 180 } }),

        // 1. Synthèse du Projet
        createHeading1("1. Présentation Générale du Projet & Rôles"),
        createParagraph(
          "KatDigital (katdigital.ht) est une application web moderne de cartes de vœux et d'invitations numériques interactives 3D, conçue spécifiquement pour la population en Haïti et la Diaspora haïtienne à travers le monde."
        ),
        createBullet("Rôle Front-End", "Interface utilisateur réactive, animations 3D spatiales (enveloppe qui s'ouvre, carte qui glisse), personnalisation instantanée du message en temps réel, génération des confettis et synthèse sonore Web Audio."),
        createBullet("Rôle Back-End", "Base de données (catalogue, commandes, cartes débloquées), fonctions d'API sécurisées, orchestration des passerelles de paiement (MonCash, Natcash, puis Stripe), webhooks certifiés et distribution des cartes via liens uniques chiffrés."),

        new Paragraph({ spacing: { after: 120 } }),

        // 2. Stack Technique Front-End
        createHeading1("2. Stack Technique Front-End Complète"),
        createParagraph(
          "Le front-end a été conçu pour être ultra-rapide (temps de chargement quasi nul même avec une connexion 3G/4G lente en Haïti), autonome et sans rechargement de page."
        ),

        createTable(
          [
            { text: "Brique / Outil", width: 25 },
            { text: "Version & Techno", width: 25 },
            { text: "Rôle dans KatDigital", width: 50 }
          ],
          [
            ["Framework UI", "React 19 (19.3.1)", "Gestion d'état réactive, composants fonctionnels, concurrent rendering et modals interactifs."],
            ["Bundler & Serveur Dev", "Vite 8 (8.3.5)", "Compilation ESM native ultra-rapide, Hot Module Replacement (HMR) instantané et build de production minifié."],
            ["Moteur d'Animation", "GSAP (3.15.1)", "Gestion de la timeline pour l'ouverture du rabat de l'enveloppe en perspective 3D et extraction fluide de la carte."],
            ["Effets Festifs", "canvas-confetti (1.9.4)", "Particules festives propulsées sur un canvas HTML5 avec physique d'apesanteur (célébration après ouverture et post-paiement)."],
            ["Moteur Audio", "Web Audio API (Custom)", "Synthétiseur de sons procéduraux (clic, glissement d'enveloppe, carillon de fête) sans charger aucun fichier MP3 externe lourd."],
            ["Icônes Vectorielles", "lucide-react (1.68.0)", "Icônes SVG haute définition optimisées pour WhatsApp, téléchargement, sécurité et boutons d'action."],
            ["Styles & Design", "CSS3 Moderne + Variables", "Effets de verres (glassmorphism), responsive mobile-first, préservation de l'espace 3D (transform-style: preserve-3d)."],
            ["Linter & Qualité", "Oxlint (1.89.0)", "Vérification statique de code Rust ultra-rapide pour garantir zéro anomalie d'exécution."]
          ]
        ),

        new Paragraph({ spacing: { after: 160 } }),

        // 3. Architecture des Fichiers Front-End
        createHeading1("3. Architecture des Composants Front-End"),
        createParagraph("L'architecture des dossiers dans le projet est claire et structurée :"),
        createBullet("src/App.jsx", "Composant racine : gère la barre de navigation, le catalogue des modèles, le panier / l'état du modèle sélectionné et les déclencheurs de modales."),
        createBullet("src/components/EnvelopeViewerModal.jsx", "Cœur de l'expérience : visualiseur 3D interactif qui simule l'enveloppe scellée, son cachet de cire, l'ouverture mécanique et la lecture du mot personnalisé."),
        createBullet("src/components/PersonalizeModal.jsx", "Modale d'édition où le client saisit le nom du destinataire, son propre nom et son message d'amitié ou d'amour."),
        createBullet("src/components/AmbientEffects.jsx", "Effets visuels de fond (flocons légers, scintillements de fête) personnalisables selon le thème sélectionné."),
        createBullet("src/data/templates.js", "Catalogue local des modèles disponibles (identifiant, titre, catégorie, couleurs hex de l'enveloppe, texte suggéré, prix en HTG et USD)."),
        createBullet("src/utils/audioSynthesizer.js", "Générateur audio en pur JavaScript utilisant les oscillateurs natifs du navigateur, éliminant tout délai de mise en mémoire tampon."),

        new Paragraph({ spacing: { after: 160 } }),

        // 4. Flux Utilisateur & Déclenchement du Paiement (Paywall)
        createHeading1("4. Flux Utilisateur & Mécanique du Paywall"),
        createParagraph(
          "Pour maximiser la conversion et le taux de complétion, KatDigital adopte une approche « Try-Before-You-Buy » (Création libre, paiement au partage) :"
        ),

        createBullet("Étape 1 : Personnalisation Libre", "L'utilisateur arrive sur le site, choisit une carte, tape les prénoms et prévisualise l'animation 3D instantanément. Tout se passe en local sans appel API."),
        createBullet("Étape 2 : Le Déclencheur Paywall", "Dès que l'utilisateur clique sur « Pataje sou WhatsApp » (Partager sur WhatsApp) ou « Telechaje » (Télécharger), une modale de paiement s'affiche."),
        createBullet("Étape 3 : Sélection du Moyen de Paiement", "L'utilisateur choisit :"),
        createParagraph("     • MonCash (Haïti) : 100 HTG — Payé directement avec son portefeuille Digicel."),
        createParagraph("     • Natcash (Haïti) : 100 HTG — Payé avec son compte mobile Natcom."),
        createParagraph("     • Stripe (Diaspora / International) : 2.99 $ USD — Cartes de crédit, Visa, Mastercard, Apple Pay."),
        createBullet("Étape 4 : Déblocage & Accès", "Une fois le paiement validé par le webhook du back-end, le front-end reçoit la confirmation, affiche un écran de félicitations avec confettis et fournit le lien unique public (ex: katdigital.ht/?c=x7K9p2) prêt à être partagé sur WhatsApp."),

        new Paragraph({ spacing: { after: 160 } }),

        // 5. Spécifications pour les Passerelles de Paiement
        createHeading1("5. Besoins & Mécanismes de Paiement Back-End"),
        createParagraph(
          "Voici ce que le front-end attend de l'infrastructure back-end pour chacune des 3 passerelles :"
        ),

        createHeading2("A. MonCash (Digicel Haïti) — 100 HTG"),
        createParagraph(
          "Le back-end doit communiquer avec l'API REST de MonCash Business :"
        ),
        createBullet("1. Authentification", "Génération du token d'accès OAuth2 (Client ID & Secret)."),
        createBullet("2. Création de paiement", "Appel à POST /v1/CreatePayment avec le montant (100 HTG) et l'ID de commande KatDigital en référence."),
        createBullet("3. Redirection / Validation", "Le back-end renvoie l'URL de redirection MonCash au front-end, ou le token pour l'écran de confirmation."),
        createBullet("4. Webhook IPN", "Écoute du retour MonCash pour passer la commande en statut 'PAID' et débloquer la carte."),

        createHeading2("B. Natcash (Natcom Haïti) — 100 HTG"),
        createParagraph(
          "Intégration du paiement mobile Natcom pour les utilisateurs du réseau Natcom :"
        ),
        createBullet("1. Initiateur", "Création de la transaction marchande côté back-end avec numéro de téléphone de l'acheteur."),
        createBullet("2. Validation OTP ou USSD Push", "L'utilisateur confirme sur son téléphone avec son code secret Natcash."),
        createBullet("3. Confirmation serveur", "Notification directe via webhook / callback HTTP pour valider le statut."),

        createHeading2("C. Stripe (Diaspora / International) — 2.99 USD"),
        createParagraph(
          "Intégration Stripe Checkout pour les acheteurs situés aux États-Unis, Canada, France, etc. :"
        ),
        createBullet("1. Stripe Checkout Session", "Génération d'une session Stripe hébergée sécurisée contenant l'order_id dans les metadata."),
        createBullet("2. Redirection", "Le front-end redirige l'acheteur vers la page sécurisée Stripe, puis revient sur success_url (?session_id=...)."),
        createBullet("3. Webhook de sécurité", "Écoute de l'événement 'checkout.session.completed' avec vérification cryptographique de la signature Stripe HMAC."),

        new Paragraph({ spacing: { after: 160 } }),

        // 6. Contrat d'Interface API Front <-> Back
        createHeading1("6. Contrat d'API Détaillé (Ce que le Front envoie et attend)"),
        createParagraph(
          "Pour que l'équipe front-end puisse brancher immédiatement les appels réseau (via fetch ou axios), voici les spécifications des endpoints :"
        ),

        createHeading2("Endpoint 1 : Création d'une commande (Initiation du paiement)"),
        createCallout(
          "POST /api/orders/create",
          "Appelé par le Front-end dès que le client choisit son mode de paiement dans la modale de partage.",
          primaryColor
        ),
        createParagraph("Données envoyées par le Front-end (Request Body JSON) :", true),
        createCodeBlock(`{
  "template_id": "noel-bordeaux",
  "recipient_name": "Vanessa",
  "sender_name": "David",
  "message_content": "Bòn Fèt Nwèl e Bòn Ane 2027! Se pou ane sa a pote sante, lajwa ak anpil siksè pou ou menm ak tout fanmi an.",
  "payment_method": "moncash", // ou "natcash", ou "stripe"
  "currency": "HTG",           // "HTG" pour MonCash/Natcash, "USD" pour Stripe
  "amount": 100,               // 100 pour HTG, 2.99 pour USD
  "customer_phone": "+50937123456", // Obligatoire si MonCash / Natcash
  "customer_email": "client@example.com" // Recommandé si Stripe
}`),

        createParagraph("Réponse attendue du Back-end (Response 201 Created) :", true),
        createCodeBlock(`{
  "success": true,
  "order_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "payment_method": "moncash",
  "status": "pending",
  // Si MonCash ou Stripe avec redirection :
  "redirect_url": "https://moncashbutton.digicelgroup.com/Moncash-middleware/Payment/Redirect?token=...",
  // Si Natcash USSD / QR :
  "instructions": "Tanpri antre kòd PIN ou sou telefòn ou pou valide tranzaksyon an."
}`),

        createHeading2("Endpoint 2 : Vérification du statut de paiement"),
        createCallout(
          "GET /api/orders/:order_id/status",
          "Interrogé par le Front-end (polling ou écoute temps réel Supabase) pendant que le client valide sur son téléphone.",
          primaryColor
        ),
        createParagraph("Réponse retournée une fois le paiement confirmé :", true),
        createCodeBlock(`{
  "order_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "payment_status": "paid", // "pending" | "paid" | "failed"
  "card_slug": "x7K9p2",
  "card_url": "https://katdigital.ht/?c=x7K9p2",
  "whatsapp_share_url": "https://api.whatsapp.com/send?text=Bonjou%20Vanessa%2C%20men%20kat%20nw%C3%A8l%20mwen%20voye%20pou%20ou%3A%20https%3A%2F%2Fkatdigital.ht%2F%3Fc%3Dx7K9p2"
}`),

        createHeading2("Endpoint 3 : Récupération publique de la carte (Destinataire)"),
        createCallout(
          "GET /api/cards/:slug",
          "Appelé quand le destinataire (ex: Vanessa) clique sur le lien reçu par WhatsApp (katdigital.ht/?c=x7K9p2).",
          accentColor
        ),
        createParagraph("Données renvoyées pour affichage 3D immédiat :", true),
        createCodeBlock(`{
  "slug": "x7K9p2",
  "template": {
    "id": "noel-bordeaux",
    "title": "Nwèl Vlou Bòdo",
    "envelope_color": "#7A1F2D",
    "flap_color": "#5E1722",
    "heading": "Bòn Fèt Nwèl & Kè Kontan"
  },
  "recipient_name": "Vanessa",
  "sender_name": "David",
  "message_content": "Bòn Fèt Nwèl e Bòn Ane 2027!...",
  "created_at": "2026-11-05T18:00:00Z"
}`),

        new Paragraph({ spacing: { after: 160 } }),

        // 7. Modèle de Données Back-End Recommandé
        createHeading1("7. Structure des Tables Recommandée (PostgreSQL / Supabase)"),
        createParagraph(
          "Pour supporter parfaitement ces besoins, voici le schéma des 3 tables principales :"
        ),

        createTable(
          [
            { text: "Table", width: 20 },
            { text: "Champs Clés", width: 45 },
            { text: "Rôle & Sécurité", width: 35 }
          ],
          [
            [
              "templates",
              "id (PK, varchar), title, envelope_color, flap_color, heading, default_message, price_htg, price_usd, is_active",
              "Catalogue des modèles de cartes. Lecture publique, modification restreinte à l'admin."
            ],
            [
              "orders",
              "id (PK, UUID), template_id (FK), recipient_name, sender_name, message_content, payment_gateway, payment_status, phone_number, amount_paid, currency, created_at",
              "Stocke toutes les commandes initiées et leur avancement de paiement ('pending', 'paid', 'failed')."
            ],
            [
              "cards",
              "id (PK, UUID), order_id (FK UNIQUE), slug (VARCHAR UNIQUE), views_count, last_viewed_at, created_at",
              "Cartes finalisées débloquées. Seules les commandes ayant payment_status='paid' possèdent une carte."
            ]
          ]
        ),

        new Paragraph({ spacing: { after: 160 } }),

        // 8. Variables d'Environnement & Prochaines Étapes
        createHeading1("8. Prochaines Étapes & Ce que le Front Attend"),
        createParagraph(
          "Pour que le front-end puisse finaliser les requêtes réseau et tester l'expérience de paiement de bout en bout, nous avons besoin des éléments suivants de la part de l'équipe back-end :"
        ),

        createBullet("1. L'URL de base de l'API", "Exemple : https://api.katdigital.ht/v1 ou URL de l'instance Supabase Edge Functions."),
        createBullet("2. Clés & Environnement de Test", "Clés publiques Supabase / Sandbox MonCash et Stripe Test Mode pour tester les paiements sans débit réel."),
        createBullet("3. Fichier .env.local côté Front", "Préciser les variables nécessaires (ex: VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)."),
        createBullet("4. Validation des payloads", "Confirmer si le format JSON des requêtes ci-dessus convient au backend ou s'il y a des champs spécifiques supplémentaires à ajouter."),

        new Paragraph({ spacing: { after: 200 } }),

        createCallout(
          "KATDIGITAL — COLLABORATION TECHNIQUE FLUIDE",
          "Le front-end est opérationnel avec un rendu 3D optimisé, les modals et l'expérience utilisateur complète. Avec les endpoints de paiement MonCash, Natcash et Stripe branchés sur ces spécifications, la plateforme sera prête pour le lancement en production !",
          primaryColor
        )
      ]
    }
  ]
});

async function main() {
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(process.cwd(), 'KATDIGITAL_DOSSIER_TECHNIQUE_FRONTEND_BACKEND.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Fichier Word généré avec succès : ${outputPath}`);
}

main().catch(err => {
  console.error("Erreur lors de la génération du document :", err);
  process.exit(1);
});
