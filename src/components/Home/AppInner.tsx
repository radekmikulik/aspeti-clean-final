import React, { useState } from 'react'

interface NavItemProps {
  id: string
  label: string
  onClick?: () => void
}

interface VipCardProps {
  title: string
  description: string
  price: string
  isActive: boolean
}

interface StdCardProps {
  title: string
  description: string
  price: string
  views: number
  clicks: number
}

const VipCard: React.FC<VipCardProps> = ({ title, description, price, isActive }) => (
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-blue-100">{description}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold">{price}</div>
        <div className="text-sm text-blue-200">měsíčně</div>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className={`px-3 py-1 rounded-full text-sm ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
        {isActive ? 'Aktivní' : 'Neaktivní'}
      </span>
      <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
        {isActive ? 'Spravovat' : 'Aktivovat'}
      </button>
    </div>
  </div>
)

const StdCard: React.FC<StdCardProps> = ({ title, description, price, views, clicks }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-gray-900">{price}</div>
        <div className="text-sm text-gray-500">za nabídku</div>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">
        {views} zobrazení • {clicks} kliků
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
        Detail
      </button>
    </div>
  </div>
)

const NavItem: React.FC<NavItemProps> = ({ id, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition rounded-md"
  >
    {label}
  </button>
)

const AccountView: React.FC = () => {
  const [section, setSection] = useState('overview')

  // Stubs pro databázi - připraveno na API napojení
  const mockStats = {
    todayViews: 1284,
    todayClicks: 142,
    newMessages: 3,
    todayReservations: 5,
    accountBalance: 420
  }

  const mockOffers = [
    {
      id: 1,
      title: "Lash lifting + brow shape",
      location: "Praha 1",
      status: "TOP",
      price: "1,200 Kč",
      views: 156,
      clicks: 23
    },
    {
      id: 2,
      title: "Masáž zad 45 min",
      location: "Praha 2", 
      status: "Publikováno",
      price: "800 Kč",
      views: 89,
      clicks: 12
    }
  ]

  const mockMessages = [
    { id: 1, from: "Anna K.", message: "Dobrý den, chtěla bych se zeptat na dostupnost...", time: "10:30" },
    { id: 2, from: "Tomáš M.", message: "Můžeme rezervovat termín na příští týden?", time: "09:15" },
    { id: 3, from: "Lucie S.", message: "Děkuji za rychlou odpověď!", time: "08:45" }
  ]

  const mockReservations = [
    { id: 1, client: "Anna K.", service: "Lash lifting", time: "14:00", phone: "777 123 456" },
    { id: 2, client: "Tomáš M.", service: "Masáž zad", time: "16:30", phone: "666 789 012" },
    { id: 3, client: "Lucie S.", service: "Brow shape", time: "18:00", phone: "555 345 678" }
  ]

  const renderContent = () => {
    switch (section) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Statistiky */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Dnešní zobrazení</div>
                <div className="text-2xl font-bold text-blue-900">{mockStats.todayViews}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Kliky na detail</div>
                <div className="text-2xl font-bold text-blue-900">{mockStats.todayClicks}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Nové zprávy</div>
                <div className="text-2xl font-bold text-blue-900">{mockStats.newMessages}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs text-gray-500">Rezervace dnes</div>
                <div className="text-2xl font-bold text-blue-900">{mockStats.todayReservations}</div>
              </div>
            </div>

            {/* Rychlé akce */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-left">
                <div className="font-semibold mb-1">Přidat novou nabídku</div>
                <div className="text-sm text-blue-100">Vytvořte novou službu pro klienty</div>
              </button>
              <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-left">
                <div className="font-semibold mb-1">Nahrát fotky</div>
                <div className="text-sm text-green-100">Přidejte vizuální materiály</div>
              </button>
              <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-left">
                <div className="font-semibold mb-1">Pozvat člena</div>
                <div className="text-sm text-purple-100">Rozšiřte svůj tým</div>
              </button>
            </div>

            {/* Nedávné zprávy */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nedávné zprávy</h2>
              <div className="space-y-3">
                {mockMessages.map(msg => (
                  <div key={msg.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">{msg.from}</div>
                      <div className="text-xs text-gray-600">{msg.message}</div>
                    </div>
                    <div className="text-xs text-gray-500">{msg.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dnešní rezervace */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dnešní rezervace</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4">Klient</th>
                      <th className="py-2 pr-4">Služba</th>
                      <th className="py-2 pr-4">Čas</th>
                      <th className="py-2 pr-4">Telefon</th>
                      <th className="py-2 pr-4">Akce</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReservations.map(res => (
                      <tr key={res.id} className="border-b">
                        <td className="py-2 pr-4">{res.client}</td>
                        <td className="py-2 pr-4">{res.service}</td>
                        <td className="py-2 pr-4">{res.time}</td>
                        <td className="py-2 pr-4">{res.phone}</td>
                        <td className="py-2 pr-4">
                          <button className="text-green-600 hover:text-green-800 mr-2">Potvrdit</button>
                          <button className="text-red-600 hover:text-red-800">Zrušit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aktivní nabídky */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivní nabídky</h2>
              <div className="space-y-4">
                {mockOffers.map(offer => (
                  <div key={offer.id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{offer.title}</div>
                      <div className="text-sm text-gray-600">{offer.location} • {offer.price}</div>
                      <div className="text-xs text-gray-500">{offer.views} zobrazení • {offer.clicks} kliků</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${offer.status === 'TOP' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {offer.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Upravit</button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">Pozastavit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kredit účtu */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Kredit účtu</h3>
                  <div className="text-2xl font-bold text-green-600">{mockStats.accountBalance} Kč</div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    Dobít kredit
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                    Faktury
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'offers':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Moje nabídky</h2>
              <button 
                onClick={() => setSection('add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Přidat nabídku
              </button>
            </div>
            <div className="space-y-4">
              {mockOffers.map(offer => (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{offer.title}</h3>
                      <p className="text-gray-600">{offer.location} • {offer.price}</p>
                      <div className="text-sm text-gray-500 mt-1">
                        {offer.views} zobrazení • {offer.clicks} kliků • {offer.status}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Upravit
                      </button>
                      <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                        Pozastavit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'add':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Přidat novou nabídku</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Název služby</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Např. Masáž zad 45 min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Popis</label>
                <textarea 
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Popište vaši službu..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cena (Kč)</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokalita</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Praha 1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Vyberte kategorii</option>
                  <option value="beauty">Beauty & Wellbeing</option>
                  <option value="gastro">Gastro</option>
                  <option value="ubytovani">Ubytování</option>
                  <option value="reality">Reality</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Publikovat nabídku
                </button>
                <button 
                  type="button"
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Uložit jako koncept
                </button>
              </div>
            </form>
          </div>
        )

      case 'vip':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">VIP & Propagace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VipCard
                title="VIP Starter"
                description="Základní propagace pro malé podniky"
                price="299 Kč"
                isActive={false}
              />
              <VipCard
                title="VIP Premium"
                description="Pokročilá propagace s priorizací"
                price="599 Kč"
                isActive={true}
              />
              <StdCard
                title="Boost nabídky"
                description="Zvýšení viditelnosti vybraných nabídek"
                price="50 Kč"
                views={245}
                clicks={28}
              />
              <StdCard
                title="Reklama v aplikaci"
                description="Zobrazení v horní části výsledků"
                price="199 Kč"
                views={156}
                clicks={45}
              />
            </div>
          </div>
        )

      case 'stats':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistiky</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{mockStats.todayViews}</div>
                <div className="text-gray-600">Celkem zobrazení</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{mockStats.todayClicks}</div>
                <div className="text-gray-600">Kliky na detail</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">12%</div>
                <div className="text-gray-600">Míra konverze</div>
              </div>
            </div>
            {/* TODO: Grafy a detailní statistiky */}
          </div>
        )

      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{section}</h2>
            <p className="text-gray-600">Sekce "{section}" bude brzy dostupná.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Navigační menu */}
          <aside className="md:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">Můj účet</h1>
              <nav className="space-y-1">
                <NavItem id="overview" label="Přehled" onClick={() => setSection('overview')} />
                <NavItem id="offers" label="Moje nabídky" onClick={() => setSection('offers')} />
                <NavItem id="add" label="Přidat nabídku" onClick={() => setSection('add')} />
                <NavItem id="orders" label="Rezervace / Objednávky" onClick={() => setSection('orders')} />
                <NavItem id="inbox" label="Zprávy" onClick={() => setSection('inbox')} />
                <NavItem id="vip" label="VIP & Propagace" onClick={() => setSection('vip')} />
                <NavItem id="stats" label="Statistiky" onClick={() => setSection('stats')} />
                <NavItem id="reviews" label="Hodnocení" onClick={() => setSection('reviews')} />
                <NavItem id="billing" label="Fakturace" onClick={() => setSection('billing')} />
                <NavItem id="profile" label="Profil" onClick={() => setSection('profile')} />
                <NavItem id="settings" label="Nastavení" onClick={() => setSection('settings')} />
              </nav>
            </div>
          </aside>

          {/* Hlavní obsah */}
          <main className="md:col-span-9">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function AppInner() {
  return <AccountView />
}