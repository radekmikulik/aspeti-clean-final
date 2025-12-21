# 🔄 NÁVOD: Jak obnovit ASPEi projekt

## Krok za krokem - obnovení projektu z archivu

### 1) Stažení a rozbalení ZIP archivu

```
# Stáhněte soubor: ASPEi-baseline-2025-12-20.zip
# Rozbalte ZIP do vámi vybrané složky (např. ~/projekty/)
```

**Windows:**
- Klikněte pravým tlačítkem na ZIP → "Extrahovat vše..."

**Mac/Linux:**
```bash
unzip ASPEi-baseline-2025-12-20.zip
```

### 2) Přejmenování složky (volitelné)

Po rozbalení budete mít složku s názvem projektu. Přejmenujte ji podle potřeby:
```
mv aspeti-clean-final ASPEi-projekt
cd ASPEi-projekt
```

### 3) Nahraní zpět do GitHubu (pokud chcete pokračovat ve vývoji)

```bash
# Inicializace nového repozitáře
git init

# Přidání remote origin (nahraďte YOUR_USERNAME a YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Pushnutí baseline na GitHub
git push -u origin main
```

### 4) Návrat na baseline tag (pro kontrolu)

```bash
# Ověření, že jste na baseline verzi
git checkout baseline-2025-12-20-homepage-fixed

# Nebo vytvoření nového branch z baseline
git checkout -b my-development-branch baseline-2025-12-20-homepage-fixed
```

### 5) Ověření, že projekt funguje

```bash
# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Otevřete http://localhost:3000 v prohlížeči
# Na homepage musíte vidět 22 nabídek (9 VIP + 13 standard)
```

### 6) Kontrola regression check

V prohlížeči otevřete **Developer Tools** (F12) → Console:

- Měl by se zobrazit log: "✅ Regression check PASSED"
- Měl by ukazovat 22 nabídek

**Pokud regression check selže → STOP a zkontrolujte baseline tag**

---

## 🚨 Troubleshooting

### Problém: "npm install" selže
**Řešení:** 
```bash
# Vymažte node_modules a package-lock.json
rm -rf node_modules package-lock.json

# Nainstalujte znovu
npm install
```

### Problém: Homepage je prázdná
**Řešení:** Ověřte, že jste na správném baseline tagu:
```bash
git status
git log --oneline -5
# Musíte být na commit fa90838
```

### Problém: Build chyby
**Řešení:** Zkontrolujte, že máte správnou verzi Node.js:
```bash
node --version  # Musí být 16+ nebo 18+
```

---

## ✅ Úspěšná obnovení

Projekt je správně obnovený, pokud:
- [ ] Homepage zobrazuje 22 nabídek
- [ ] Regression check v konzoli ukazuje PASSED
- [ ] Dashboard funguje (po přihlášení)
- [ ] Build projde bez chyb: `npm run build`

---

*Návod vytvořen: 2025-12-22*  
*Baseline reference: baseline-2025-12-20-homepage-fixed*