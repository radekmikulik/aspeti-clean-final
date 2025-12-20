# Dokumentace: Kreditní Systém ASPETi PLUS

## Přehled implementace

Byl implementován kompletní kreditní systém pro ASPETi PLUS platformu, který zahrnuje:

1. **Frontend komponentu** - `KreditniCentrum.tsx` 
2. **Backend strukturu** - SQL migrace pro PostgreSQL/Supabase
3. **Automatický denní odečet** - Cron job pro správu kreditu

## Frontend implementace

### KreditniCentrum komponenta

**Umístění:** `src/components/KreditniCentrum.tsx`

**Funkcionality:**
- ✅ **Sekce zůstatek** - Zobrazení aktuálního kreditu s varováními
- ✅ **Sekce dobití kreditu** - Přednastavené částky (200, 500, 1000 Kč) + vlastní částka
- ✅ **Sekce pohyby kreditu** - Historie transakcí s filtrováním
- ✅ **Varování** - Upozornění při zůstatku < 20 Kč
- ✅ **Blokování** - Deaktivace nabídek při zůstatku 0 Kč
- ✅ **Demo funkcionalita** - Simulace plateb bez skutečného zpracování

**Integrace:**
- Přidána do `ProviderDashboard` pod sekci "Kreditni Centrum"
- Plně responsive design
- Podpora pro demo data

## Backend implementace

### Databázové migrace

**1. Hlavní migrace:** `supabase/migrations/20241215_create_credit_system.sql`

**Tabulky:**
- `providers` - rozšířena o `credit_balance` sloupec
- `credit_history` - nová tabulka pro transakce

**Funkce:**
- `daily_credit_deduction()` - hlavní funkce pro denní odečet
- `get_credit_balance()` - získání zůstatku
- `add_credit()` - přidání kreditu
- `deduct_credit()` - odečtení kreditu
- `get_credit_history()` - historie transakcí

**2. Cron Job migrace:** `supabase/migrations/20241215_create_credit_cron_job.sql`

**Funkcionality:**
- Automatické spouštění denního odečtu ve 23:59
- Logování všech operací
- Funkce pro manuální spouštění
- Monitoring a reporting

### TypeScript API

**Umístění:** `src/lib/supabase.ts` (CreditAPI class)

**Metody:**
```typescript
CreditAPI.getBalance(providerId)
CreditAPI.addCredit(providerId, amount, description)
CreditAPI.deductCredit(providerId, amount, description)
CreditAPI.getHistory(providerId, limit, offset)
CreditAPI.getSummary()
CreditAPI.triggerDeduction(providerId, simulateOnly)
CreditAPI.getCronStatus()
CreditAPI.getCronHistory()
```

## Implementace v Supabase

### Kroky pro aktivaci

1. **Spusťte SQL migrace v Supabase:**
   ```sql
   -- Spusťte obsah souboru 20241215_create_credit_system.sql
   \i supabase/migrations/20241215_create_credit_system.sql
   
   -- Spusťte obsah souboru 20241215_create_credit_cron_job.sql  
   \i supabase/migrations/20241215_create_credit_cron_job.sql
   ```

2. **Ověřte vytvoření tabulek:**
   ```sql
   SELECT * FROM credit_history LIMIT 5;
   SELECT * FROM credit_summary LIMIT 5;
   ```

3. **Otestujte cron job:**
   ```sql
   SELECT * FROM logged_daily_credit_deduction();
   ```

### Konfigurace cron jobu

**Automatické spouštění:** Každý den ve 23:59

**Manuální spuštění pro testování:**
```sql
-- Simulace (bez aktualizace dat)
SELECT * FROM manual_credit_deduction(NULL, true);

-- Skutečné spuštění
SELECT * FROM manual_credit_deduction();
```

## Demo účty pro testování

**Přihlašovací údety:**
- **Poskytovatel:** `poskytovatel@aspeti.cz` / `poskytovatel123`
- **Zákazník:** `zakaznik@aspeti.cz` / `zakaznik123`
- **Demo:** `demo@aspeti.cz` / `demo123`

**Testovací kredit:** Všichni demo účty mají počáteční kredit 100 Kč

## Logika denního odečtu

**Frekvence:** Každých 24 hodin (ve 23:59)

**Kalkulace:**
- **Poplatek:** 5 Kč za každou aktivní nabídku denně
- **Příklad:** 3 aktivní nabídky = 15 Kč odečet

**Proces:**
1. Sečte aktivní nabídky poskytovatele
2. Vypočte celkový poplatek
3. Odečte od `credit_balance`
4. Zaznamená transakci do `credit_history`
5. **Blokování:** Při zůstatku ≤ 0 Kč deaktivuje všechny nabídky

## Stav implementace

### ✅ Hotovo
- [x] Frontend komponenta KreditniCentrum
- [x] Databázové tabulky a funkce
- [x] Cron job pro automatický odečet
- [x] TypeScript API
- [x] Integrace do ProviderDashboard
- [x] Demo funkcionalita
- [x] Varování a blokování

### 🔄 K dokončení
- [ ] Spuštění SQL migrací v Supabase
- [ ] Integrace skutečné platební brány (Stripe)
- [ ] Notifikace o nízkém zůstatku
- [ ] Admin panel pro monitoring

## URL aplikace

**Aktuální nasazení:** https://lopk0m53mibl.space.minimax.io

**Testovací kroky:**
1. Přihlášení s demo účtem
2. Kliknutí na "Profil" v navigaci
3. Kliknutí na "Kreditni Centrum" v dashboardu
4. Testování dobití kreditu (demo funkce)
5. Zobrazení historie transakcí

## Poznámky pro vývojáře

- Všechny SQL migrace jsou připraveny k okamžitému spuštění
- Demo funkcionalita umožňuje testování bez skutečných plateb
- CreditAPI poskytuje kompletní rozhraní pro správu kreditu
- Cron job logování umožňuje monitoring všech operací
- Systém je připraven pro produkční nasazení po spuštění migrací