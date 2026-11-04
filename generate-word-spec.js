import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType } from 'docx';
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

  // En-tête
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => createStyledCell(h, true, widths[i]))
    })
  );

  // Lignes de données
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
              text: "Spécification de la Base de Données & Relations",
              bold: true,
              size: 28,
              color: accentColor,
              font: "Georgia"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Guide d'ingénierie back-end : schéma relationnel, tables, clés étrangères et cycle de vie des cartes.",
              italics: true,
              size: 20,
              color: "666666",
              font: "Calibri"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),

        // 1. VUE D'ENSEMBLE DES RELATIONS
        createHeaderParagraph("1. Schéma des Relations entre les Tables (MCD / MLD)", HeadingLevel.HEADING_2),
        createParagraph("La base de données repose sur 3 tables principales et 1 table d'audit financier. Voici le tableau récapitulatif des relations (clés étrangères) :"),

        createDbTable(
          ["Table Source", "Clé Étrangère (FK)", "Table Cible (PK)", "Type de Relation & Description"],
          [
            ["orders", "template_id", "templates.id", "Plusieurs commandes peuvent utiliser le même modèle de carte (Many-to-One)."],
            ["cards", "order_id", "orders.id", "Une commande payée génère exactement une carte consultable (One-to-One sécurisé)."],
            ["webhook_logs", "order_id", "orders.id", "Traçabilité : une commande peut avoir plusieurs webhooks reçus (Many-to-One)."]
          ],
          [20, 20, 20, 40]
        ),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // 2. DÉTAIL DE LA TABLE TEMPLATES
        createHeaderParagraph("2. Table 'templates' (Catalogue des modèles de cartes)", HeadingLevel.HEADING_2),
        createParagraph("Contient les modèles de cartes prédéfinis affichés sur le front-end :"),

        createDbTable(
          ["Champ (Colonne)", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "VARCHAR(50)", "PRIMARY KEY", "Identifiant unique du modèle (ex: 'noel-bordeaux', 'sapin-emeraude')."],
            ["title", "VARCHAR(100)", "NOT NULL", "Nom public du modèle (ex: 'Nwèl Vlou Bòdo')."],
            ["category", "VARCHAR(50)", "NOT NULL", "Catégorie de filtre ('noel', 'nouvel-an', 'tradition', 'mennaj')."],
            ["envelope_color", "VARCHAR(20)", "NOT NULL", "Couleur HEX de l'enveloppe extérieure (ex: '#7A1F2D')."],
            ["flap_color", "VARCHAR(20)", "NOT NULL", "Couleur HEX du rabat supérieur 3D (ex: '#8B2535')."],
            ["heading", "VARCHAR(100)", "NOT NULL", "Titre imprimé sur la carte (ex: 'Jwaye Nwèl & Bòn Ane 2027')."],
            ["default_message", "TEXT", "NOT NULL", "Message suggéré par défaut en kreyòl."],
            ["price_htg", "INT", "DEFAULT 100", "Prix standard en Gourdes pour Haïti."],
            ["price_usd", "DECIMAL(5,2)", "DEFAULT 2.99", "Prix standard en Dollars USD pour la diaspora."],
            ["is_active", "BOOLEAN", "DEFAULT TRUE", "Activer ou désactiver la visibilité dans le catalogue."]
          ],
          [22, 18, 18, 42]
        ),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // 3. DÉTAIL DE LA TABLE ORDERS
        createHeaderParagraph("3. Table 'orders' (Commandes et transactions en attente)", HeadingLevel.HEADING_2),
        createParagraph("Enregistre chaque tentative d'achat avant et après paiement :"),

        createDbTable(
          ["Champ (Colonne)", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "UUID", "PRIMARY KEY", "Identifiant unique de la commande (ex: 'c3f1b2...')."],
            ["template_id", "VARCHAR(50)", "FK -> templates", "Référence au modèle de carte choisi."],
            ["recipient_name", "VARCHAR(100)", "NOT NULL", "Nom du destinataire (ex: 'Vanessa')."],
            ["sender_name", "VARCHAR(100)", "NOT NULL", "Nom de l'expéditeur (ex: 'David Jean')."],
            ["message_content", "TEXT", "NOT NULL", "Texte personnalisé rédigé ou choisi par l'acheteur."],
            ["payment_gateway", "VARCHAR(20)", "NOT NULL", "'moncash' (Digicel) ou 'stripe' (Carte bancaire)."],
            ["payment_status", "VARCHAR(20)", "DEFAULT 'pending'", "'pending' (en cours), 'paid' (validé) ou 'failed'."],
            ["phone_number", "VARCHAR(30)", "NULLABLE", "Numéro de téléphone de l'acheteur (si MonCash)."],
            ["transaction_ref", "VARCHAR(100)", "NULLABLE", "Référence de transaction reçue par le Webhook."],
            ["amount_paid", "DECIMAL(10,2)", "NOT NULL", "Montant réglé (100.00 ou 2.99)."],
            ["currency", "VARCHAR(5)", "NOT NULL", "'HTG' pour Haïti, 'USD' pour l'international."],
            ["created_at", "TIMESTAMP", "CURRENT_TIMESTAMP", "Date et heure de création de la commande."]
          ],
          [22, 18, 20, 40]
        ),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // 4. DÉTAIL DE LA TABLE CARDS
        createHeaderParagraph("4. Table 'cards' (Cartes actives avec lien unique)", HeadingLevel.HEADING_2),
        createParagraph("Créée UNIQUEMENT après confirmation réelle du paiement par le Webhook :"),

        createDbTable(
          ["Champ (Colonne)", "Type SQL", "Contrainte", "Description / Exemple"],
          [
            ["id", "UUID", "PRIMARY KEY", "Identifiant technique interne."],
            ["order_id", "UUID", "FK -> orders (UNIQUE)", "Lien direct vers la commande réglée."],
            ["slug", "VARCHAR(16)", "UNIQUE NOT NULL", "Code court du lien public (ex: 'k8F9x2' pour katdigital.ht/v/k8F9x2)."],
            ["views_count", "INT", "DEFAULT 0", "Nombre de fois que le destinataire a ouvert l'enveloppe."],
            ["last_viewed_at", "TIMESTAMP", "NULLABLE", "Dernière consultation de la carte."],
            ["created_at", "TIMESTAMP", "CURRENT_TIMESTAMP", "Date d'activation de la carte."]
          ],
          [22, 18, 22, 38]
        ),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // 5. CYCLE DE VIE D'UNE CARTE
        createHeaderParagraph("5. Cycle de Vie d'une Carte (Du clic au destinataire)", HeadingLevel.HEADING_2),
        createBullet("Étape 1 (Panier)", "L'utilisateur saisit son prénom, le destinataire et le message. Le front appelle POST /api/orders/create. Une ligne est créée dans 'orders' avec payment_status = 'pending'."),
        createBullet("Étape 2 (Paiement)", "L'utilisateur règle 100 Goud sur MonCash (ou 2.99 $ sur Stripe Checkout)."),
        createBullet("Étape 3 (Activation Webhook)", "Le serveur Digicel ou Stripe appelle le Webhook du back-end. Le back-end vérifie la signature, passe 'orders.payment_status' à 'paid', et insère une nouvelle ligne dans 'cards' avec un slug aléatoire (ex: 'x7K9p2')."),
        createBullet("Étape 4 (Consultation)", "Quand le destinataire clique sur katdigital.ht/v/x7K9p2, le front-end appelle GET /api/cards/x7K9p2. Le serveur incrémente 'views_count' et renvoie l'enveloppe avec son message personnalisé !")
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join("C:", "Users", "wangu", "Desktop", "katdijital", "SPECIFICATION_TECHNIQUE_BACKEND.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("Fichier Word DOCX régénéré avec succès avec les tableaux de base de données : " + outputPath);
});
