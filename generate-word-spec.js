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
  ImageRun
} from 'docx';
import fs from 'fs';
import path from 'path';

const primaryColor = "2B4736"; // Vert sapin
const accentColor = "C39D5E";  // Or
const lightGray = "F4EFE6";
const borderColor = "D9D2C5";

const createHeaderParagraph = (text, level = HeadingLevel.HEADING_2) => {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 280, after: 120 }
  });
};

const createParagraph = (text, bold = false) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        size: 22,
        font: "Calibri"
      })
    ],
    spacing: { after: 100 }
  });
};

const createBullet = (label, desc) => {
  return new Paragraph({
    children: [
      new TextRun({ text: "• " + label + " : ", bold: true, color: primaryColor, size: 22, font: "Calibri" }),
      new TextRun({ text: desc, size: 22, font: "Calibri" })
    ],
    spacing: { after: 80 },
    indent: { left: 360 }
  });
};

const createStyledCell = (text, isHeader = false, widthPercent = 25, isKey = false) => {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: {
      type: ShadingType.CLEAR,
      fill: isHeader ? primaryColor : (isKey ? "FFF9E6" : "FFFFFF")
    },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: isHeader || isKey,
            size: isHeader ? 20 : 19,
            color: isHeader ? "FFFFFF" : (isKey ? "855D10" : "222222"),
            font: isKey ? "Consolas" : "Calibri"
          })
        ]
      })
    ]
  });
};

const createDbTable = (headers, rows, widths = [22, 18, 15, 45]) => {
  const tableRows = [];

  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => createStyledCell(h, true, widths[i]))
    })
  );

  rows.forEach(r => {
    tableRows.push(
      new TableRow({
        children: r.map((cellText, i) => createStyledCell(cellText, false, widths[i], i === 0 || i === 2))
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
};

// Chargement de l'image du schéma
const imagePath = path.join("C:", "Users", "wangu", "Desktop", "katdijital", "schema_flux_katdigital.png");
let diagramImageBuffer = null;
if (fs.existsSync(imagePath)) {
  diagramImageBuffer = fs.readFileSync(imagePath);
}

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // ========================================================
        // EN-TÊTE PRINCIPAL DU DOCUMENT
        // ========================================================
        new Paragraph({
          children: [
            new TextRun({
              text: "KATDIGITAL",
              bold: true,
              size: 44,
              color: primaryColor,
              font: "Georgia"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 60 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Spécification Technique & Architecture Back-end (Supabase)",
              bold: true,
              size: 26,
              color: accentColor,
              font: "Georgia"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 140 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Document officiel pour le développeur back-end : Schéma visuel du flux global, parcours Guest Checkout (sans compte), modèle relationnel PostgreSQL (Supabase), Edge Functions et passerelles MonCash (100 HTG) & Stripe ($2.99 USD).",
              italics: true,
              size: 20,
              color: "555555",
              font: "Calibri"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 }
        }),

        // ========================================================
        // 1. LE SCHÉMA VISUEL DU FLUX TECHNIQUE DU PROJET
        // ========================================================
        createHeaderParagraph("1. Schéma Visuel du Flux Global du Système", HeadingLevel.HEADING_1),
        createParagraph(
          "Ce diagramme d'architecture résume le parcours complet d'une carte : de la visite sans mot de passe (Guest Checkout) jusqu'au déblocage après paiement MonCash/Stripe, et l'activation de la boucle de viralité pour acquérir de nouveaux clients sans frais publicitaires."
        ),

        // Insertion du schéma PNG haute résolution
        ...(diagramImageBuffer ? [
          new Paragraph({
            children: [
              new ImageRun({
                data: diagramImageBuffer,
                transformation: {
                  width: 620,
                  height: 422
                }
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 140, after: 120 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Figure 1 : Schéma des 4 Colonnes d'Exécution (Client -> Passerelles -> Supabase -> Destinataire & Viralité)",
                italics: true,
                size: 18,
                color: "777777",
                font: "Calibri"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 220 }
          })
        ] : []),

        // ========================================================
        // 2. LE FLUX UTILISATEUR ÉTAPE PAR ÉTAPE (DÉTAILLÉ)
        // ========================================================
        createHeaderParagraph("2. Le Parcours Utilisateur & Rôles Système (Étape par Étape)", HeadingLevel.HEADING_2),
        createParagraph(
          "Pour maximiser le taux de conversion (plus de 85% d'abandons en moins), la plateforme supprime toute obligation de mot de passe ou de connexion Google. Le client teste, personnalise et s'attache à sa création avant de payer pour débloquer le partage :"
        ),

        createDbTable(
          ["Étape", "Action Client", "Comportement Front-end", "Traitement Back-end (Supabase)"],
          [
            [
              "1. Découverte",
              "Arrive sur katdigital.ht, consulte le catalogue et teste la démo animée 3D.",
              "Affiche le catalogue de cartes en cache local.",
              "Met à disposition la table 'templates' avec les modèles actifs et leurs couleurs."
            ],
            [
              "2. Création",
              "Tape le nom du destinataire (Vanessa), son nom (David), et choisit son message.",
              "Met à jour l'état local en direct. La carte est visualisée instantanément.",
              "Aucune requête serveur (latence 0 pour l'utilisateur)."
            ],
            [
              "3. Paywall",
              "Clique sur 'Pataje sou WhatsApp' ou 'Telechaje'. Choisit MonCash (100 Goud) ou Carte ($2.99).",
              "Déclenche POST /api/orders/create avec le payload de la carte personnalisée.",
              "Edge Function 'create-order' crée la ligne dans 'orders' (status: 'pending') et génère le token MonCash ou la session Stripe."
            ],
            [
              "4. Paiement",
              "Valide avec son PIN sur son téléphone (MonCash) ou entre sa carte sur Stripe Checkout.",
              "Affiche un écran d'attente convivial avec polling ou écoute de l'événement.",
              "Reçoit le webhook sécurisé de Digicel ou Stripe, certifie la signature cryptographique et passe orders.payment_status = 'paid'."
            ],
            [
              "5. Déblocage",
              "Reçoit l'écran de victoire avec confettis et lien débloqué.",
              "Affiche les boutons 'Pataje sou WhatsApp' et 'Telechaje Imaj PNG'.",
              "Génère un slug unique (ex: 'x7K9p2'), insère dans 'cards', et fournit les balises Open Graph pour WhatsApp."
            ],
            [
              "6. Réception",
              "Le destinataire (Vanessa) clique sur le lien WhatsApp reçu.",
              "Ouvre l'enveloppe personnalisée en 3D avec musique festive et confettis.",
              "GET /api/cards/x7K9p2 renvoie les données publiques et incrémente views_count."
            ],
            [
              "7. Viralité",
              "Vanessa voit au bas de sa carte : 'Ou renmen kat sa a? Kreye pa w la tou pou 100 Goud'.",
              "Clique sur le bouton et ouvre le créateur de carte pour ses propres proches.",
              "Nouvelle commande créée -> Boucle virale d'acquisition gratuite !"
            ]
          ],
          [14, 28, 28, 30]
        ),

        new Paragraph({ text: "", spacing: { after: 180 } }),

        // ========================================================
        // 3. ARCHITECTURE TECHNIQUE SUPABASE
        // ========================================================
        createHeaderParagraph("3. Pourquoi Supabase pour l'Architecture Technique ?", HeadingLevel.HEADING_2),
        createBullet("Base Relationnelle PostgreSQL", "Stockage intègre et robuste des commandes, statuts financiers et cartes débloquées."),
        createBullet("Supabase Edge Functions (Deno / TypeScript)", "Permet d'exécuter des webhooks ultra-rapides et sécurisés (HMAC SHA-256) sans gérer de serveur VPS lourd."),
        createBullet("Table Editor & Dashboard", "Permet à l'équipe opérationnelle de suivre les ventes en direct et d'exporter les rapports financiers sans coder de back-office dédié."),
        createBullet("Sécurité RLS (Row Level Security)", "Garantit qu'aucune carte avec un statut 'pending' ou 'failed' ne puisse être lue par une URL publique."),

        new Paragraph({ text: "", spacing: { after: 180 } }),

        // ========================================================
        // 4. SCHÉMA RELATIONNEL DE LA BASE DE DONNÉES (SQL)
        // ========================================================
        createHeaderParagraph("4. Schéma Relationnel des Tables Supabase (MCD / MLD)", HeadingLevel.HEADING_2),

        createParagraph("Tableau récapitulatif des relations (Clés étrangères) :", true),
        createDbTable(
          ["Table Source", "Clé Étrangère (FK)", "Table Cible (PK)", "Type de Relation & Règle"],
          [
            ["orders", "template_id", "templates.id", "Plusieurs commandes peuvent utiliser le même modèle de carte (Many-to-One)."],
            ["cards", "order_id", "orders.id", "Une commande validée génère exactement UNE carte unique publique (One-to-One sécurisé)."],
            ["webhook_logs", "order_id", "orders.id", "Traçabilité et audit financier : plusieurs logs possibles par commande (Many-to-One)."]
          ],
          [20, 20, 20, 40]
        ),

        new Paragraph({ text: "", spacing: { after: 140 } }),

        createParagraph("Table 1 : 'templates' (Catalogue des modèles de cartes)", true),
        createDbTable(
          ["Colonne", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "VARCHAR(50)", "PRIMARY KEY", "Identifiant du modèle (ex: 'noel-bordeaux', 'sapin-emeraude')."],
            ["title", "VARCHAR(100)", "NOT NULL", "Nom affiché (ex: 'Nwèl Vlou Bòdo')."],
            ["category", "VARCHAR(50)", "NOT NULL", "Catégorie ('noel', 'nouvel-an', 'tradition', 'mennaj')."],
            ["envelope_color", "VARCHAR(20)", "NOT NULL", "Couleur HEX de l'enveloppe (ex: '#7A1F2D')."],
            ["flap_color", "VARCHAR(20)", "NOT NULL", "Couleur HEX du rabat supérieur 3D."],
            ["heading", "VARCHAR(100)", "NOT NULL", "Titre imprimé sur la carte (ex: 'Bòn Ane 2027 & Siksè')."],
            ["default_message", "TEXT", "NOT NULL", "Texte suggéré par défaut en kreyòl."],
            ["price_htg", "INT", "DEFAULT 100", "Prix pour Haïti en Gourdes (100 HTG)."],
            ["price_usd", "DECIMAL(5,2)", "DEFAULT 2.99", "Prix pour la diaspora en USD (2.99 $)."],
            ["is_active", "BOOLEAN", "DEFAULT TRUE", "Visibilité dans le catalogue public."]
          ],
          [22, 18, 18, 42]
        ),

        new Paragraph({ text: "", spacing: { after: 140 } }),

        createParagraph("Table 2 : 'orders' (Commandes, acheteurs et transactions)", true),
        createDbTable(
          ["Colonne", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "UUID", "PRIMARY KEY DEFAULT gen_random_uuid()", "Identifiant unique interne de la commande."],
            ["template_id", "VARCHAR(50)", "FK -> templates.id", "Référence au modèle de carte acheté."],
            ["recipient_name", "VARCHAR(100)", "NOT NULL", "Nom du destinataire (ex: 'Vanessa')."],
            ["sender_name", "VARCHAR(100)", "NOT NULL", "Nom de l'expéditeur (ex: 'David Jean')."],
            ["message_content", "TEXT", "NOT NULL", "Message personnalisé rédigé par le client."],
            ["payment_gateway", "VARCHAR(20)", "NOT NULL", "'moncash' (Haïti) ou 'stripe' (Diaspora)."],
            ["payment_status", "VARCHAR(20)", "DEFAULT 'pending'", "'pending', 'paid' ou 'failed'."],
            ["phone_number", "VARCHAR(30)", "NULLABLE", "Numéro de téléphone de l'acheteur (requis si MonCash)."],
            ["customer_email", "VARCHAR(150)", "NULLABLE", "Email de l'acheteur (si Stripe)."],
            ["transaction_ref", "VARCHAR(100)", "NULLABLE", "ID de transaction externe Digicel ou Stripe."],
            ["amount_paid", "DECIMAL(10,2)", "NOT NULL", "Montant réglé (100.00 ou 2.99)."],
            ["currency", "VARCHAR(5)", "NOT NULL", "'HTG' ou 'USD'."],
            ["created_at", "TIMESTAMPTZ", "DEFAULT now()", "Horodatage de la commande."]
          ],
          [22, 18, 22, 38]
        ),

        new Paragraph({ text: "", spacing: { after: 140 } }),

        createParagraph("Table 3 : 'cards' (Cartes actives consultables par le destinataire)", true),
        createDbTable(
          ["Colonne", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "UUID", "PRIMARY KEY DEFAULT gen_random_uuid()", "Identifiant technique."],
            ["order_id", "UUID", "FK -> orders.id UNIQUE", "Liaison stricte à la commande réglée."],
            ["slug", "VARCHAR(16)", "UNIQUE NOT NULL", "Code court du lien public (ex: 'x7K9p2' pour katdigital.ht/?c=x7K9p2)."],
            ["views_count", "INT", "DEFAULT 0", "Nombre d'ouvertures de l'enveloppe par le destinataire."],
            ["last_viewed_at", "TIMESTAMPTZ", "NULLABLE", "Date et heure de dernière ouverture."],
            ["created_at", "TIMESTAMPTZ", "DEFAULT now()", "Date de génération de la carte débloquée."]
          ],
          [22, 18, 22, 38]
        ),

        new Paragraph({ text: "", spacing: { after: 180 } }),

        // ========================================================
        // 5. LES 3 EDGE FUNCTIONS À CODER PAR LE BACK-END
        // ========================================================
        createHeaderParagraph("5. Les 3 Supabase Edge Functions à Implémenter", HeadingLevel.HEADING_2),
        createBullet(
          "1. 'create-order' (POST /functions/v1/create-order)",
          "Reçoit les données de la carte et le moyen de paiement. Insère dans 'orders' avec status 'pending'. Communique avec l'API Digicel Business (pour obtenir le token de redirection MonCash) ou avec l'API Stripe (pour créer la session Stripe Checkout). Renvoie l'URL de paiement au front-end."
        ),
        createBullet(
          "2. 'moncash-webhook' (POST /functions/v1/moncash-webhook)",
          "Point d'entrée serveur appelé par Digicel dès validation du code PIN. Vérifie la transaction via l'API MonCash, met à jour orders.payment_status = 'paid', génère un slug unique aléatoire (ex: 'k9X2p7'), et insère la carte débloquée dans la table 'cards'."
        ),
        createBullet(
          "3. 'stripe-webhook' (POST /functions/v1/stripe-webhook)",
          "Écoute l'événement 'checkout.session.completed'. Valide la signature cryptographique du header 'stripe-signature' avec le secret du webhook. Passe orders.payment_status = 'paid' et génère la carte dans 'cards'."
        ),

        new Paragraph({ text: "", spacing: { after: 180 } }),

        // ========================================================
        // 6. RÈGLES DE SÉCURITÉ & ANTI-FRAUDE
        // ========================================================
        createHeaderParagraph("6. Règles de Sécurité & Anti-Fraude", HeadingLevel.HEADING_2),
        createBullet("Aucune génération de lien côté client", "Le slug unique ne doit JAMAIS être créé par le navigateur du client. Seul le serveur Supabase crée le slug dans la table 'cards' une fois le paiement vérifié par le webhook."),
        createBullet("Idempotence des Webhooks", "Si Digicel ou Stripe renvoie le même webhook deux fois, le serveur vérifie si orders.payment_status est déjà 'paid' pour éviter de dupliquer les cartes ou les crédits."),
        createBullet("Accès Public Sécurisé (RLS)", "La lecture publique d'une carte (GET /api/cards/:slug) ne renvoie QUE le nom du destinataire, le nom de l'expéditeur, le message et les couleurs du modèle. Aucune donnée financière, ni numéro de téléphone, ni montant n'est exposé au destinataire.")
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join("C:", "Users", "wangu", "Desktop", "katdijital", "SPECIFICATION_TECHNIQUE_BACKEND.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("Document Word régénéré avec succès avec le schéma graphique complet !");
});
