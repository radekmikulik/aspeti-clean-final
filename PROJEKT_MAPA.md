# 🗺️ MAPA PROJEKTU ASPETi

## 📁 Základní orientace v kódu

### 🏠 Homepage logika
```
src/components/Home/AppInner.tsx
```
- Hlavní komponenta aplikace
- Filtry, VIP karty, standardní karty
- **POZOR:** Chráněná část baseline

### 📊 Dashboard
```
src/components/ProviderOverviewDashboard.tsx
```
- Moderní dashboard pro poskytovatele
- Přehled, statistiky, správa nabídek
- **POZOR:** Chráněná část baseline

### 💾 Data management
```
src/data/dataService.ts
```
- Správa nabídek a dat
- Filtrace a řazení
- **POZOR:** Chráněná část baseline

### 🔍 Filtrování dat
```
src/components/Home/AppInner.tsx (useMemo section)
src/utils/homepageRegressionCheck.ts
```
- Filtrovací logika
- Regression check pro ochranu baseline
- Automatická kontrola počtu nabídek

### 📋 Konfigurace a checklisty
```
RELEASE_CHECKLIST.md        - Manual checklist pro deployy
BASELINE_STATUS_REPORT.md   - Status baseline a pravidla
```

### 🎨 Styly a UI
```
src/styles/globals.css       - Globální styly
tailwind.config.js          - Tailwind konfigurace
```

### 📦 Pages a routing
```
src/pages/
├── _app.tsx                - Globální aplikační komponenta
└── index.tsx               - Hlavní stránka (homepage)
```

## 🚨 Kritické součásti (NEZMĚNIT bez zadání)

1. **AppInner.tsx** - homepage logika a UI
2. **dataService.ts** - data management
3. **ProviderOverviewDashboard.tsx** - dashboard UI
4. **homepageRegressionCheck.ts** - ochrana proti regresím

## 📝 Pro nového vývojáře

1. Začni čtením README.md
2. Zkontroluj BASELINE_STATUS_REPORT.md
3. Projdi PROJEKT_MAPA.md (tento soubor)
4. Nikdy nezměň kritické součásti bez konzultace
5. Vždy testuj na preview URL před deployem

---
*Poslední aktualizace: 2025-12-21*