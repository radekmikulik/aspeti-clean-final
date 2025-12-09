// ASPETi Home – Baseline v1 (2025-10-10, Europe/Prague)
// KÓD BYL OPRAVEN Z DŮVODU NEKOMPLETNÍHO UZAVÍRÁNÍ TAGŮ.
// JEDINÝ ZDROJ PRAVDY pro UI domovské stránky. Všechny
// další úpravy dělat pouze jako malé diffy níže.
// NEMĚNIT bez výslovného zadání: 
//  - 5 panelů (desktop) s průhledným zeleným pruhem na spodní liště panelu
//  - Sticky filtr (výška vstupů h-7), badge „Nalezeno"
//  - VIP pořadí: sleva → čerstvost (novější první při stejné slevě)
//  - TOP/NEW okna: 24
// h (beauty/gastro/ubytování), 72 h (řemesla/reality)
//  - Sleva pod
// fotkou; standardní karty 3 vedle sebe na desktopu
// ZMĚNY ZAPISOVAT jako komentáře: // ADD(YYYY-MM-DD): ...
// nebo // UPDATE(YYYY-MM-DD): ...
 
import React, { useState, useMemo, useEffect, useRef } from
'react';
 
// ----- Globální pomocné funkce (dostupné pro všechny
// komponenty) -----
// using global
// daysSince
 
const hoursSince = (dateStr: string) => {
 try { return
Math.max(0, (Date.now() - new Date(dateStr).getTime())/(1000*60*60)); }
 catch { return 9999;
}
};
// NOVINKA: okno "NEW" podle kategorie – akční
// služby 24h, řemesla/reality 72h
const isNewOffer = (o: any) => {
 const key = o ? o.categoryKey : null;
 const winH = (key === 'reality' || key === 'remesla') ? 72 : 24;
 const added = o && o.addedAt ? o.addedAt : 0;
 try {
   return (hoursSince as any)(added!) <= winH;
 } catch {
   return false;
 }
};
const prettyAge = (dateStr: string) => {
 const ms =
Date.now() - new Date(dateStr).getTime();
 const h =
Math.floor(ms / (1000*60*60));
 if (isNaN(h)) return
'';
 if (h < 24)
return `${h} h`;
 const d =
Math.floor(h/24);
 return `${d} d`;
};
 
// Bezpečný obrázkový komponent s fallbackem (řeší 403/CSP a
// hotlink blokace)
function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
 // Multi‑source
// loader: podporuje pole zdrojů [primární, sekundární, ...]
 const sources =
Array.isArray(src) ? src : [src];
 const [idx, setIdx]
= useState(0);
 const [loaded,
setLoaded] = useState(false);
 useEffect(() => {
setIdx(0); setLoaded(false); }, [src]);
 const styleBg = {
backgroundImage: 'linear-gradient(135deg, #E7EFEA 0%, #CAD8D0 100%)' };
 const current =
sources[idx];
 return (
   <div
className={`relative ${className}`} style={styleBg}>
     <img
       src={current}
       alt={alt}
      className="absolute inset-0 w-full h-full object-cover
transition-opacity duration-300"
      loading="lazy"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
       onLoad={()=>
setLoaded(true)}
       onError={()=>
{
         if (idx <
sources.length - 1) { setIdx(idx + 1); }
         else {
setLoaded(false); }
       }}
       style={{
opacity: loaded ? 1 : 0 }}
     />
     {!loaded
&& (
       <div className="absolute
inset-0 flex items-center justify-center">
         <span
className="text-[#2F4B40]/70 text-base font-semibold tracking-wide
select-none">ASPETi</span>
       </div>
     )}
   </div>
 );
}
 
// Lokální SVG fallbacky (aby se konkrétní fotky vždy
// zobrazily)
const mkSVG = (label: string) => 'data:image/svg+xml;utf8,' +
encodeURIComponent(`
 <svg
xmlns="http://www.w3.org/2000/svg" width="1200"
height="800">
   <defs>
    <linearGradient id="g" x1="0" y1="0"
x2="1" y2="1">
       <stop
offset="0%" stop-color="#E7EFEA"/>
       <stop
offset="100%" stop-color="#CAD8D0"/>
    </linearGradient>
   </defs>
   <rect
width="100%" height="100%" fill="url(#g)"/>
   <text
x="50%" y="50%" dominant-baseline="middle"
text-anchor="middle" fill="#2F4B40"
font-size="42" font-family="system-ui, -apple-system, Segoe UI,
Roboto, Arial">${label}</text>
 </svg>`);
const LOCAL_IMAGES = {
 ubytovani:
mkSVG('Ubytování'),
 degustace:
mkSVG('Degustační menu'),
 penzion: mkSVG('Penzion U Lípy'),
};
 
// Jednoduchý tooltip (funguje i bez nativního title; hover,
// focus a tap)
function Tooltip({ content, children, side = 'top' }) {
 const [open,
setOpen] = useState(false);
 const pos = side ===
'top' ? 'bottom-full mb-1' : side === 'bottom' ? 'top-full mt-1' : side ===
'left' ? 'right-full mr-1' : 'left-1/2 -translate-x-1/2 top-full mt-1';
 return (
   <span
    className="relative inline-flex group"
    onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}
    onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)}
    onClick={()=>{ setOpen(true); setTimeout(()=>setOpen(false),
1800); }}
   >
     {children}
     <span
className={`pointer-events-none absolute ${pos} z-20 whitespace-nowrap rounded
bg-black/80 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity
duration-150 group-hover:opacity-100 group-focus:opacity-100 ${open ?
'opacity-100' : ''}`}>
       {content}
     </span>
   </span>
 );
}
 
// Sticky hook pro filtr (přilepí filtr pod header při
scrollu)
function useSticky(offsetPx = 56) {
 const ref =
useRef(null);
 const [stuck,
setStuck] = useState(false);
 useEffect(() => {
   const onScroll =
() => {
     if
(!ref.current) { setStuck(false); return; }
     const rect = ref.current
? ref.current.getBoundingClientRect() : null;
     const top = rect
? rect.top : Number.POSITIVE_INFINITY;
     setStuck(top
<= offsetPx);
   };
   onScroll();
   if (typeof window
!== 'undefined' && window.addEventListener) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
   }
   return () => {
     if (typeof
window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
     }
   };
 }, [offsetPx]);
 return { ref, stuck
};
}
 
// ===== POSLEDNÍ FUNKČNÍ ZÁKLAD (5 panelů, filtr, VIP 2×,
standard 3×) =====
// Bez ikon knihoven a bez TypeScript typů
 
function CategoryPanel({ active, label, img, onClick }) {
 const baseCls =
"group overflow-hidden rounded-md border border-[#D2DED8] bg-white
shadow-md transition-transform duration-300 hover:-translate-y-1
hover:shadow-xl aspect-square focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-[#2F4B40] focus-visible:ring-offset-2
focus-visible:ring-offset-[#F5F7F6]";
 const cls = active ?
baseCls + " ring-2 ring-blue-300" : baseCls;
 return (
   <button
onClick={onClick} className={cls}>
     <div
className="relative w-full h-full">
      <ImageWithFallback src={img} alt={label} className="absolute
inset-0 h-full w-full object-cover transition-transform duration-300
group-hover:scale-105" />
       <div
className="absolute inset-x-0 bottom-1 bg-[#335b4a]/58
backdrop-blur-[1.5px] border-t border-white/10 px-2 py-1 text-center
transition-colors duration-200 group-hover:bg-[#335b4a]/70">
         <span
className="text-white text-[13px] font-semibold
leading-none">{label}</span>
       </div>
     </div>
   </button>
 );
}
 
function VipCard({ o }) {
 const badgeShadow =
"shadow-[-16px_12px_10px_-6px_rgba(0,0,0,0.62),-24px_16px_18px_-10px_rgba(0,0,0,0.32)]";
 return (
   <article
className="group overflow-hidden rounded-xl border border-[#DDE6E1]
bg-white shadow-md transition-transform duration-300 hover:-translate-y-1
hover:shadow-2xl">
    <ImageWithFallback src={o.img} alt={o.title} className="h-56
w-full object-cover transition-transform duration-300
group-hover:scale-105" />
     <div
className="p-4 space-y-2">
       {(o.discount
|| o.promo) && (
         <Tooltip
content={o.promo || (o.discount ? `Sleva ${o.discount}` : '')}>
           <div
className={`inline-block rounded-none bg-[#7F9B8E]/92 text-white text-[11px]
font-semibold px-3 py-1 ring-1 ring-black/15 ${badgeShadow}`}>
            {o.discount || o.promo}
          </div>
        </Tooltip>
       )}
       <div
className="flex items-center gap-2">
         <h3
className="text-base font-semibold
text-gray-900">{o.title}</h3>
         <span
className="inline-flex items-center rounded bg-[#E7EFEA] px-2 py-0.5
text-[10px] font-semibold text-[#2F4B40] ring-1
ring-[#C8D6CF]">VIP</span>
       </div>
       <p
className="text-sm text-gray-700 line-clamp-2
md:line-clamp-3">{o.description}</p>
       <div
className="text-sm text-gray-600">{o.provider} •
{o.city}</div>
       <div
className="flex items-center justify-between">
         <div
className="flex items-baseline gap-2">
          {o.oldPrice && <span className="text-sm text-gray-400
line-through">{o.oldPrice}</span>}
           <span
className="text-base font-semibold text-blue-900">{o.newPrice ||
o.price}</span>
         </div>
         <button
className="rounded-md border border-[#C8D6CF] bg-white px-3 py-1.5 text-sm
text-blue-900 focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-[#2F4B40]">Detail</button>
       </div>
     </div>
   </article>
 );
}
 
function StdCard({ o }) {
 const badgeShadow =
"shadow-[-12px_10px_8px_-6px_rgba(0,0,0,0.62),-20px_16px_16px_-10px_rgba(0,0,0,0.3)]";
 return (
   <article
className="group overflow-hidden rounded-md border border-[#DDE6E1]
bg-white shadow-md h-full flex flex-col transition-transform duration-300
hover:-translate-y-1 hover:shadow-xl">
    <ImageWithFallback src={o.img} alt={o.title} className="h-28
w-full object-cover transition-transform duration-300
group-hover:scale-105" />
     <div
className="p-3 space-y-2">
       {(o.discount
|| o.promo) && (
         <Tooltip
content={o.promo || (o.discount ? `Sleva ${o.discount}` : '')}>
           <div
className={`inline-block rounded-none bg-[#7F9B8E]/92 text-white text-[10px]
font-semibold px-2.5 py-0.5 ring-1 ring-black/15 ${badgeShadow}`}>
            {o.discount || o.promo}
          </div>
        </Tooltip>
       )}
       <div
className="flex items-center gap-2">
         <h3
className="text-sm font-semibold
text-gray-900">{o.title}</h3>
         {o.top ? (
          <Tooltip content={`TOP – vysoký zájem (${o.clicks || 0}+ kliků), věk
${prettyAge(o.addedAt)}`}>
             <span
className="inline-flex items-center rounded bg-[#E7EFEA] px-1.5 py-0.5
text-[10px] font-semibold text-[#2F4B40] ring-1 ring-[#C8D6CF]
transition-transform group-hover:-translate-y-px">TOP</span>
          </Tooltip>
         ) : (
          isNewOffer(o) && (
            <Tooltip content={`Nové • ${prettyAge(o.addedAt)}`}>
              <span className="inline-flex items-center rounded bg-blue-50
px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-200
transition-transform group-hover:-translate-y-px">NEW</span>
            </Tooltip>
           )
         )}
       </div>
       <p
className="text-xs text-gray-700 line-clamp-1
md:line-clamp-2">{o.description}</p>
       <div
className="text-xs text-gray-600">{o.provider} •
{o.city}</div>
       <div
className="flex items-center justify-between">
         <div
className="flex items-baseline gap-2">
          {o.oldPrice && <span className="text-xs text-gray-400
line-through">{o.oldPrice}</span>}
           <span
className="text-sm font-semibold text-blue-900">{o.newPrice ||
o.price}</span>
         </div>
         <button
className="rounded border border-[#C8D6CF] bg-white px-2 py-1 text-xs
text-blue-900 focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-[#2F4B40]">Detail</button>
       </div>
     </div>
   </article>
 );
}
 
function FilterBar({ count, city, setCity, address,
setAddress, radius, setRadius, category, setCategory, query, setQuery, stuck })
{
 const CATEGORIES = [
   { key:
"all", label: "Všechny nabídky" },
   { key:
"beauty", label: "Beauty & Wellbeing" },
   { key:
"gastro", label: "Gastro" },
   { key:
"ubytovani", label: "Ubytování" },
   { key:
"reality", label: "Reality" },
   { key:
"remesla", label: "Řemesla" },
 ];
 return (
   <div
className={`rounded-sm border border-[#D2DED8] bg-white ${stuck ? 'shadow-md' :
'shadow-sm'}`}>
     <div className="flex
items-center justify-between px-2 py-0 bg-[#E7EFEA] rounded-t-sm">
       <div
className="flex items-center gap-2">
         <span
className="text-sm font-medium text-blue-900">Filtr</span>
         <span
className="ml-2 inline-flex items-center rounded bg-[#E7EFEA] px-1.5 py-0
text-[11px] font-medium text-[#2F4B40] ring-1 ring-[#C8D6CF]">Nalezeno:
{count}</span>
       </div>
       <div
className="flex flex-wrap items-center gap-1 p-1">
         {/* Radius
*/}
         <div
className="flex items-center gap-1">
           <span
className="hidden sm:inline text-[11px]
text-blue-900/80">Radius:</span>
           <input
type="number" min="1" value={radius}
onChange={e=>setRadius(parseInt(e.target.value||'0',10) || 0)}
className="w-16 rounded-sm border border-[#C8D6CF] h-7 px-2 text-[11px]
focus:outline-none focus:ring-2 focus:ring-[#2F4B40]"
placeholder="10"/>
           <span
className="text-[11px] text-blue-900/80">km</span>
         </div>
         {/* Hledat
*/}
         <input
value={query} onChange={e=>setQuery(e.target.value)}
className="rounded-sm border border-[#C8D6CF] h-7 px-2 text-[11px]
focus:outline-none focus:ring-2 focus:ring-[#2F4B40]" placeholder="Hledat..."/>
         {/* Město
*/}
         <input
value={city} onChange={e=>setCity(e.target.value)}
className="rounded-sm border border-[#C8D6CF] h-7 px-2 text-[11px]
focus:outline-none focus:ring-2 focus:ring-[#2F4B40]" placeholder="Město"/>
         {/* Adresa
*/}
         <input
value={address} onChange={e=>setAddress(e.target.value)}
className="rounded-sm border border-[#C8D6CF] h-7 px-2 text-[11px]
focus:outline-none focus:ring-2 focus:ring-[#2F4B40]" placeholder="Adresa"/>
         {/*
Kategorie */}
         <div
className="flex items-center gap-1">
           <span
className="text-[11px] text-blue-900/80 whitespace-nowrap">Všechny
nabídky:</span>
           <select
value={category} onChange={e=>setCategory(e.target.value)}
className="rounded-sm border border-[#C8D6CF] h-7 px-2 text-[11px]
focus:outline-none focus:ring-2 focus:ring-[#2F4B40]">
            {CATEGORIES.map(c=> <option key={c.key}
value={c.key}>{c.label}</option>)}
          </select>
         </div>
       </div>
     </div>
   </div>
 );
}
 
// ADD(2025-10-28): Poskytovatelský účet – demo skeleton
(oddělený od homepage)
function AccountView({ onClose }){
 const [section,
setSection] = React.useState('overview');
 const NavItem =
({id, label}) => (
   <button
    onClick={()=>setSection(id)}
    className={`w-full text-left px-3 py-2 rounded-md border ${section===id?
'bg-[#E7EFEA] border-[#C8D6CF] text-blue-900' : 'bg-white border-transparent
text-blue-900/80 hover:bg-[#F5F7F6]'}`}
  >{label}</button>
 );
 return (
   <div
className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
     <div
className="mb-4 flex items-center justify-between">
       <h1
className="text-xl font-semibold text-blue-900">Můj
účet</h1>
       <div
className="flex items-center gap-2">
         <button
onClick={onClose} className="rounded-sm border border-[#C8D6CF] px-3
py-1.5 text-sm text-blue-900 hover:bg-[#E7EFEA]">Zpět na
katalog</button>
       </div>
     </div>
     <div
className="grid grid-cols-1 md:grid-cols-12 gap-4">
       <aside
className="md:col-span-3 space-y-1">
         <NavItem
id="overview" label="Přehled" />
         <NavItem
id="offers" label="Moje nabídky" />
         <NavItem
id="add" label="Přidat nabídku" />
         <NavItem
id="orders" label="Rezervace / Objednávky" />
         <NavItem
id="inbox" label="Zprávy" />
         <NavItem
id="vip" label="VIP & Propagace" />
         <NavItem
id="stats" label="Statistiky" />
         <NavItem
id="reviews" label="Hodnocení" />
         <NavItem
id="billing" label="Fakturace" />
         <NavItem
id="profile" label="Profil" />
         <NavItem
id="settings" label="Nastavení" />
       </aside>
       <section
className="md:col-span-9">
         {section ===
'overview' && (
           <div
className="space-y-4">
             <div
className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-md border border-[#D2DED8] bg-white
p-4">
                <div className="text-xs text-gray-500">Zobrazení
dnes</div>
                <div className="mt-1 text-2xl font-semibold
text-blue-900">482</div>
              </div>
              <div className="rounded-md border border-[#D2DED8] bg-white
p-4">
                <div className="text-xs text-gray-500">Kliky
dnes</div>
                <div className="mt-1 text-2xl font-semibold
text-blue-900">97</div>
              </div>
              <div className="rounded-md border border-[#D2DED8] bg-white
p-4">
                <div className="text-xs
text-gray-500">Rezervace</div>
                <div className="mt-1 text-2xl font-semibold
text-blue-900">3</div>
              </div>
            </div>
            <div
className="rounded-md border border-[#D2DED8] bg-white p-4">
             <div className="flex items-center justify-between">
               <h2 className="text-base font-semibold text-blue-900">Co
zlepšit</h2>
               <span className="text-xs
text-gray-500">Doporučení</span>
             </div>
              <ul
className="mt-2 list-disc list-inside text-sm text-gray-700
space-y-1">
               <li>Doplňte 3–6 fotek k nabídce „Masáž zad 45 min".</li>
               <li>Nastavte platnost akce u „Lash lifting + brow
shape".</li>
               <li>Vyplňte IČO ve firemním profilu (kvůli fakturaci).</li>
             </ul>
            </div>
          </div>
         )}
         {section ===
'offers' && (
           <div
className="rounded-md border border-[#D2DED8] bg-white p-4">
             <div
className="flex items-center justify-between mb-3">
               <h2
className="text-base font-semibold text-blue-900">Moje
nabídky</h2>
              <div className="flex items-center gap-2">
                <button className="rounded-sm border border-[#C8D6CF] px-3
py-1.5 text-sm text-blue-900 hover:bg-[#E7EFEA]"
onClick={()=>setSection('add')}>Přidat nabídku</button>
              </div>
            </div>
            <div
className="overflow-x-auto">
             <table className="min-w-full text-sm">
               <thead className="text-left text-gray-500">
                 <tr>
                   <th className="py-2 pr-4">Název</th>
                   <th className="py-2 pr-4">Stav</th>
                   <th className="py-2 pr-4">Kliky</th>
                   <th className="py-2 pr-4">Štítky</th>
                   <th className="py-2">Akce</th>
                 </tr>
               </thead>
               <tbody className="align-top">
                 <tr className="border-t border-[#EEF3F0]">
                   <td className="py-2 pr-4">Lash lifting + brow
shape</td>
                   <td className="py-2 pr-4"><span
className="rounded bg-[#E7EFEA] px-2 py-0.5 text-[11px] text-[#2F4B40]
ring-1 ring-[#C8D6CF]">Aktivní</span></td>
                   <td className="py-2 pr-4">320</td>
                   <td className="py-2 pr-4">VIP</td>
                   <td className="py-2 flex gap-2">
                     <button className="rounded-sm border border-[#C8D6CF] px-2
py-1">Upravit</button>
                     <button className="rounded-sm border border-[#C8D6CF] px-2
py-1">Pozastavit</button>
                   </td>
                 </tr>
                 <tr className="border-t border-[#EEF3F0]">
                   <td className="py-2 pr-4">Masáž zad 45 min</td>
                   <td className="py-2 pr-4"><span
className="rounded bg-[#E7EFEA] px-2 py-0.5 text-[11px] text-[#2F4B40]
ring-1 ring-[#C8D6CF]">Aktivní</span></td>
                   <td className="py-2 pr-4">520</td>
                   <td className="py-2 pr-4">TOP</td>
                   <td className="py-2 flex gap-2">
                     <button className="rounded-sm border border-[#C8D6CF] px-2
py-1">Upravit</button>
                     <button className="rounded-sm border border-[#C8D6CF] px-2
py-1">Archivovat</button>
                   </td>
                 </tr>
               </tbody>
             </table>
            </div>
          </div>
           {section ===
'add' && (
             <div
className="space-y-4">
              <div
className="rounded-md border border-[#D2DED8] bg-white p-4">
                 <h2
className="text-base font-semibold text-blue-900 mb-3">Přidat
nabídku</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="rounded-sm border border-[#C8D6CF] h-9 px-2
text-sm" placeholder="Název" />
                  <select className="rounded-sm border border-[#C8D6CF] h-9 px-2
text-sm">
                    <option>Beauty & Wellbeing</option>
                    <option>Gastro</option>
                    <option>Ubytování</option>
                    <option>Reality</option>
                    <option>Řemesla</option>
                  </select>
                  <input className="rounded-sm border border-[#C8D6CF] h-9 px-2
text-sm" placeholder="Město / pobočka" />
                  <input className="rounded-sm border border-[#C8D6CF] h-9 px-2
text-sm" placeholder="Cena (např. 590 Kč)" />
                  <textarea className="rounded-sm border border-[#C8D6CF] px-2
py-2 text-sm sm:col-span-2" rows={3} placeholder="Krátký popis"
/>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <label className="inline-flex items-center gap-2
text-sm"><input type="checkbox" /> VIP
zvýraznění</label>
                  <label className="inline-flex items-center gap-2
text-sm"><input type="checkbox" defaultChecked/>
Okamžitě publikovat</label>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button className="rounded-sm border border-[#C8D6CF] px-3
py-1.5 text-sm text-blue-900 hover:bg-[#E7EFEA]">Uložit
návrh</button>
                  <button className="rounded-sm border border-[#2F4B40]
bg-[#2F4B40] px-3 py-1.5 text-sm text-white
hover:opacity-90">Publikovat</button>
                </div>
               </div>
               <div
className="rounded-md border border-[#D2DED8] bg-white p-4">
                 <h3
className="text-sm font-semibold text-blue-900 mb-2">Nastavení
publikace</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select className="rounded-sm border border-[#C8D6CF] h-9 px-2
text-sm"><option>Veřejně</option><option>Neveřejně
(tajný odkaz)</option></select>
                  <input className="rounded-sm border border-[#C8D6CF] h-9 px-2
text-sm" placeholder="Okruh (km) – např. 20" />
                  <div className="flex items-center gap-2
text-sm"><input type="checkbox" defaultChecked/>
Zobrazit v katalogu</div>
                </div>
               </div>
             </div>
               {section ===
'stats' && (
                 <div
className="rounded-md border border-[#D2DED8] bg-white p-4">
                   <h2
className="text-base font-semibold text-blue-900
mb-3">Statistiky</h2>
                   <div
className="text-sm text-gray-700">Grafy a tabulky (zobrazení,
kliky, CTR, konverze). Ukázka je zjednodušená.</div>
                </div>
               )}
               {/* Ostatní
sekce (orders, inbox, vip, reviews, billing, profile, settings) jsou připravené
jako stub */}
             </section>
           </div>
         );
}
 
function AppInner(){
 const { ref:
filterRef, stuck: filterStuck } = useSticky(56);
 
 
 const [query,
setQuery] = useState("");
 const [city,
setCity] = useState("");
 const [category,
setCategory] = useState("all");
 const [address,
setAddress] = useState("");
 const [radius,
setRadius] = useState(10);
 const [sortBy,
setSortBy] = useState("relevance"); // relevance | priceAsc |
discount
 // ADD(2025-10-10):
mobile menu state
 const [menuOpen,
setMenuOpen] = useState(false);
 // ADD(2025-10-28):
demo přepínač účtu po přihlášení
 const [accountOpen,
setAccountOpen] = useState(false);
 
 const CATS = [
   { key:
"beauty", label: "Beauty & Wellbeing" },
   { key:
"gastro", label: "Gastro" },
   { key:
"ubytovani", label: "Ubytování" },
   { key:
"reality", label: "Reality" },
   { key:
"remesla", label: "Řemesla" },
 ];
 const categoriesImgs
= {
   beauty:
"https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
   gastro:
"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&auto=format&fit=crop",
   ubytovani:
["https://images.unsplash.com/photo-1501117716987-c8e2a4a3af5a?q=80&w=600&auto=format&fit=crop",
LOCAL_IMAGES.ubytovani],
   reality:
"https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop",
   remesla:
"https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
 };
 
 const OFFERS = [
   { id: 1, title:
"Lash lifting + brow shape", provider: "Studio Ravé", city:
"Zábřeh", price: "890 Kč", oldPrice: "990 Kč",
newPrice: "890 Kč", discount: "–15%", promo: "–15% do
neděle", vip: true, categoryKey: "beauty", clicks: 320, addedAt:
"2025-10-09", description: "Luxusní balíček pro perfektní pohled
a zvýraznění přirozeného vzhledu.", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
},
   { id: 3, title:
"Degustační menu pro 2", provider: "Trattoria Capri", city:
"Olomouc", price: "1 290 Kč", oldPrice: "1 590
Kč", newPrice: "1 290 Kč", discount: "–300 Kč", promo:
"Sklenka prosecca zdarma", vip: true, categoryKey:
"gastro", clicks: 410, addedAt: "2025-10-10", description:
"Romantická večeře s autentickými italskými chutěmi.", img: ["https://images.unsplash.com/photo-1523986371872-9d3ba2a2b1a9?q=80&w=1200&auto=format&fit=crop",
LOCAL_IMAGES.degustace] },
   { id: 6, title:
"Penzion U Lípy", provider: "U Lípy", city:
"Zábřeh", price: "od 750 Kč/noc", oldPrice: "od 820
Kč/noc", newPrice: "od 750 Kč/noc", discount: "–70
Kč", promo: "Snídaně v ceně", vip: false, categoryKey:
"ubytovani", clicks: 180, addedAt: "2025-10-06",
description: "Rodinné ubytování v klidném prostředí se snídaní.",
img: ["https://images.unsplash.com/photo-1501117716987-c8e2a4a3af5a?q=80&w=1200&auto=format&fit=crop",
LOCAL_IMAGES.penzion] },
   { id: 2, title:
"Masáž zad 45 min", provider: "Salon Bella", city:
"Olomouc", price: "590 Kč", vip: false, categoryKey:
"beauty", clicks: 520, addedAt: "2025-10-10", description:
"Uvolněte napětí a dopřejte si odpočinek při příjemné masáži.", img:
"https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop"
},
   { id: 4, title:
"Obědové menu", provider: "Bistro 14", city:
"Šumperk", price: "149 Kč", vip: false, categoryKey:
"gastro", clicks: 460, addedAt: "2025-10-10", description:
"Chutné a rychlé denní menu za skvělou cenu.", img:
"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop"
},
   { id: 7, title:
"Pronájem 2+kk – centrum", provider: "Reality Paestum",
city: "Olomouc", price: "11 900 Kč", vip: true,
categoryKey: "reality", clicks: 95, addedAt: "2025-10-01",
description: "Moderní byt v centru s výbornou dostupností.", img:
"https://images.unsplash.com/photo-1560185008-b033106af2ff?q=80&w=1200&auto=format&fit=crop"
},
 ];
 
 // Pomocné parsování
ceny/slevy (hrubé, tolerantní vůči textu typu "od 750 Kč/noc")
 const parsePrice =
(v) => {
   if(!v) return
Infinity;
   const m =
String(v).replace(/[^0-9]/g, "");
   return m ?
parseInt(m,10) : Infinity;
 };
 const parseDiscount
= (v) => {
   if(!v) return 0;
   const s =
String(v);
   // najdi procenta
nebo Kč, vezmi číslo
   const num =
parseInt(s.replace(/[^0-9]/g, ""),10);
   if(!num &&
num!==0) return 0;
   // pokud obsahuje
% -> ber vyšší váhu než Kč (přibližně)
   return /%/.test(s)
? num * 100 : num;
 };
 
 // Auto-TOP: krátké
čerstvé okno (default 2 dny), výjimka pro Řemesla/Reality (delší)
 const daysSince =
(dateStr) => {
   try { return
Math.max(0, (Date.now() - new Date(dateStr).getTime())/(1000*60*60*24)); }
   catch { return
999; }
 };
 const
windowDaysByCat = (key) => (key === 'reality' ? 14 : key === 'remesla' ? 7 :
2);
 const score = (o)
=> {
   const clicks =
o.clicks || 0;
   const days =
daysSince(o.addedAt);
   const win =
windowDaysByCat(o.categoryKey);
   const inside =
Math.max(0, win - days);
   const
freshnessBoost = (inside / win) * 400; // výrazný bonus jen v okně
   return clicks +
freshnessBoost;
 };
 const qualifies =
(o) => {
   const days =
daysSince(o.addedAt);
   const win =
windowDaysByCat(o.categoryKey);
   return days <=
win && (o.clicks || 0) >= 10; // musí být v okně a mít aspoň 10
kliků
 };
 
 // Odvozené pole s
auto `top` (pouze pro standardní nabídky, ať VIP nejsou přeoznačkované)
 const derived =
useMemo(()=>{
   const copy =
OFFERS.map(o=>({ ...o }));
   const std =
copy.filter(o=>!o.vip);
  std.sort((a,b)=> score(b) - score(a));
   const nTop =
Math.min(6, Math.max(1, Math.round(std.length * 0.2))); // 20% (min 1, max 6)
   const
qualifiedSorted = std.filter(qualifies);
   const primary =
qualifiedSorted.slice(0, nTop);
   const topSet = new
Set(primary.map(o=>o.id));
   for(const o of
std){ if(topSet.size >= nTop) break; topSet.add(o.id); } // doplň do počtu
podle skóre
  std.forEach(o=>{ o.top = topSet.has(o.id); });
   return copy;
 }, []);
 
 const filtered =
useMemo(() => {
   const byCity =
derived.filter(o => city.trim() === "" ||
o.city.toLowerCase().includes(city.trim().toLowerCase()));
   const byCat =
category === "all" ? byCity : byCity.filter(o => o.categoryKey ===
category);
   const byQuery =
query.trim() === "" ? byCat : byCat.filter(o =>
    o.title.toLowerCase().includes(query.toLowerCase()) ||
    o.provider.toLowerCase().includes(query.toLowerCase())
   );
   return byQuery;
 }, [city, category,
query]);
 
 const vipOffers = filtered.filter(o
=> o.vip);
 const stdOffers =
filtered.filter(o => !o.vip);
 
 // VIP řazení:
nejvyšší sleva → novější
 const
sortedVipOffers = useMemo(() => {
   const arr =
[...vipOffers];
  arr.sort((a,b)=>{
     const d =
parseDiscount(b.discount||b.promo) - parseDiscount(a.discount||a.promo);
     if (d !== 0)
return d;
     return
daysSince(a.addedAt) - daysSince(b.addedAt); // novější první
   });
   return arr;
 }, [vipOffers]);
 
 const
sortedStdOffers = useMemo(() => {
   const arr =
[...stdOffers];
   if(sortBy ===
'priceAsc'){
    arr.sort((a,b)=> parsePrice(a.newPrice||a.price) -
parsePrice(b.newPrice||b.price));
   } else if(sortBy
=== 'discount'){
    arr.sort((a,b)=> parseDiscount(b.discount||b.promo) -
parseDiscount(a.discount||a.promo));
   }
   return arr;
 }, [stdOffers,
sortBy]);
 
 // --- DEV TESTS
(nekolidují s UI) ---
 useEffect(() => {
   try {
    console.assert(parsePrice('od 750 Kč/noc') === 750, 'parsePrice od 750
Kč/noc');
    console.assert(parsePrice('1 290 Kč') === 1290, 'parsePrice 1 290 Kč');
    console.assert(parseDiscount('–15%') === 1500, 'parseDiscount –15%');
    console.assert(parseDiscount('–300 Kč') === 300, 'parseDiscount –300
Kč');
     // windowDays
mapping
     console.assert(windowDaysByCat('beauty')
=== 2, 'windowDays beauty=2');
    console.assert(windowDaysByCat('remesla') === 7, 'windowDays
remesla=7');
    console.assert(windowDaysByCat('reality') === 14, 'windowDays
reality=14');
     // TOP count
(20% z 3 std nabídky => 1)
     const std =
derived.filter(o=>!o.vip);
    console.assert(std.filter(o=>o.top).length === Math.min(6,
Math.max(1, Math.round(std.length*0.2))), 'TOP count rule');
     // Nejvyšší
skóre ve standardu (v okně) by měl být id=2 (520 kliků dnes)
     const id2 =
derived.find(o=>o.id===2);
    console.assert(id2 && id2.top === true, 'id=2 should be TOP');
    console.log('ASPETi smoke tests OK');
   } catch (e) {
    console.error('ASPETi tests failed', e);
   }
 }, []);
 
 return (
   <div
className="min-h-screen bg-[#F5F7F6] text-gray-900">
     
     <header
className="bg-[#CAD8D0] text-blue-900 sticky top-0 z-20 border-b
border-[#B7C7BE]">
       <div
className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex
items-center justify-between h-14"
       >
         <a className="text-xl font-bold tracking-widest"
href="/">ASPETi</a>
         <nav className="hidden sm:flex space-x-4 text-sm
font-medium">
           <a href="#" className="hover:text-black">Nabídky</a>
           <a href="#" className="hover:text-black">Poskytovatelé</a>
           <a href="#" className="hover:text-black">O projektu</a>
           <a onClick={()=>setAccountOpen(true)} className="hover:text-black cursor-pointer">Přihlásit</a>
           <a href="#" className="rounded-full bg-[#2F4B40] text-white px-3 py-1 hover:bg-black">Registrovat</a>
         </nav>
       </div>
     </header>
 
     {accountOpen && (
      <AccountView onClose={()=>setAccountOpen(false)} />
     )}
     
     {!accountOpen && (
       <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
         <h1 className="text-2xl font-bold text-blue-900 mb-4">Katalog
nabídek</h1>
 
         {/* Kategorie */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3
mb-6">
           {CATS.map(c => (
             <CategoryPanel 
               key={c.key}
               active={category === c.key}
               label={c.label}
               img={categoriesImgs[c.key]}
               onClick={() => setCategory(c.key)}
             />
           ))}
         </div>
 
         {/* Sticky Filter Bar */}
         <div ref={filterRef} className={`z-10 ${filterStuck ? 'sticky top-14
pb-2 bg-[#F5F7F6]' : 'pb-2'}`}>
           <FilterBar
             count={filtered.length}
             city={city} setCity={setCity}
             address={address} setAddress={setAddress}
             radius={radius} setRadius={setRadius}
             category={category} setCategory={setCategory}
             query={query} setQuery={setQuery}
             stuck={filterStuck}
           />
         </div>
 
         {/* VIP Nabídky */}
         {sortedVipOffers.length > 0 && (
           <section className="mb-8">
             <h2 className="text-xl font-semibold text-gray-900 mb-3
border-b border-gray-200 pb-1">VIP Nabídky</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {sortedVipOffers.map(o => <VipCard key={o.id} o={o} />)}
             </div>
           </section>
         )}
 
         {/* Standardní Nabídky */}
         <section>
           <h2 className="text-xl font-semibold text-gray-900 mb-3
border-b border-gray-200 pb-1">Aktuální nabídky ({sortedStdOffers.length})</h2>
           <div className="flex items-center gap-2 text-sm text-gray-600
mb-3">
             <span>Seřadit:</span>
             <select value={sortBy} onChange={e => setSortBy(e.target.value)}
className="rounded-sm border border-gray-300 p-1 text-xs">
               <option value="relevance">Doporučené</option>
               <option value="priceAsc">Cena (nejnižší první)</option>
               <option value="discount">Sleva (nejvyšší první)</option>
             </select>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
gap-4">
             {sortedStdOffers.map(o => <StdCard key={o.id} o={o} />)}
           </div>
         </section>
       </main>
     )}
   </div>
 );
}
export default AppInner;