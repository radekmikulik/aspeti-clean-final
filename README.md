# ASPETi - Katalog nabídek

ASPETi je moderní webová aplikace pro prezentaci a katalogizaci nabídek služeb.

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