# ASPEi Release Checklist

## ⚠️ POVINNÉ - AUTH TESTOVÁNÍ (POJISTKA)

Před každým release musí být splněno:

- [ ] **Registrace OK** - Nový uživatel se může zaregistrovat
- [ ] **Login OK** - Existující uživatel se může přihlásit  
- [ ] **Logout OK** - Přihlášený uživatel se může odhlásit
- [ ] **Dashboard po loginu OK** - Po přihlášení je dostupný dashboard poskytovatele

**BEZ SPLNĚNÍ TĚCHTO BODŮ NESMÍ BÝT APLIKACE POVAŽOVÁNA ZA STABILNÍ.**

## 🔧 TECHNICKÁ PŘIPRAVENOST

- [ ] Stabilní URL je funkční
- [ ] Baseline tag je definován a funguje
- [ ] Regression check OK (homepage stále ukazuje 22 nabídek)
- [ ] DB připojení OK
- [ ] Auth flow funguje bez chyb

## 👤 UŽIVATELSKÁ ZKUŠENOST (MINIMUM)

- [ ] Homepage default ukazuje nabídky
- [ ] Poskytovatel se přihlásí → vidí dashboard
- [ ] Profil lze uložit
- [ ] Nabídku lze vytvořit / upravit

## 🔒 DATA & BEZPEČNOST

- [ ] RLS aktivní (pokud je implementován)
- [ ] Žádná cizí data viditelná
- [ ] Žádné debug prvky v UI
- [ ] Žádné testovací texty typu lorem / test123

## 🚀 PROVOZNÍ PŘIPRAVENOST

- [ ] Kontakt / identita projektu
- [ ] Základní info „co to je"
- [ ] Kam hlásit problém (email / formulář – i kdyby dočasný)

## 📋 CO JE VĚDOMĚ POZADĚJI

- [ ] Request flow (matching engine)
- [ ] AI doporučování  
- [ ] Monetizace
- [ ] Advanced filtrace

## ⛔ KDY SE NESMÍ SPUSTIT

- Rozbitá homepage
- Nefunkční login
- Ztráta dat
- Broken auth flow
- Chybějící základní funkce

---

**Cíl:** Konzervativní checklist zaměřený na stabilitu. ASPEi je platforma připravená růst, ale musí být stabilní a bezpečná pro uživatele.