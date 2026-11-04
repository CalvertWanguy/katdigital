# KatDigital • Spécification Technique & Architecture Back-end (Supabase)

Document officiel pour le développeur back-end : flux utilisateur étape par étape, schéma PostgreSQL sur Supabase, Edge Functions et webhooks MonCash / Stripe.

---

## 1. Le Flux Utilisateur Étape par Étape (User Journey)

Pour maximiser les conversions et éliminer toute friction, le projet adopte la stratégie d'achat d'impulsion sans création de compte obligatoire (Guest Checkout) :

| Étape | Action de l'Utilisateur | Action du Front-end | Rôle du Back-end (Supabase) |
| :--- | :--- | :--- | :--- |
| **1. Découverte** | Arrive sur le site, explore le catalogue et teste les démos d'ouverture 3D. | Affiche le catalogue de cartes. | Fournit la table `templates` avec les modèles actifs. |
| **2. Création** | Clique sur *« Pèsonalize »*, tape le destinataire, son nom et choisit/modifie son message. | Met à jour l'état local et offre un aperçu immédiat en direct. | Aucun appel serveur nécessaire à cette étape (expérience instantanée). |
| **3. Paywall** | Clique sur *« Pataje »* ou *« Telechaje »*. Choisit MonCash (100 Goud) ou Carte ($2.99). | Appelle `POST /api/orders/create` avec les données de la carte. | Insère la commande dans `orders` avec statut `pending` et génère la session MonCash / Stripe. |
| **4. Paiement** | Valide avec son code PIN MonCash (ou saisit sa carte sur Stripe). | Attend la confirmation ou redirige le client. | Reçoit le webhook certifié, passe le statut en `paid`, et crée la carte dans `cards` avec un slug unique (ex: `x7K9p2`). |
| **5. Déblocage** | Reçoit l'écran de succès avec le lien de sa carte débloqué. | Débloque le bouton *« Pataje sou WhatsApp »* et *« Telechaje Imaj PNG »*. | Fournit les métadonnées Open Graph pour un bel aperçu sur WhatsApp. |
| **6. Réception** | Le destinataire (Vanessa) clique sur le lien WhatsApp reçu. | Ouvre directement l'enveloppe personnalisée avec musique et confettis. | Incrémente `views_count` et renvoie les données publiques sécurisées. |

---

## 2. Pourquoi Supabase pour ce projet ?

* **PostgreSQL Robuste :** Gestion relationnelle native des commandes, cartes et logs financiers.
* **Supabase Edge Functions :** Exécution serverless en TypeScript pour gérer les webhooks MonCash (Digicel) et Stripe.
* **Table Editor Intuitif :** Toute l'équipe peut visualiser en temps réel les cartes vendues et les revenus sans coder de back-office dédié.
* **Sécurité RLS (Row Level Security) :** Garantit qu'aucune carte non payée ne puisse être consultée publiquement.

---

## 3. Schéma Relationnel de la Base de Données (Supabase SQL)

### Relations entre les tables :
| Table Source | Clé Étrangère (FK) | Table Cible (PK) | Type de Relation & Description |
| :--- | :--- | :--- | :--- |
| **`orders`** | `template_id` | `templates.id` | Plusieurs commandes peuvent utiliser le même modèle de carte (Many-to-One). |
| **`cards`** | `order_id` | `orders.id` | Une commande payée génère exactement une carte consultable (One-to-One sécurisé). |
| **`webhook_logs`** | `order_id` | `orders.id` | Traçabilité financière : plusieurs notifications webhook pour une commande (Many-to-One). |

---

### Structure des Tables :

#### Table `templates` (Catalogue des modèles)
```sql
CREATE TABLE templates (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  envelope_color VARCHAR(20) NOT NULL,
  heading VARCHAR(100) NOT NULL,
  default_message TEXT NOT NULL,
  price_htg INT DEFAULT 100,
  price_usd DECIMAL(5,2) DEFAULT 2.99,
  is_active BOOLEAN DEFAULT TRUE
);
```

#### Table `orders` (Commandes et paiements)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id VARCHAR(50) REFERENCES templates(id),
  recipient_name VARCHAR(100) NOT NULL,
  sender_name VARCHAR(100) NOT NULL,
  message_content TEXT NOT NULL,
  payment_gateway VARCHAR(20) NOT NULL, -- 'moncash' ou 'stripe'
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  phone_number VARCHAR(30),
  transaction_ref VARCHAR(100),
  amount_paid DECIMAL(10,2) NOT NULL,
  currency VARCHAR(5) NOT NULL, -- 'HTG' ou 'USD'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Table `cards` (Cartes débloquées pour le destinataire)
```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) UNIQUE,
  slug VARCHAR(16) UNIQUE NOT NULL, -- ex: 'x7K9p2'
  views_count INT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Les 3 Fonctions Clés (Supabase Edge Functions)

1. **`create-order` :** Reçoit la personnalisation du front, insère la commande en `pending` dans Supabase, et génère l'URL de paiement MonCash ou Stripe Checkout.
2. **`moncash-webhook` :** Écoute les notifications serveur de Digicel. Dès que le code PIN est validé, met à jour `orders.payment_status = 'paid'`, génère un code court `slug` aléatoire unique (ex: `x7K9p2`), et insère la ligne dans `cards`.
3. **`stripe-webhook` :** Écoute l'événement `checkout.session.completed`. Vérifie la signature cryptographique du webhook Stripe, active la carte et génère le lien.
