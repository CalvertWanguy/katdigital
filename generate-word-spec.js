import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType } from 'docx';
import fs from 'fs';
import path from 'path';

const primaryColor = "2B4736"; // Vert sapin
const accentColor = "C39D5E";  // Or
const lightGray = "F4EFE6";

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

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // TITRE PRINCIPAL
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
              size: 28,
              color: accentColor,
              font: "Georgia"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 180 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Guide officiel pour le développeur back-end : flux utilisateur étape par étape, schéma PostgreSQL sur Supabase, Edge Functions et webhooks MonCash / Stripe.",
              italics: true,
              size: 20,
              color: "666666",
              font: "Calibri"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 280 }
        }),

        // 1. LE FLUX UTILISATEUR ÉTAPE PAR ÉTAPE (LE PARCOURS CLIENT)
        createHeaderParagraph("1. Le Flux Utilisateur Étape par Étape (User Journey)", HeadingLevel.HEADING_2),
        createParagraph("Pour maximiser les conversions et éliminer toute friction, le projet adopte la stratégie d'achat d'impulsion sans création de compte obligatoire (Guest Checkout) :"),

        createDbTable(
          ["Étape", "Action de l'Utilisateur", "Action du Front-end", "Rôle du Back-end (Supabase)"],
          [
            [
              "1. Découverte",
              "Arrive sur katdigital.ht, explore le catalogue et teste les démos d'ouverture 3D.",
              "Affiche le catalogue de cartes depuis le cache ou l'API.",
              "Fournit la table 'templates' avec les modèles actifs."
            ],
            [
              "2. Création",
              "Clique sur 'Pèsonalize', tape le destinataire, son nom et choisit/modifie son message.",
              "Met à jour l'état local et offre un aperçu immédiat en direct.",
              "Aucun appel serveur nécessaire à cette étape (expérience instantanée)."
            ],
            [
              "3. Paywall",
              "Clique sur 'Pataje sou WhatsApp' ou 'Telechaje'. Choisit MonCash (100 Goud) ou Carte ($2.99).",
              "Appelle POST /api/orders/create avec les données de la carte et le moyen de paiement.",
              "Insère la commande dans 'orders' avec statut 'pending' et génère la session MonCash / Stripe."
            ],
            [
              "4. Paiement",
              "Valide avec son code PIN MonCash sur son téléphone (ou saisit sa carte sur Stripe).",
              "Attend la confirmation ou redirige le client.",
              "Reçoit le webhook certifié, passe le statut en 'paid', et crée la carte dans la table 'cards' avec un code court unique (ex: 'x7K9p2')."
            ],
            [
              "5. Déblocage",
              "Reçoit l'écran de succès avec le lien de sa carte débloqué.",
              "Débloque le bouton 'Pataje sou WhatsApp' et 'Telechaje Imaj PNG'.",
              "Fournit les métadonnées Open Graph pour un bel aperçu sur WhatsApp."
            ],
            [
              "6. Réception",
              "Le destinataire (Vanessa) clique sur le lien WhatsApp reçu.",
              "Ouvre directement l'enveloppe personnalisée avec musique et confettis.",
              "Incrémente le compteur 'views_count' et renvoie les données publiques sécurisées."
            ]
          ],
          [16, 28, 28, 28]
        ),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // 2. POURQUOI SUPABASE EST LE CHOIX PARFAIT
        createHeaderParagraph("2. Pourquoi Supabase pour ce projet ?", HeadingLevel.HEADING_2),
        createBullet("PostgreSQL Robuste", "Gestion relationnelle parfaite des commandes, cartes et logs financiers."),
        createBullet("Supabase Edge Functions", "Permet d'exécuter du code TypeScript sécurisé sans serveur lourd pour gérer les webhooks MonCash et Stripe."),
        createBullet("Table Editor Intuitif", "Toute l'équipe peut visualiser en temps réel les cartes vendues et les revenus sans coder de back-office dédié."),
        createBullet("Sécurité RLS", "Row Level Security native pour garantir qu'aucune carte non payée ne puisse être lue publiquement."),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // 3. SCHÉMA DE BASE DE DONNÉES SUPABASE (TABLEAUX & RELATIONS)
        createHeaderParagraph("3. Schéma Relationnel de la Base de Données (Supabase SQL)", HeadingLevel.HEADING_2),

        createParagraph("Tableau des relations de clés étrangères :", true),
        createDbTable(
          ["Table Source", "Clé Étrangère (FK)", "Table Cible (PK)", "Type de Relation & Description"],
          [
            ["orders", "template_id", "templates.id", "Plusieurs commandes peuvent utiliser le même modèle de carte (Many-to-One)."],
            ["cards", "order_id", "orders.id", "Une commande payée génère exactement une carte consultable (One-to-One sécurisé)."],
            ["webhook_logs", "order_id", "orders.id", "Traçabilité financière : plusieurs notifications webhook pour une commande (Many-to-One)."]
          ],
          [20, 20, 20, 40]
        ),

        new Paragraph({ text: "", spacing: { after: 150 } }),

        createParagraph("Structure détaillée des tables :", true),

        createParagraph("Table 'templates' (Catalogue des modèles) :", true),
        createDbTable(
          ["Champ (Colonne)", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "VARCHAR(50)", "PRIMARY KEY", "Identifiant du modèle (ex: 'noel-bordeaux', 'sapin-emeraude')."],
            ["title", "VARCHAR(100)", "NOT NULL", "Nom public (ex: 'Nwèl Vlou Bòdo')."],
            ["category", "VARCHAR(50)", "NOT NULL", "Filtre ('noel', 'nouvel-an', 'tradition', 'mennaj')."],
            ["envelope_color", "VARCHAR(20)", "NOT NULL", "Couleur HEX de l'enveloppe (ex: '#7A1F2D')."],
            ["heading", "VARCHAR(100)", "NOT NULL", "Titre de la carte (ex: 'Jwaye Nwèl & Bòn Ane 2027')."],
            ["default_message", "TEXT", "NOT NULL", "Texte suggéré par défaut en kreyòl."],
            ["price_htg", "INT", "DEFAULT 100", "Prix en Gourdes pour Haïti (100 HTG)."],
            ["price_usd", "DECIMAL(5,2)", "DEFAULT 2.99", "Prix en Dollars pour la diaspora (2.99 $)."],
            ["is_active", "BOOLEAN", "DEFAULT TRUE", "Visibilité dans le catalogue."]
          ],
          [22, 18, 18, 42]
        ),

        new Paragraph({ text: "", spacing: { after: 150 } }),

        createParagraph("Table 'orders' (Commandes et paiements) :", true),
        createDbTable(
          ["Champ (Colonne)", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "UUID", "PRIMARY KEY DEFAULT gen_random_uuid()", "Identifiant unique interne."],
            ["template_id", "VARCHAR(50)", "FK -> templates.id", "Modèle de carte commandé."],
            ["recipient_name", "VARCHAR(100)", "NOT NULL", "Nom du destinataire (ex: 'Vanessa')."],
            ["sender_name", "VARCHAR(100)", "NOT NULL", "Nom de l'expéditeur (ex: 'David Jean')."],
            ["message_content", "TEXT", "NOT NULL", "Message rédigé par le client."],
            ["payment_gateway", "VARCHAR(20)", "NOT NULL", "'moncash' ou 'stripe'."],
            ["payment_status", "VARCHAR(20)", "DEFAULT 'pending'", "'pending', 'paid' ou 'failed'."],
            ["phone_number", "VARCHAR(30)", "NULLABLE", "Numéro de téléphone de l'acheteur si MonCash."],
            ["transaction_ref", "VARCHAR(100)", "NULLABLE", "ID de transaction externe Digicel ou Stripe."],
            ["amount_paid", "DECIMAL(10,2)", "NOT NULL", "Montant réglé (100.00 ou 2.99)."],
            ["currency", "VARCHAR(5)", "NOT NULL", "'HTG' ou 'USD'."],
            ["created_at", "TIMESTAMPTZ", "DEFAULT now()", "Horodatage de la commande."]
          ],
          [22, 18, 22, 38]
        ),

        new Paragraph({ text: "", spacing: { after: 150 } }),

        createParagraph("Table 'cards' (Cartes débloquées pour le destinataire) :", true),
        createDbTable(
          ["Champ (Colonne)", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "UUID", "PRIMARY KEY DEFAULT gen_random_uuid()", "Identifiant technique."],
            ["order_id", "UUID", "FK -> orders.id UNIQUE", "Liaison stricte à la commande réglée."],
            ["slug", "VARCHAR(16)", "UNIQUE NOT NULL", "Code court du lien public (ex: 'x7K9p2' pour katdigital.ht/v/x7K9p2)."],
            ["views_count", "INT", "DEFAULT 0", "Nombre d'ouvertures de l'enveloppe par le destinataire."],
            ["last_viewed_at", "TIMESTAMPTZ", "NULLABLE", "Date de dernière consultation."],
            ["created_at", "TIMESTAMPTZ", "DEFAULT now()", "Date d'activation de la carte."]
          ],
          [22, 18, 22, 38]
        ),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // 4. SUPABASE EDGE FUNCTIONS À CODER PAR LE BACK-END
        createHeaderParagraph("4. Les 3 Fonctions Clés (Supabase Edge Functions)", HeadingLevel.HEADING_2),
        createBullet("Fonction 1 : 'create-order'", "Reçoit la personnalisation du front, enregistre l'ordre en 'pending', et communique avec l'API Digicel Business (pour obtenir le token de paiement MonCash) ou Stripe (pour générer la session de paiement)."),
        createBullet("Fonction 2 : 'moncash-webhook'", "Écoute les notifications serveur de Digicel. Dès que le code PIN est validé, met à jour orders.payment_status = 'paid', génère un code court 'slug' unique (ex: 'x7K9p2'), et crée la ligne correspondante dans la table 'cards'."),
        createBullet("Fonction 3 : 'stripe-webhook'", "Écoute l'événement 'checkout.session.completed'. Vérifie la signature cryptographique du webhook Stripe, active la carte et renvoie le lien unique.")
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join("C:", "Users", "wangu", "Desktop", "katdijital", "SPECIFICATION_TECHNIQUE_BACKEND.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("Document Word enrichi avec le flux et Supabase généré avec succès !");
});
