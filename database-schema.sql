-- =====================================================
-- ASPETi PLUS - Databázové schema
-- Vytvořeno: 2025-12-11
-- =====================================================

-- 1. TABULKA PROFILES (Uživatelské účty)
-- ======================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    username TEXT UNIQUE,
    role TEXT CHECK (role IN ('provider', 'client')) NOT NULL DEFAULT 'client',
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- 2. TABULKA PROVIDERS (Pro kompatibilitu s existujícím kódem)
-- ===========================================================
CREATE TABLE IF NOT EXISTS providers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- 3. TABULKA OFFERS (Nabídky)
-- ============================
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL, -- 'beauty', 'reality', 'sport', atd.
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    location TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABULKA RESERVATIONS (Rezervace)
-- ====================================
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE -- Pro snadné dotazy
);

-- 5. TABULKA MESSAGES (Zprávy)
-- =============================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false
);

-- 6. TABULKA CREDIT_TRANSACTIONS (Kreditní transakce)
-- ===================================================
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- Kladné pro nákup, záporné pro použití
    type TEXT CHECK (type IN ('purchase', 'usage', 'refund')) NOT NULL,
    description TEXT,
    balance_after INTEGER NOT NULL
);

-- 7. TABULKA PROVIDER_STATS (Statistiky poskytovatelů)
-- ====================================================
CREATE TABLE IF NOT EXISTS provider_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_reservations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    today_views INTEGER DEFAULT 0,
    today_clicks INTEGER DEFAULT 0,
    today_reservations INTEGER DEFAULT 0,
    today_messages INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLITIKY
-- =====================================================

-- Zapnutí RLS pro všechny tabulky
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_stats ENABLE ROW LEVEL SECURITY;

-- 1. RLS POLITIKY PRO PROFILES
-- ============================
CREATE POLICY "Profily jsou veřejně čitelné" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Uživatelé mohou aktualizovat svůj profil" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Uživatelé mohou vložit svůj profil" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. RLS POLITIKY PRO PROVIDERS
-- =============================
CREATE POLICY "Poskytovatelé jsou veřejně čitelní" ON providers
    FOR SELECT USING (true);

CREATE POLICY "Poskytovatelé mohou aktualizovat svůj profil" ON providers
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Poskytovatelé mohou vložit svůj profil" ON providers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. RLS POLITIKY PRO OFFERS
-- ==========================
CREATE POLICY "Nabídky jsou veřejně čitelné pokud jsou aktivní" ON offers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Poskytovatelé mohou vidět všechny své nabídky" ON offers
    FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Poskytovatelé mohou vytvářet nabídky" ON offers
    FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Poskytovatelé mohou aktualizovat své nabídky" ON offers
    FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Poskytovatelé mohou mazat své nabídky (soft delete)" ON offers
    FOR UPDATE USING (auth.uid() = provider_id);

-- 4. RLS POLITIKY PRO RESERVATIONS
-- ================================
CREATE POLICY "Rezervace jsou čitelné pro vlastníka a poskytovatele" ON reservations
    FOR SELECT USING (
        auth.uid() = client_id OR 
        auth.uid() = provider_id OR
        auth.uid() IN (SELECT provider_id FROM offers WHERE id = offer_id)
    );

CREATE POLICY "Klienti mohou vytvářet rezervace" ON reservations
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Poskytovatelé a klienti mohou aktualizovat rezervace" ON reservations
    FOR UPDATE USING (
        auth.uid() = client_id OR 
        auth.uid() = provider_id OR
        auth.uid() IN (SELECT provider_id FROM offers WHERE id = offer_id)
    );

-- 5. RLS POLITIKY PRO MESSAGES
-- ============================
CREATE POLICY "Zprávy jsou čitelné pro poskytovatele a odesílatele" ON messages
    FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Kdokoli může poslat zprávu" ON messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Poskytovatelé mohou označit zprávy jako přečtené" ON messages
    FOR UPDATE USING (auth.uid() = provider_id);

-- 6. RLS POLITIKY PRO CREDIT_TRANSACTIONS
-- =======================================
CREATE POLICY "Kreditní transakce jsou čitelné jen pro vlastníka" ON credit_transactions
    FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Poskytovatelé mohou vytvářet kreditní transakce" ON credit_transactions
    FOR INSERT WITH CHECK (auth.uid() = provider_id);

-- 7. RLS POLITIKY PRO PROVIDER_STATS
-- ==================================
CREATE POLICY "Statistiky jsou veřejně čitelné" ON provider_stats
    FOR SELECT USING (true);

CREATE POLICY "Poskytovatelé mohou aktualizovat své statistiky" ON provider_stats
    FOR ALL USING (auth.uid() = provider_id);

-- =====================================================
-- FUNKCE A TRIGGERY
-- =====================================================

-- Funkce pro automatické vytvoření profilu po registraci
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, role, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
        NEW.email
    );
    
    INSERT INTO public.providers (id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    
    INSERT INTO public.provider_stats (provider_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pro automatické volání funkce
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Funkce pro automatickou aktualizaci provider_id v reservations
CREATE OR REPLACE FUNCTION update_reservation_provider_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.provider_id = (SELECT provider_id FROM offers WHERE id = NEW.offer_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reservation_provider_id_trigger
    BEFORE INSERT OR UPDATE ON reservations
    FOR EACH ROW EXECUTE PROCEDURE update_reservation_provider_id();

-- Funkce pro automatické vytvoření provider_stats při registraci poskytovatele
CREATE OR REPLACE FUNCTION handle_new_provider()
RETURNS TRIGGER AS $$
BEGIN
    -- Vytvoření statistik pro nového poskytovatele
    INSERT INTO public.provider_stats (provider_id)
    VALUES (NEW.id)
    ON CONFLICT (provider_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INDEXY PRO VÝKON
-- =====================================================

-- Indexy pro rychlejší vyhledávání
CREATE INDEX IF NOT EXISTS idx_offers_provider_id ON offers(provider_id);
CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_is_active ON offers(is_active);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_offer_id ON reservations(offer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_client_id ON reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_reservations_provider_id ON reservations(provider_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

CREATE INDEX IF NOT EXISTS idx_messages_offer_id ON messages(offer_id);
CREATE INDEX IF NOT EXISTS idx_messages_provider_id ON messages(provider_id);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_provider_id ON credit_transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_provider_stats_provider_id ON provider_stats(provider_id);

-- =====================================================
-- UKÁZKOVÁ DATA (pro testování)
-- =====================================================

-- Ukázkový poskytovatel (pro testování)
INSERT INTO auth.users (id, email, created_at, updated_at, raw_user_meta_data)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'provider@example.com', now(), now(), '{"role": "provider", "full_name": "Test Provider"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Ukázkový klient (pro testování)  
INSERT INTO auth.users (id, email, created_at, updated_at, raw_user_meta_data)
VALUES 
    ('22222222-2222-2222-2222-222222222222', 'client@example.com', now(), now(), '{"role": "client"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Ukázkové nabídky (pro testování)
INSERT INTO offers (id, provider_id, category, title, description, price, location, is_active)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'beauty', 'Kadeřnické služby', 'Profesionální kadeřnické služby pro muže a ženy', 500.00, 'Praha 1', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'reality', 'Pronájem bytu', 'Moderní 2+kk byt v centru města', 15000.00, 'Praha 2', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'sport', 'Osobní trenér', 'Individuální tréninky a výživové poradenství', 800.00, 'Praha 3', true)
ON CONFLICT (id) DO NOTHING;

-- Ukázkové statistiky
UPDATE provider_stats 
SET total_views = 150, total_reservations = 5, today_views = 25 
WHERE provider_id = '11111111-1111-1111-1111-111111111111';

-- =====================================================
-- DOKONČENÍ
-- =====================================================

-- Grant oprávnění
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Komentáře k tabulkám
COMMENT ON TABLE profiles IS 'Uživatelské profily - rozšíření auth.users';
COMMENT ON TABLE providers IS 'Profily poskytovatelů služeb';
COMMENT ON TABLE offers IS 'Nabídky služeb od poskytovatelů';
COMMENT ON TABLE reservations IS 'Rezervace a poptávky klientů';
COMMENT ON TABLE messages IS 'Zprávy od klientů k poskytovatelům';
COMMENT ON TABLE credit_transactions IS 'Kreditní transakce poskytovatelů';
COMMENT ON TABLE provider_stats IS 'Statistiky výkonnosti poskytovatelů';

-- Výsledek
SELECT 'ASPETi PLUS databázové schema bylo úspěšně vytvořeno!' as result;