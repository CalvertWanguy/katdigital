# KatDigital • Spécification Base de Données & Relations Back-end

Document d'ingénierie logicielle pour l'intégration de la base de données, des relations de clés étrangères et du cycle de vie des cartes.

---

## 1. Schéma des Relations entre les Tables (MCD / MLD)

| Table Source | Clé Étrangère (FK) | Table Cible (PK) | Type de Relation & Description |
| :--- | :--- | :--- | :--- |
| **`orders`** | `template_id` | `templates.id` | Plusieurs commandes peuvent utiliser le même modèle de carte (Many-to-One). |
| **`cards`** | `order_id` | `orders.id` | Une commande payée génère exactement une carte consultable (One-to-One sécurisé). |
| **`webhook_logs`** | `order_id` | `orders.id` | Traçabilité financière : une commande peut recevoir plusieurs notifications de webhook (Many-to-One). |

---

## 2. Table `templates` (Catalogue des modèles de cartes)

Contient les modèles de cartes prédéfinis affichés sur le catalogue front-end :

| Champ (Colonne) | Type SQL | Contrainte | Description / Exemple |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | **PRIMARY KEY** | Identifiant unique du modèle (ex: `noel-bordeaux`, `sapin-emeraude`). |
| `title` | VARCHAR(100) | NOT NULL | Nom public du modèle (ex: `Nwèl Vlou Bòdo`). |
| `category` | VARCHAR(50) | NOT NULL | Catégorie de filtre (`noel`, `nouvel-an`, `tradition`, `mennaj`). |
| `envelope_color` | VARCHAR(20) | NOT NULL | Couleur HEX de l'enveloppe extérieure (ex: `#7A1F2D`). |
| `flap_color` | VARCHAR(20) | NOT NULL | Couleur HEX du rabat supérieur 3D (ex: `#8B2535`). |
| `heading` | VARCHAR(100) | NOT NULL | Titre imprimé sur la carte (ex: `Jwaye Nwèl & Bòn Ane 2027`). |
| `default_message` | TEXT | NOT NULL | Message suggéré par défaut en kreyòl. |
| `price_htg` | INT | DEFAULT 100 | Prix standard en Gourdes pour Haïti. |
| `price_usd` | DECIMAL(5,2) | DEFAULT 2.99 | Prix standard en Dollars USD pour la diaspora. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Activer ou désactiver la visibilité dans le catalogue. |

---

## 3. Table `orders` (Commandes et transactions)

Enregistre chaque tentative d'achat avant et après validation du paiement :

| Champ (Colonne) | Type SQL | Contrainte | Description / Exemple |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PRIMARY KEY** | Identifiant unique de la commande (ex: `c3f1b2...`). |
| `template_id` | VARCHAR(50) | **FK -> templates.id** | Référence au modèle de carte choisi. |
| `recipient_name` | VARCHAR(100) | NOT NULL | Nom du destinataire (ex: `Vanessa`). |
| `sender_name` | VARCHAR(100) | NOT NULL | Nom de l'expéditeur (ex: `David Jean`). |
| `message_content` | TEXT | NOT NULL | Texte personnalisé rédigé ou choisi par l'acheteur. |
| `payment_gateway` | VARCHAR(20) | NOT NULL | `moncash` (Digicel) ou `stripe` (Carte bancaire). |
| `payment_status` | VARCHAR(20) | DEFAULT 'pending' | `pending` (en cours), `paid` (validé) ou `failed`. |
| `phone_number` | VARCHAR(30) | NULLABLE | Numéro de téléphone de l'acheteur (si MonCash). |
| `transaction_ref` | VARCHAR(100) | NULLABLE | Référence de transaction reçue par le Webhook. |
| `amount_paid` | DECIMAL(10,2) | NOT NULL | Montant réglé (100.00 ou 2.99). |
| `currency` | VARCHAR(5) | NOT NULL | `HTG` pour Haïti, `USD` pour l'international. |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date et heure de création de la commande. |

---

## 4. Table `cards` (Cartes actives avec lien unique)

Créée **UNIQUEMENT** après confirmation réelle du paiement par le Webhook :

| Champ (Colonne) | Type SQL | Contrainte | Description / Exemple |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PRIMARY KEY** | Identifiant technique interne. |
| `order_id` | UUID | **FK -> orders.id (UNIQUE)** | Lien direct vers la commande réglée. |
| `slug` | VARCHAR(16) | **UNIQUE NOT NULL** | Code court du lien public (ex: `k8F9x2` pour `katdigital.ht/v/k8F9x2`). |
| `views_count` | INT | DEFAULT 0 | Nombre de fois que le destinataire a ouvert l'enveloppe. |
| `last_viewed_at` | TIMESTAMP | NULLABLE | Dernière consultation de la carte. |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date d'activation de la carte. |

---

## 5. Cycle de Vie d'une Carte (Du clic au destinataire)

1. **Étape 1 (Panier) :** L'acheteur saisit son nom, celui du destinataire et son message. Le front-end appelle `POST /api/orders/create`. Une ligne est insérée dans `orders` avec `payment_status = 'pending'`.
2. **Étape 2 (Paiement) :** L'acheteur est redirigé vers MonCash (code PIN) ou Stripe Checkout (carte bancaire).
3. **Étape 3 (Activation Webhook) :** Le serveur MonCash ou Stripe envoie un webhook sécurisé au back-end. Le back-end vérifie la signature cryptographique, passe `orders.payment_status` à `paid`, et crée la ligne correspondante dans `cards` avec un code court unique (ex: `x7K9p2`).
4. **Étape 4 (Consultation) :** Quand le destinataire clique sur `https://katdigital.ht/v/x7K9p2`, le front-end appelle `GET /api/cards/x7K9p2`. Le back-end incrémente `views_count` et renvoie l'enveloppe avec son message personnalisé !
