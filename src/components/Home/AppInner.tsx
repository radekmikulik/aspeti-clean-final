

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { DatabaseService, Offer } from '@/lib/supabase'

interface FilterProps {
  query: string
  setQuery: (query: string) => void
  category: string
  setCategory: (category: string) => void
  location: string
  setLocation: (location: string) => void
  sortBy: string
  setSortBy: (sortBy: string) => void
}

// Komponenta pro 5 velkých kategorií panelů
const CategoryPanels: React.FC<{ 
  selectedCategory: string
  setSelectedCategory: (category: string) => void 
}> = ({ selectedCategory, setSelectedCategory }) => {
  
  const categories = [
    { id: 'beauty', name: 'Beauty & Wellbeing', icon: '💄', count: 3, bgColor: '#ec4899' },
    { id: 'gastro', name: 'Gastro', icon: '🍽️', count: 1, bgColor: '#f97316' },
    { id: 'accommodation', name: 'Ubytování', icon: '🏨', count: 2, bgColor: '#3b82f6' },
    { id: 'reality', name: 'Reality', icon: '🏠', count: 1, bgColor: '#10b981' },
    { id: 'crafts', name: 'Řemesla', icon: '🔧', count: 1, bgColor: '#f59e0b' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 p-6 bg-primary-50 rounded-xl shadow-sm">
      <h3 className="col-span-1 md:col-span-5 text-xl font-bold text-primary-800 mb-4">
        Kategorie služeb
      </h3>
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => {
            setSelectedCategory(cat.id)
          }}
          className={`
            cursor-pointer min-h-[120px] p-6 rounded-xl flex flex-col justify-between
            transition-all duration-200 transform hover:scale-105 hover:shadow-md
            ${selectedCategory === cat.id 
              ? 'ring-4 ring-primary-400 scale-105 shadow-lg' 
              : 'hover:shadow-md'
            }
            text-white
          `}
          style={{
            backgroundColor: cat.bgColor,
          }}
        >
          <div className="text-3xl mb-2">{cat.icon}</div>
          <div>
            <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
            <p className="text-xs opacity-90">{cat.count} nabídek</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const FilterBar: React.FC<FilterProps & { totalCount: number }> = ({ 
  query, setQuery, 
  category, setCategory, 
  location, setLocation, 
  sortBy, setSortBy,
  totalCount
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Filtr</h3>
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        Nalezeno: {totalCount}
      </span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Vyhledávání */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hledat služby</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Např. masáž, kadeřnictví..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Kategorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Všechny kategorie</option>
          <option value="beauty">Beauty & Wellbeing</option>
          <option value="gastro">Gastro</option>
          <option value="accommodation">Ubytování</option>
          <option value="reality">Reality</option>
          <option value="crafts">Řemesla</option>
        </select>
      </div>

      {/* Lokalita */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lokalita</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Např. Praha 1"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Řazení */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Řazení</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="relevance">Podle relevance</option>
          <option value="priceAsc">Nejnižší cena</option>
          <option value="priceDesc">Nejvyšší cena</option>
          <option value="rating">Nejlepší hodnocení</option>
        </select>
      </div>
    </div>
  </div>
)

// VIP karta (2 vedle sebe)
const VipCard: React.FC<{ offer: Offer }> = ({ offer }) => (
  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-video bg-gradient-to-r from-yellow-200 to-yellow-300 flex items-center justify-center">
      <span className="text-yellow-800 font-bold text-lg">⭐ VIP nabídka</span>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">VIP</span>
        </div>
        <div className="flex items-center">
          <span className="text-yellow-400 mr-1">★</span>
          <span className="text-sm text-gray-600">{offer.provider?.rating || 0}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{offer.location}</span>
        <span className="text-xl font-bold text-yellow-600">{offer.price} Kč</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{offer.provider?.name || 'Neznámý poskytovatel'}</span>
        <button 
          onClick={() => console.log('Zobrazit detail VIP nabídky:', offer.id)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition font-semibold"
        >
          Zobrazit detail
        </button>
      </div>
    </div>
  </div>
)

// Standardní karta (3 vedle sebe)
const StdCard: React.FC<{ offer: Offer }> = ({ offer }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-video bg-gray-200 flex items-center justify-center">
      <span className="text-gray-400">Obrázek služby</span>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
        <div className="flex items-center">
          <span className="text-yellow-400 mr-1">★</span>
          <span className="text-sm text-gray-600">{offer.provider?.rating || 0}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{offer.location}</span>
        <span className="text-lg font-bold text-blue-600">{offer.price} Kč</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{offer.provider?.name || 'Neznámý poskytovatel'}</span>
        <button 
          onClick={() => console.log('Zobrazit detail nabídky:', offer.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Zobrazit detail
        </button>
      </div>
    </div>
  </div>
)

const AccountView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  
  // Mock provider ID pro testování (v produkci by to bylo z auth)
  const providerId = '11111111-1111-1111-1111-111111111111'

  // Načtení dat dashboardu
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        console.log('📊 Loading provider dashboard data...')
        
        const [credits, offers, stats, currentBalance] = await Promise.all([
          DatabaseService.getProviderCredits(providerId),
          DatabaseService.getProviderOffers(providerId),
          DatabaseService.getProviderStats(providerId),
          DatabaseService.getCurrentCreditBalance(providerId)
        ])

        setDashboardData({
          credits,
          offers,
          stats,
          currentBalance
        })
        
        console.log('📊 Dashboard data loaded:', {
          credits: credits?.length || 0,
          offers: offers?.length || 0,
          balance: currentBalance
        })
      } catch (error) {
        console.error('Chyba při načítání dashboardu:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [providerId])

  const tabs = [
    { id: 'dashboard', name: 'Přehled', icon: '📊' },
    { id: 'offers', name: 'Správa nabídek', icon: '📋' },
    { id: 'credits', name: 'Můj kredit', icon: '💰' },
    { id: 'messages', name: 'Zprávy', icon: '💬' }
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800">Kredit</h4>
          <p className="text-2xl font-bold text-blue-600">
            {dashboardData?.currentBalance || 0} Kč
          </p>
          {dashboardData?.currentBalance < 20 && (
            <p className="text-xs text-orange-600 mt-1">⚠️ Nízký kredit</p>
          )}
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800">Nabídky</h4>
          <p className="text-2xl font-bold text-green-600">
            {dashboardData?.offers?.length || 0}
          </p>
          <p className="text-xs text-green-600 mt-1">Aktivní nabídky</p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-800">Zobrazení</h4>
          <p className="text-2xl font-bold text-purple-600">
            {dashboardData?.stats?.total_views || 0}
          </p>
          <p className="text-xs text-purple-600 mt-1">Celkem za měsíc</p>
        </div>
      </div>

      {dashboardData?.currentBalance < 20 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-orange-600 mr-2">⚠️</span>
            <div>
              <h4 className="text-sm font-medium text-orange-800">Nízký kredit</h4>
              <p className="text-sm text-orange-600">
                Váš kredit klesl pod 20 Kč. Nabijte si kredit pro pokračování v reklamě.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderCredits = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Můj kredit</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Nabít kredit
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Aktuální zůstatek</h4>
        <p className="text-3xl font-bold text-gray-900">
          {dashboardData?.currentBalance || 0} Kč
        </p>
        {dashboardData?.currentBalance < 20 && (
          <p className="text-sm text-orange-600 mt-2">⚠️ Nízký kredit - doporučujeme nabití</p>
        )}
      </div>

      <div>
        <h4 className="text-md font-semibold mb-4">Historie transakcí</h4>
        <div className="space-y-2">
          {dashboardData?.credits?.slice(0, 5).map((transaction: any) => (
            <div key={transaction.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium">{transaction.description || 'Transakce'}</p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.created_at).toLocaleDateString('cs-CZ')}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} Kč
                </p>
                <p className="text-xs text-gray-500">
                  Zůstatek: {transaction.balance_after} Kč
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderOffers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Správa nabídek</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          + Přidat nabídku
        </button>
      </div>

      <div className="space-y-4">
        {dashboardData?.offers?.map((offer: any) => (
          <div key={offer.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-md font-semibold text-gray-900">{offer.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-gray-500">{offer.category}</span>
                  <span className="text-sm text-gray-500">{offer.location}</span>
                  <span className="text-sm font-semibold text-blue-600">{offer.price} Kč</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  offer.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {offer.is_active ? 'Aktivní' : 'Neaktivní'}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Upravit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Zprávy a poptávky</h3>
      <div className="text-center py-12 text-gray-500">
        <p>Zatím žádné zprávy</p>
        <p className="text-sm mt-2">Zprávy od zákazníků se zobrazí zde</p>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'credits': return renderCredits()
      case 'offers': return renderOffers()
      case 'messages': return renderMessages()
      default: return renderDashboard()
    }
  }

  return (
    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto m-4">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Můj účet poskytovatele</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Tab navigace */}
        <div className="flex space-x-1 mt-4 bg-gray-100 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  )
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

export default function AppInner() {
  // IMMEDIATE TEST - should appear in console immediately
  console.log('🔥 IMMEDIATE TEST: AppInner component mounted!')
  
  const [accountOpen, setAccountOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  console.log('📦 AppInner state initialized:', { accountOpen, selectedCategory, offers: offers.length })

  // Propojení vybraných kategorií s filtrem
  useEffect(() => {
    if (selectedCategory === "all") {
      setCategory("all")
    } else {
      setCategory(selectedCategory)
    }
  }, [selectedCategory, setCategory])

  // Načtení nabídek z databáze
  useEffect(() => {
    const loadOffers = async () => {
      console.log('🚀 loadOffers called with:', { query, category, location, sortBy })
      
      try {
        setLoading(true)
        setError(null)
        
        console.log('📡 Calling DatabaseService.getOffers...')
        const data = await DatabaseService.getOffers({
          query,
          category: category === "all" ? undefined : category,
          location,
          sortBy: sortBy as any
        })
        
        console.log('✅ DatabaseService returned data:', data?.length || 0, 'offers')
        setOffers(data || [])
        
        if (!data || data.length === 0) {
          console.log('⚠️ No data returned from database, falling back to mock data')
        }
      } catch (err) {
        console.error('❌ Chyba při načítání nabídek:', err)
        setError('Chyba při načítání nabídek. Zkuste to později.')
        
        console.log('📋 Loading mock data as fallback...')
        // Fallback na mock data pro demo
        const mockOffers: Offer[] = [
          {
            id: '1',
            title: "Masáž zad 45 min",
            description: "Profesionální masáž zad s aromaterapií",
            price: 800,
            location: "Praha 1",
            category: "beauty",
            provider_id: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 156,
            vip: true,
            provider: {
              name: "Relax Studio",
              rating: 4.8
            }
          },
          {
            id: '2',
            title: "Lash lifting + brow shape",
            description: "Zdvihnutí řas a tvarování obočí",
            price: 1200,
            location: "Praha 2",
            category: "beauty",
            provider_id: '2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 234,
            vip: false,
            provider: {
              name: "Beauty Studio",
              rating: 4.9
            }
          },
          {
            id: '3',
            title: "Manikúra s gelovým lakem",
            description: "Kompletní péče o nehty s dlouhodobým gelovým lakem",
            price: 650,
            location: "Praha 3",
            category: "beauty",
            provider_id: '3',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 89,
            vip: false,
            provider: {
              name: "Nail Art Studio",
              rating: 4.7
            }
          },
          {
            id: '10',
            title: "Chemický peeling obličeje",
            description: "Hloubková omlazení pleti chemickým peelingem",
            price: 2000,
            location: "Praha 2",
            category: "beauty",
            provider_id: '10',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 145,
            vip: false,
            provider: {
              name: "Skin Clinic",
              rating: 4.9
            }
          },
          {
            id: '11',
            title: "Wellness pobyt na horách",
            description: "3 dny relaxace v horském hotelu",
            price: 4200,
            location: "Špindlerův Mlýn",
            category: "accommodation",
            provider_id: '11',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 189,
            vip: false,
            provider: {
              name: "Mountain Spa",
              rating: 4.8
            }
          },
          {
            id: '4',
            title: "Osobní trénink fitness",
            description: "Individuální fitness trénink s osobním trenérem",
            price: 900,
            location: "Praha 4",
            category: "sport",
            provider_id: '4',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 145,
            vip: false,
            provider: {
              name: "Fit Zone",
              rating: 4.6
            }
          },
          {
            id: '5',
            title: "Rodinné fotení v ateliéru",
            description: "Profesionální fotografování rodinných portrétů",
            price: 2500,
            location: "Praha 5",
            category: "photo",
            provider_id: '5',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 78,
            vip: false,
            provider: {
              name: "Photo Studio",
              rating: 4.9
            }
          },
          {
            id: '6',
            title: "Večeře pro dva",
            description: "Romantická večeře ve francouzském stylu",
            price: 1500,
            location: "Praha 1",
            category: "gastro",
            provider_id: '6',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 203,
            vip: false,
            provider: {
              name: "Le Chic",
              rating: 4.8
            }
          },
          {
            id: '7',
            title: "Wellness víkend",
            description: "2 noci s wellness programem",
            price: 3500,
            location: "Karlovy Vary",
            category: "accommodation",
            provider_id: '7',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 167,
            vip: false,
            provider: {
              name: "Spa Resort",
              rating: 4.7
            }
          },
          {
            id: '8',
            title: "Pronájem bytu 2+kk",
            description: "Moderní byt v centru města",
            price: 15000,
            location: "Praha 1",
            category: "reality",
            provider_id: '8',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 234,
            vip: false,
            provider: {
              name: "Real Plus",
              rating: 4.5
            }
          },
          {
            id: '9',
            title: "Oprava kola",
            description: "Kompletní servis jízdního kola",
            price: 600,
            location: "Praha 3",
            category: "crafts",
            provider_id: '9',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            views_count: 89,
            vip: false,
            provider: {
              name: "Bike Service",
              rating: 4.6
            }
          }
        ]
        
        console.log('📊 Setting mock offers:', mockOffers.length, 'offers')
        console.log('🎯 VIP offers in mock:', mockOffers.filter(o => o.vip).length)
        console.log('📋 Standard offers in mock:', mockOffers.filter(o => !o.vip).length)
        
        setOffers(mockOffers)
      } finally {
        setLoading(false)
      }
    }

    // Debounce pro vyhledávání
    const timer = setTimeout(() => {
      loadOffers()
    }, 300)

    return () => clearTimeout(timer)
  }, [query, category, location, sortBy])

  return (
    <>
      <Head>
        <title>ASPETi - Katalog nabídek</title>
        <meta name="description" content="ASPETi - Katalog nabídek pro poskytovatele služeb a zákazníky" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-primary-600">ASPETi</h1>
                {!accountOpen && (
                  <span className="text-sm text-gray-500 hidden md:inline">
                    Katalog nabídek
                  </span>
                )}
                {accountOpen && (
                  <span className="text-sm text-gray-500 hidden md:inline">
                    Můj účet
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {!accountOpen ? (
                  <button
                    onClick={() => setAccountOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                  >
                    <span>Můj účet</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setAccountOpen(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center space-x-2"
                  >
                    <span>Zpět na katalog</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Katalog nabídek</h2>
            <p className="text-gray-600">Najděte si perfektní službu pro vás</p>
          </div>

          <CategoryPanels
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />


          


          <FilterBar
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalCount={offers.length}
          />

          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {loading ? 'Načítání...' : `Nalezeno ${offers.length} nabídek`}
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">{error}</p>
              <p className="text-yellow-600 text-sm mt-1">
                Zobrazují se ukázková data pro demonstraci funkcionality.
              </p>
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {/* VIP nabídky - 2 vedle sebe */}
              {offers.filter(offer => offer.vip).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center">
                    ⭐ VIP nabídky
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {offers.filter(offer => offer.vip).map(offer => (
                      <VipCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                </div>
              )}

              {/* Standardní nabídky - 3 vedle sebe */}
              {offers.filter(offer => !offer.vip).length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">
                    Všechny nabídky
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.filter(offer => !offer.vip).map(offer => (
                      <StdCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && offers.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nebyly nalezeny žádné nabídky odpovídající vašim kritériím.</p>
            </div>
          )}

          {/* AccountView jako overlay */}
          {accountOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AccountView onClose={() => setAccountOpen(false)} />
            </div>
          )}
        </main>
      </div>
    </>
  )
}