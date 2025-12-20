# ASPETi - Katalog nabídek

ASPETi je moderní webová aplikace pro prezentaci a katalogizaci nabídek služeb. Projekt je ve stabilní verzi s jasně definovaným baseline a pravidly pro další vývoj.

## 📋 Aktuální stav projektu

- **Status:** MVP stabilní, připraveno k produkčnímu použití
- **Baseline:** Uzamčena s tagem `baseline-2025-12-20-homepage-fixed`
- **Homepage:** Zobrazuje 22 nabídek (9 VIP + 13 standard)
- **Dashboard:** Moderní ProviderOverviewDashboard

## 🏷️ Stable vs Preview

### Stable (Produkční)
- Pouze z baseline tagu
- Otestováno a schváleno
- Chráněno proti regresím
- Předvídatelné chování

### Preview (Testování)
- Feature branches
- Experimentální změny
- Testování nových funkcí
- Možné nestability

## 🎯 Co je "BASELINE"

Baseline je kanonická verze projektu označená tagem, která je považována za stabilní a nesmí být rozbíjena. Jediná kanonická baseline projektu je:

```
Tag: baseline-2025-12-20-homepage-fixed
Commit: 11ebf09f0970cef7f801feff0fc97d75729f2984
```

Tato verze je chráněna proti regresím a slouží jako referenční bod pro všechny další změny.

## Funkce

- **Katalog nabídek** - přehledné zobrazení všech dostupných nabídek
- **Filtrování a vyhledávání** - pokročilé možnosti filtrování podle kategorií, měst a dalších kritérií
- **VIP nabídky** - zvýrazněné nabídky s prioritním zobrazením
- **Responzivní design** - optimalizováno pro desktop i mobilní zařízení
- **Interaktivní rozhraní** - intuitivní ovládání s moderním UI

## Kategorie

- Beauty & Wellbeing
- Gastro
- Ubytování
- Reality
- Řemesla

## Technologie

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Unsplash API (pro obrázky)

## ⚠️ Pravidla práce na projektu

### ❌ ZAKÁZÁNO (bez výslovného zadání)
- Jakékoli změny funkční logiky v AppInner.tsx
- Úpravy dataService.ts nebo dashboard komponent
- Refaktory, optimalizace, „vylepšení" základní funkčnosti
- Přidávání nových závislostí bez konzultace
- Měnění UI baseline prvků (panely, filtr, VIP karty)

### ✅ POVOLENO
- Dokumentace a komentáře
- README a strukturování informací
- Testování na preview URLs
- Malé fixy s manuálním ověřením checklistu
- Nové feature branches pro experimenty

### 🔒 Chráněné součásti
- `src/components/Home/AppInner.tsx` - homepage logika
- `src/data/dataService.ts` - data management
- Dashboard komponenty - ProviderOverviewDashboard
- Filtrovací logika a řazení nabídek

### 📋 Before any changes
1. Zkontroluj BASEline_STATUS_REPORT.md
2. Ověř regression check (src/utils/homepageRegressionCheck.ts)
3. Projdi RELEASE_CHECKLIST.md
4. Test na preview URL před jakýmkoli deployem

## Začátek

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Build pro produkci
npm run build

# Spuštění produkční verze
npm start
```

Otevřete [http://localhost:3000](http://localhost:3000) v prohlížeči pro zobrazení výsledku.

## Struktura

```
src/
├── components/
│   └── Home/
│       └── AppInner.tsx    # Hlavní komponenta aplikace
├── pages/
│   ├── _app.tsx           # Globální aplikační komponenta
│   └── index.tsx          # Hlavní stránka
└── styles/
    └── globals.css        # Globální styly a Tailwind CSS
```

## Licence

Soukromý projekt - všechna práva vyhrazena.