# KatDigital • Spécification Technique & Architecture Back-end (MVP)

Document d'ingénierie logicielle pour l'intégration de l'API, de la base de données et des passerelles de paiement (MonCash & Stripe).

---

## 1. Contexte et Objectif du Projet

KatDigital est une plateforme web orientée mobile conçue pour permettre à n'importe quel utilisateur d'acheter et d'envoyer une carte de vœux animée de prestige (style Greenvelope / Evite) en moins de 60 secondes.

* **Marché Local (Haïti) :** 100 HTG (Gourdes) par carte, réglé instantanément via l'API MonCash (Digicel Business).
* **Marché Diaspora (USA/Canada/International) :** 2.99 $ USD par carte, réglé via carte de crédit avec Stripe Checkout.
* **Objectif Back-end :** Sécuriser le flux de commande, générer un identifiant unique et immuable par carte (ex: `https://katdigital.ht/v/x7K9p2`), et ne débloquer la carte qu'après validation certifiée du webhook de paiement.

---

## 2. Diagramme de Séquence UML (Flux de Commande)

```text
+-------+             +----------+             +---------+             +-----------------+
| Client|             | Front-end|             | Back-end|             | MonCash / Stripe|
+-------+             +----------+             +---------+             +-----------------+
    |                      |                        |                           |
    | 1. Choisit modèle    |                        |                           |
    |    & tape message    |                        |                           |
    |--------------------->|                        |                           |
    |                      |                        |                           |
    | 2. Valide achat      | 3. POST /orders/create |                           |
    |--------------------->|----------------------->|                           |
    |                      |                        | 4. Crée order (PENDING)   |
    |                      |                        |    Initialise session     |
    |                      |                        |-------------------------->|
    |                      |                        |<--------------------------|
    |                      |                        |    Retourne payment_url   |
    |                      | 5. Redirige client     |                           |
    |                      |<-----------------------|                           |
    |                      |                        |                           |
    | 6. Effectue le paiement (Code PIN MonCash ou Carte bancaire Stripe)       |
    |-------------------------------------------------------------------------->|
    |                                                                           |
    |                                               | 7. Webhook de confirmation|
    |                                               |<--------------------------|
    |                                               | (Vérifie signature HMAC)  |
    |                                               |                           |
    |                                               | 8. Passe status = 'PAID'  |
    |                                               |    Génère unique_slug     |
    |                                               |                           |
    | 9. Redirigé sur page succès                   |                           |
    |    Reçoit le lien : katdigital.ht/v/x7K9p2    |                           |
    |<----------------------------------------------|                           |
    |                                                                           |
    | 10. Partage le lien sur WhatsApp au destinataire                         |
    +---------------------------------------------------------------------------+
```

---

## 3. Modèle de Données (Schéma SQL / ERD)

### Table `templates` (Catalogue des modèles)
* `id` : VARCHAR(50) PRIMARY KEY (ex: 'noel-bordeaux', 'sapin-emeraude')
* `title` : VARCHAR(100) NOT NULL
* `category` : VARCHAR(50) NOT NULL
* `envelope_color` : VARCHAR(20) NOT NULL
* `price_htg` : INT DEFAULT 100
* `price_usd` : DECIMAL(5,2) DEFAULT 2.99
* `is_active` : BOOLEAN DEFAULT TRUE

### Table `orders` (Commandes et paiements)
* `id` : UUID PRIMARY KEY
* `template_id` : VARCHAR(50) REFERENCES templates(id)
* `recipient_name` : VARCHAR(100) NOT NULL
* `sender_name` : VARCHAR(100) NOT NULL
* `message_content` : TEXT NOT NULL
* `payment_gateway` : VARCHAR(20) ('moncash' ou 'stripe')
* `payment_status` : VARCHAR(20) ('pending', 'paid', 'failed')
* `transaction_ref` : VARCHAR(100) (ID MonCash ou Stripe Session ID)
* `amount_paid` : DECIMAL(10,2)
* `currency` : VARCHAR(5) ('HTG' ou 'USD')
* `created_at` : TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Table `cards` (Cartes actives consultables)
* `id` : UUID PRIMARY KEY
* `order_id` : UUID REFERENCES orders(id) UNIQUE
* `slug` : VARCHAR(16) UNIQUE NOT NULL (Code court public ex: 'x7K9p2')
* `views_count` : INT DEFAULT 0
* `last_viewed_at` : TIMESTAMP
* `created_at` : TIMESTAMP DEFAULT CURRENT_TIMESTAMP

---

## 4. Spécification des Endpoints de l'API REST

### 1) `GET /api/templates`
Retourne la liste des modèles actifs pour afficher le catalogue sur le front-end.

### 2) `POST /api/orders/create`
* **Body :** `{ template_id, recipient_name, sender_name, message, gateway, phone_number }`
* **Traitement :** Crée la commande avec statut `pending`. Si MonCash, appelle l'API Digicel pour obtenir le token de paiement. Si Stripe, génère la session Checkout.
* **Réponse :** `{ order_id, payment_redirect_url }`

### 3) `POST /api/webhooks/moncash`
Écouteur appelé par Digicel dès validation du code PIN. Vérifie la transaction, passe la commande en `paid` et génère le slug unique.

### 4) `POST /api/webhooks/stripe`
Écouteur Stripe (`checkout.session.completed`). Vérifie la signature cryptographique, valide la commande et active la carte.

### 5) `GET /api/cards/:slug`
Route publique appelée quand le destinataire ouvre `katdigital.ht/v/:slug`.
* **Réponse :** `{ title, envelope_color, recipient, sender, message, template_id }`
* **Sécurité :** Ne renvoie les données que si la commande liée possède le statut `paid`.

---

## 5. Règles de Sécurité et Bonnes Pratiques

1. **Protection Anti-Triche :** Le front-end ne doit jamais générer le lien de la carte lui-même. Seul le serveur crée le slug après validation certifiée du paiement.
2. **Idempotence des Webhooks :** MonCash ou Stripe peuvent renvoyer un webhook plusieurs fois. Le backend doit vérifier si la commande est déjà marquée `paid` avant de retraiter.
3. **Variables d'Environnement :** Les clés secrètes (`MONCASH_SECRET`, `STRIPE_SECRET_KEY`) ne doivent jamais être exposées côté client.
