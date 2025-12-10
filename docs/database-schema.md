# Supabase Databázové Schéma - ASPETi

## Přehled tabulek

### 1. `providers` - Poskytovatelé služeb
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

### 2. `offers` - Nabídky služeb
```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  location VARCHAR(100),
  category VARCHAR(50) NOT NULL, -- 'beauty', 'sport', 'photo', 'gastro'
  image_url TEXT,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0
);
```

### 3. `reservations` - Rezervace a objednávky
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  client_email VARCHAR(255),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. `messages` - Zprávy mezi klienty a poskytovateli
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  sender_phone VARCHAR(50),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. `provider_stats` - Statistiky poskytovatelů
```sql
CREATE TABLE provider_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_reservations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  today_views INTEGER DEFAULT 0,
  today_clicks INTEGER DEFAULT 0,
  today_reservations INTEGER DEFAULT 0,
  today_messages INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Indexy pro výkon
```sql
-- Indexy pro rychlé vyhledávání
CREATE INDEX idx_offers_category ON offers(category);
CREATE INDEX idx_offers_location ON offers(location);
CREATE INDEX idx_offers_price ON offers(price);
CREATE INDEX idx_offers_active ON offers(is_active);
CREATE INDEX idx_offers_provider ON offers(provider_id);

CREATE INDEX idx_reservations_offer ON reservations(offer_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);

CREATE INDEX idx_messages_offer ON messages(offer_id);
CREATE INDEX idx_messages_read ON messages(is_read);

CREATE INDEX idx_provider_stats_provider ON provider_stats(provider_id);
```

## Triggery pro automatické aktualizace
```sql
-- Automatické inkrementování zobrazení nabídky
CREATE OR REPLACE FUNCTION increment_offer_views(offer_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE offers 
  SET views_count = views_count + 1 
  WHERE id = offer_id;
  
  UPDATE provider_stats 
  SET total_views = total_views + 1,
      today_views = today_views + 1,
      updated_at = NOW()
  WHERE provider_id = (SELECT provider_id FROM offers WHERE id = offer_id);
END;
$$ LANGUAGE plpgsql;

-- Automatické vytvoření statistik pro nového poskytovatele
CREATE OR REPLACE FUNCTION create_provider_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO provider_stats (provider_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_provider_stats
  AFTER INSERT ON providers
  FOR EACH ROW
  EXECUTE FUNCTION create_provider_stats();
```

## Row Level Security (RLS) Policies
```sql
-- Povolení RLS na všech tabulkách
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_stats ENABLE ROW LEVEL SECURITY;

-- Všichni mohou číst nabídky (veřejný katalog)
CREATE POLICY "Publikum může číst nabídky" ON offers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Publikum může číst poskytovatele" ON providers
  FOR SELECT USING (is_active = true);

-- Pouze poskytovatelé mohou spravovat své nabídky
CREATE POLICY "Poskytovatelé mohou spravovat své nabídky" ON offers
  FOR ALL USING (auth.uid() = provider_id);

-- Pouze poskytovatelé mohou číst své rezervace
CREATE POLICY "Poskytovatelé mohou číst své rezervace" ON reservations
  FOR SELECT USING (
    offer_id IN (
      SELECT id FROM offers WHERE provider_id = auth.uid()
    )
  );

-- Všichni mohou vytvářet rezervace
CREATE POLICY "Všichni mohou vytvářet rezervace" ON reservations
  FOR INSERT WITH CHECK (true);

-- Pouze poskytovatelé mohou číst své statistiky
CREATE POLICY "Poskytovatelé mohou číst své statistiky" ON provider_stats
  FOR SELECT USING (provider_id = auth.uid());
```

## Seed Data (testovací data)
```sql
-- Vložení testovacích poskytovatelů
INSERT INTO providers (name, email, phone, city, rating) VALUES
  ('Relax Studio', 'info@relaxstudio.cz', '777 123 456', 'Praha 1', 4.8),
  ('Beauty Studio', 'hello@beautystudio.cz', '777 654 321', 'Praha 2', 4.9),
  ('Nail Art Studio', 'contact@nailart.cz', '777 789 012', 'Praha 3', 4.7),
  ('Fit Zone', 'info@fitzone.cz', '777 345 678', 'Praha 4', 4.6),
  ('Photo Studio', 'hello@photostudio.cz', '777 901 234', 'Praha 5', 4.9);

-- Vložení testovacích nabídek
INSERT INTO offers (title, description, price, location, category, provider_id) VALUES
  ('Masáž zad 45 min', 'Profesionální masáž zad s aromaterapií', 800, 'Praha 1', 'beauty', (SELECT id FROM providers WHERE name = 'Relax Studio')),
  ('Lash lifting + brow shape', 'Zdvihnutí řas a tvarování obočí', 1200, 'Praha 2', 'beauty', (SELECT id FROM providers WHERE name = 'Beauty Studio')),
  ('Manikúra s gelovým lakem', 'Kompletní péče o nehty s dlouhodobým gelovým lakem', 650, 'Praha 3', 'beauty', (SELECT id FROM providers WHERE name = 'Nail Art Studio')),
  ('Osobní trénink fitness', 'Individuální fitness trénink s osobním trenérem', 900, 'Praha 4', 'sport', (SELECT id FROM providers WHERE name = 'Fit Zone')),
  ('Rodinné fotení v ateliéru', 'Profesionální fotografování rodinných portrétů', 2500, 'Praha 5', 'photo', (SELECT id FROM providers WHERE name = 'Photo Studio'));
```

## Environmentální proměnné (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Instalace a spuštění
1. Vytvořte Supabase projekt
2. Spusťte SQL scripty výše v Supabase SQL Editor
3. Nakonfigurujte environmentální proměnné
4. Spusťte `npm install` pro instalaci @supabase/supabase-js
5. Deploy na Vercel s nastavenými environmentálními proměnnými