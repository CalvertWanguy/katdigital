-- ====================================================================
-- KatDijital • Schéma Relationnel PostgreSQL (Supabase)
-- ====================================================================

-- Extension pour la génération d'UUIDv4
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. Table: templates (Catalogue des modèles de cartes)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(200),
    category VARCHAR(50) NOT NULL,
    format VARCHAR(30) NOT NULL DEFAULT 'envelope',
    ambient_animation VARCHAR(30) DEFAULT 'snow',
    default_music VARCHAR(50) DEFAULT 'festif_violon',
    price_htg INT NOT NULL DEFAULT 100,
    price_usd DECIMAL(5,2) NOT NULL DEFAULT 2.99,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. Table: orders (Commandes & Transactions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id VARCHAR(50) NOT NULL REFERENCES templates(id),
    sender_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    message_content TEXT NOT NULL,
    heading VARCHAR(150),
    music_id VARCHAR(50) DEFAULT 'festif_violon',
    gateway VARCHAR(20) NOT NULL CHECK (gateway IN ('zafew', 'stripe', 'moncash_direct')),
    gateway_ref VARCHAR(100),
    amount_paid DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) NOT NULL CHECK (currency IN ('HTG', 'USD')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired')),
    phone_number VARCHAR(30),
    customer_email VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_gateway_ref ON orders(gateway_ref);

-- --------------------------------------------------------------------
-- 3. Table: cards (Cartes Publiques Activées après Paiement)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    slug VARCHAR(16) NOT NULL UNIQUE,
    views_count INT NOT NULL DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);

-- --------------------------------------------------------------------
-- 4. Table: webhook_logs (Idempotence & Traçabilité des Paiements)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS webhook_logs (
    event_id VARCHAR(120) PRIMARY KEY,
    gateway VARCHAR(20) NOT NULL,
    order_id UUID REFERENCES orders(id),
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. Row Level Security (RLS) & Politiques de Sécurité (ISO/IEC 25010)
-- --------------------------------------------------------------------
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS :
-- templates & cards : Lecture publique autorisée
DROP POLICY IF EXISTS "templates_public_read" ON templates;
CREATE POLICY "templates_public_read" ON templates FOR SELECT USING (true);

DROP POLICY IF EXISTS "cards_public_read" ON cards;
CREATE POLICY "cards_public_read" ON cards FOR SELECT USING (true);

-- orders & webhook_logs : Accès restreint au backend Cloudflare (service_role)
-- Aucune politique publique anon -> Protégé contre l'accès direct via la clé publique anon Supabase.

-- --------------------------------------------------------------------
-- 6. Seeding initial des Modèles (Modèles synchronisés avec templates.js)
-- --------------------------------------------------------------------
INSERT INTO templates (id, title, subtitle, category, format, ambient_animation, default_music, price_htg, price_usd) VALUES
('noel-bordeaux', 'Nwèl Vlou Bòdo', 'Anvlòp De Liks ak Sèl an Lò', 'noel', 'envelope', 'snow', 'festif_violon', 100, 2.99),
('parchemin-1804', 'Pachemen Libète 1804', 'Woule Pachemen Wayal ak Ribann', 'tradition', 'parchment', 'stars', 'haitian_tradition', 100, 2.99),
('bifold-sapin', 'Folio Pye Sapen & Zétwal', 'Liv Papetri Fèy Pliyet ki Ouvri', 'nouvel-an', 'bifold', 'snow', 'bon_ane', 100, 2.99),
('kraft-lanmou', 'Lèt Damou Sou Papye Kraft', 'Fèy Pliye ak Kè k ap Flote', 'mennaj', 'kraft_sheet', 'hearts', 'romance', 100, 2.99),
('parchemin-nouvel-an', 'Dekrè Wayal Bòn Ane 2027', 'Pachemen Ansyen ak Sèl an Lò', 'nouvel-an', 'parchment', 'stars', 'joy_to_the_world', 100, 2.99),
('noel-bleu-nuit', 'Nwèl Ble Nwi & Poud Zétwal', 'Anvlòp Ble Wayal ak Zétwal', 'noel', 'envelope', 'snow', 'silent_night', 100, 2.99),
('noel-or-prestige', 'Nwèl Vèt Sapen & Or', 'Anvlòp De Liks ak Sèl an Lò', 'noel', 'envelope', 'snow', 'deck_the_halls', 100, 2.99),
('nouvel-an-champagne', 'Bòn Ane 2027 Klere & Siksè', 'Liv Papetri Fèy Pliyet', 'nouvel-an', 'bifold', 'stars', 'auld_lang_syne', 100, 2.99),
('tradition-soup-joumou', 'Soup Joumou 1804 & Diyite', 'Woule Pachemen Zansèt yo', 'tradition', 'parchment', 'stars', 'haiti_soup_joumou', 100, 2.99),
('lanmou-velours-rose', 'Kè Damou & Dousè Fen Dane', 'Fèy Pliye ak Kè k ap Flote', 'mennaj', 'kraft_sheet', 'hearts', 'romance_piano', 100, 2.99)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    category = EXCLUDED.category,
    format = EXCLUDED.format,
    price_htg = EXCLUDED.price_htg,
    price_usd = EXCLUDED.price_usd;
