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
  ShadingType
} from 'docx';
import fs from 'fs';
import path from 'path';

const primaryColor = "2B4736"; // Vert sapin
const accentColor = "C39D5E";  // Or
const darkColor = "1F2922";
const bgLight = "F8F5EE";
const borderColor = "D9D2C5";

const createTitle = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 38,
        color: primaryColor,
        font: "Georgia"
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 60 }
  });
};

const createSubTitle = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: accentColor,
        font: "Georgia"
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 }
  });
};

const createHeading = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: primaryColor,
        font: "Georgia"
      })
    ],
    spacing: { before: 300, after: 120 }
  });
};

const createParagraph = (text, bold = false) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold,
        size: 22,
        font: "Calibri",
        color: "222222"
      })
    ],
    spacing: { after: 100 }
  });
};

// Bloc de code ou schéma textuel propre
const createDiagramBox = (lines) => {
  const tableRows = lines.map(line => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: "F5F2EB" },
          margins: { top: 60, bottom: 60, left: 160, right: 160 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  font: "Consolas",
                  size: 19,
                  color: "1A1816"
                })
              ],
              spacing: { before: 20, after: 20 }
            })
          ]
        })
      ]
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
};

// Carte d'étape visuelle simple
const createStepCard = (num, title, actor, desc) => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: primaryColor },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: num,
                    bold: true,
                    size: 26,
                    color: "FFFFFF",
                    font: "Calibri"
                  })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 90, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: "FAF8F5" },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: title + "  ", bold: true, size: 22, color: primaryColor, font: "Georgia" }),
                  new TextRun({ text: `[${actor}]`, bold: true, size: 18, color: accentColor, font: "Calibri" })
                ],
                spacing: { after: 40 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: desc, size: 20, color: "444444", font: "Calibri" })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
};

const createArrowSeparator = () => {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "  |  ",
        size: 22,
        bold: true,
        color: accentColor,
        font: "Consolas"
      }),
      new TextRun({
        text: "\n  v  ",
        size: 22,
        bold: true,
        color: primaryColor,
        font: "Consolas"
      })
    ],
    spacing: { before: 40, after: 40 }
  });
};

// Tableau SQL propre
const createSqlTable = (headers, rows) => {
  const tableRows = [];

  // En-tête
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => new TableCell({
        width: { size: i === 0 ? 25 : (i === 1 ? 20 : (i === 2 ? 18 : 37)), type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: primaryColor },
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Calibri" })]
          })
        ]
      }))
    })
  );

  // Lignes
  rows.forEach(r => {
    tableRows.push(
      new TableRow({
        children: r.map((cellText, i) => new TableCell({
          width: { size: i === 0 ? 25 : (i === 1 ? 20 : (i === 2 ? 18 : 37)), type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: (i === 0 ? "FFFDF9" : "FFFFFF") },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText,
                  bold: (i === 0 || i === 2),
                  size: 19,
                  color: (i === 2 && cellText.includes("KEY") ? "996B1F" : "222222"),
                  font: (i === 0 ? "Consolas" : "Calibri")
                })
              ]
            })
          ]
        }))
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
};

// Contenu du schéma simple en texte
const schemaTextLines = [
  "+----------------------------------------------------------------------------------------------------+",
  "|                                KATDIGITAL • SCHÉMA DU FLUX GLOBAL                                  |",
  "+----------------------------------------------------------------------------------------------------+",
  "",
  "[ 1. CLIENT ]                  [ 2. PAIEMENT ]           [ 3. SUPABASE ]             [ 4. DESTINATAIRE ]",
  "      |                               |                         |                            |",
  " 1. Choisit un modèle                 |                         |                            |",
  "    (Sans mot de passe)               |                         |                            |",
  "      |                               |                         |                            |",
  " 2. Personnalise le texte             |                         |                            |",
  "    (Aperçu direct instantané)        |                         |                            |",
  "      |                               |                         |                            |",
  " 3. Clique sur 'Partager'             |                         |                            |",
  "    => Ouvre le PAYWALL               |                         |                            |",
  "      |------------------------------>|                         |                            |",
  "                                 4. Choix :                     |                            |",
  "                                    MonCash (100 HTG)           |                            |",
  "                                    ou Stripe ($2.99 USD)       |                            |",
  "                                      |                         |                            |",
  "                                 5. Valide avec son PIN         |                            |",
  "                                    (ou sa carte bancaire)      |                            |",
  "                                      |                         |                            |",
  "                                      |--- 6. Crée la commande ->|                            |",
  "                                      |       (status: PENDING) |                            |",
  "                                      |                         |                            |",
  "                                      |--- 7. Webhook sécurisé ->|                            |",
  "                                              (Paiement certifié)                            |",
  "                                                                |                            |",
  "                                                       8. Active la carte                    |",
  "                                                          status: PAID                       |",
  "                                                          Code slug unique                   |",
  "                                                                |                            |",
  " 9. Débloque les boutons <--------------------------------------|                            |",
  "    - Partager sur WhatsApp                                                                  |",
  "    - Télécharger image PNG                                                                  |",
  "      |                                                                                      |",
  "      |-------------------------- 10. Envoie le lien unique sur WhatsApp ------------------->|",
  "                                                                                             |",
  "                                                                                10. Ouvre l'enveloppe 3D",
  "                                                                                    (Musique & Confettis)",
  "                                                                                             |",
  "                                                                                11. VIRALITÉ :",
  "                                                                                    Bouton au bas :",
  "                                                                                    'Kreye pa w la tou'",
  "                                                                                             |",
  " [ Nouveau Client ] <------------------------------------------------------------------------|"
];

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // TITRE
        createTitle("KATDIGITAL"),
        createSubTitle("Spécification Technique & Flux Système (Supabase)"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Ce document explique de manière simple et directe comment le système fonctionne de A à Z : le parcours client sans mot de passe, les passerelles MonCash/Stripe, et les tables Supabase.",
              italics: true,
              size: 20,
              color: "555555",
              font: "Calibri"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 250 }
        }),

        // SECTION 1 : LE SCHÉMA SIMPLE
        createHeading("1. Le Schéma Simple du Flux"),
        createParagraph("Voici le schéma direct montrant les échanges entre le Client, les Passerelles de Paiement, Supabase et le Destinataire :"),

        createDiagramBox(schemaTextLines),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // SECTION 2 : LES ÉTAPES DU FLUX
        createHeading("2. Les 8 Étapes Expliquées Simplement"),

        createStepCard(
          "1",
          "Choix du Modèle",
          "Client - Front-end",
          "Le client arrive sur katdigital.ht. Il n'a PAS besoin de créer de compte ni de mot de passe (Guest Checkout). Il teste les démos et choisit sa carte préférée."
        ),
        createArrowSeparator(),

        createStepCard(
          "2",
          "Personnalisation en Direct",
          "Client - Front-end",
          "Le client entre le nom du destinataire (ex: Vanessa), son nom (ex: David), et choisit son texte. La carte s'affiche immédiatement avec son texte en direct."
        ),
        createArrowSeparator(),

        createStepCard(
          "3",
          "Déclenchement du Paywall",
          "Psychologie de Vente",
          "Le client clique sur 'Pataje sou WhatsApp'. Une fenêtre élégante apparaît : 'Bèl kat ou an pare ! Peye 100 Goud pou w debloke lyen an epi voye l bay Vanessa'."
        ),
        createArrowSeparator(),

        createStepCard(
          "4",
          "Choix du Paiement",
          "MonCash / Stripe",
          "• Pour Haïti : MonCash (100 Gourdes) via son numéro de téléphone.\n• Pour la Diaspora : Carte Bancaire (2.99 $ USD) via Stripe."
        ),
        createArrowSeparator(),

        createStepCard(
          "5",
          "Validation & Webhook Sécurisé",
          "Supabase Edge Functions",
          "Le client valide son code PIN MonCash (ou sa carte sur Stripe). La passerelle envoie un webhook à Supabase. Supabase vérifie la signature et passe la commande en statut 'PAID'."
        ),
        createArrowSeparator(),

        createStepCard(
          "6",
          "Génération du Lien Unique & Déblocage",
          "Supabase Database",
          "Supabase génère un code court unique (ex: 'x7K9p2') dans la table 'cards'. Le front-end affiche immédiatement l'écran de victoire avec le bouton vert 'Pataje sou WhatsApp' débloqué."
        ),
        createArrowSeparator(),

        createStepCard(
          "7",
          "Réception & Ouverture 3D",
          "Destinataire (Vanessa)",
          "Vanessa reçoit le message WhatsApp contenant le lien. En cliquant, elle découvre l'enveloppe personnalisée qui s'ouvre en 3D avec le carillon musical et les confettis."
        ),
        createArrowSeparator(),

        createStepCard(
          "8",
          "Boucle Virale (Pub Gratuite)",
          "Viral Loop",
          "Au bas de la carte reçue par Vanessa, un bouton discret indique : 'Ou renmen kat sa a? Kreye pa w la tou pou 100 Goud'. Vanessa clique et crée à son tour des cartes pour ses proches."
        ),

        new Paragraph({ text: "", spacing: { after: 250 } }),

        // SECTION 3 : LES TABLES DE BASE DE DONNÉES SUPABASE
        createHeading("3. Les 3 Tables de la Base de Données (Supabase)"),
        createParagraph("Pour que le développeur back-end sache exactement quoi créer sur Supabase :"),

        createParagraph("Table 1 : 'templates' (Les modèles de cartes disponibles)", true),
        createSqlTable(
          ["Colonne", "Type", "Contrainte", "Rôle"],
          [
            ["id", "VARCHAR(50)", "PRIMARY KEY", "Identifiant du modèle (ex: 'noel-bordeaux', 'sapin-emeraude')"],
            ["title", "VARCHAR(100)", "NOT NULL", "Nom du modèle (ex: 'Nwèl Vlou Bòdo')"],
            ["category", "VARCHAR(50)", "NOT NULL", "Filtre ('noel', 'nouvel-an', 'tradition', 'mennaj')"],
            ["envelope_color", "VARCHAR(20)", "NOT NULL", "Couleur HEX de l'enveloppe (ex: '#7A1F2D')"],
            ["heading", "VARCHAR(100)", "NOT NULL", "Titre imprimé sur la carte (ex: 'Bòn Ane 2027')"],
            ["default_message", "TEXT", "NOT NULL", "Message suggéré par défaut"],
            ["price_htg", "INT", "DEFAULT 100", "Prix en Gourdes (100 HTG)"],
            ["price_usd", "DECIMAL(5,2)", "DEFAULT 2.99", "Prix en Dollars ($2.99 USD)"]
          ]
        ),

        new Paragraph({ text: "", spacing: { after: 150 } }),

        createParagraph("Table 2 : 'orders' (Les commandes et paiements des clients)", true),
        createSqlTable(
          ["Colonne", "Type", "Contrainte", "Rôle"],
          [
            ["id", "UUID", "PRIMARY KEY", "Identifiant unique généré automatiquement"],
            ["template_id", "VARCHAR(50)", "FOREIGN KEY", "Relie la commande au modèle de carte acheté"],
            ["recipient_name", "VARCHAR(100)", "NOT NULL", "Nom du destinataire (ex: 'Vanessa')"],
            ["sender_name", "VARCHAR(100)", "NOT NULL", "Nom de l'expéditeur (ex: 'David Jean')"],
            ["message_content", "TEXT", "NOT NULL", "Le message personnalisé rédigé"],
            ["payment_gateway", "VARCHAR(20)", "NOT NULL", "'moncash' ou 'stripe'"],
            ["payment_status", "VARCHAR(20)", "DEFAULT 'pending'", "'pending' (en attente), 'paid' (payé), 'failed'"],
            ["phone_number", "VARCHAR(30)", "NULLABLE", "Numéro de téléphone si payé par MonCash"],
            ["amount_paid", "DECIMAL(10,2)", "NOT NULL", "100.00 ou 2.99"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT now()", "Date et heure de la commande"]
          ]
        ),

        new Paragraph({ text: "", spacing: { after: 150 } }),

        createParagraph("Table 3 : 'cards' (Les cartes débloquées que le destinataire peut voir)", true),
        createSqlTable(
          ["Colonne", "Type", "Contrainte", "Rôle"],
          [
            ["id", "UUID", "PRIMARY KEY", "Identifiant unique interne de la carte"],
            ["order_id", "UUID", "FOREIGN KEY UNIQUE", "Lié obligatoirement à la commande payée"],
            ["slug", "VARCHAR(16)", "UNIQUE NOT NULL", "Code unique du lien public (ex: 'x7K9p2')"],
            ["views_count", "INT", "DEFAULT 0", "Nombre de fois que Vanessa a ouvert l'enveloppe"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT now()", "Date de mise en ligne de la carte"]
          ]
        ),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // SECTION 4 : LES RÔLES DU BACK-END
        createHeading("4. Ce que le Développeur Back-end doit Faire (En Résumé)"),
        createParagraph("1. Créer le projet Supabase et exécuter les scripts SQL des 3 tables ci-dessus.", true),
        createParagraph("2. Coder l'Edge Function 'create-order' qui initialise la commande et génère le lien de paiement MonCash ou Stripe Checkout.", true),
        createParagraph("3. Coder l'Edge Function 'moncash-webhook' et 'stripe-webhook' qui reçoit la confirmation du paiement, passe orders.payment_status = 'paid' et génère la ligne dans 'cards' avec son code court unique.", true),
        createParagraph("4. Coder l'API de lecture publique GET /api/cards/:slug qui renvoie le nom, le message et les couleurs de l'enveloppe au destinataire.", true)
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  const primaryFile = path.join("C:", "Users", "wangu", "Desktop", "katdijital", "SPECIFICATION_TECHNIQUE_BACKEND.docx");
  const alternateFile = path.join("C:", "Users", "wangu", "Desktop", "katdijital", "FLUX_TECHNIQUE_KATDIGITAL.docx");
  
  try {
    fs.writeFileSync(primaryFile, buffer);
    console.log("Fichier principal SPECIFICATION_TECHNIQUE_BACKEND.docx généré avec succès !");
  } catch (err) {
    console.log("Le fichier principal est actuellement ouvert dans Word. Génération du fichier FLUX_TECHNIQUE_KATDIGITAL.docx...");
    fs.writeFileSync(alternateFile, buffer);
    console.log("Fichier FLUX_TECHNIQUE_KATDIGITAL.docx généré avec succès !");
  }
});
