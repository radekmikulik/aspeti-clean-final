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

const FilterBar: React.FC<FilterProps> = ({ 
  query, setQuery, 
  category, setCategory, 
  location, setLocation, 
  sortBy, setSortBy 
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
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
          <option value="sport">Sport & Fitness</option>
          <option value="photo">Fotografování</option>
          <option value="gastro">Gastro</option>
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

const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => (
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

const AccountView: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Můj účet poskytovatele</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Přihlášení</h3>
          <p className="text-gray-600 mb-6">Pro přístup k vašemu účtu se přihlaste</p>
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              Přihlásit se
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition">
              Registrovat se
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

export default function AppInner() {
  const [accountOpen, setAccountOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Načtení nabídek z databáze
  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await DatabaseService.getOffers({
          query,
          category: category === "all" ? undefined : category,
          location,
          sortBy: sortBy as any
        })
        
        setOffers(data || [])
      } catch (err) {
        console.error('Chyba při načítání nabídek:', err)
        setError('Chyba při načítání nabídek. Zkuste to později.')
        
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
            provider: {
              name: "Nail Art Studio",
              rating: 4.7
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
            provider: {
              name: "Photo Studio",
              rating: 4.9
            }
          }
        ]
        
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
              <h1 className="text-2xl font-bold text-blue-600">ASPETi</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAccountOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Můj účet
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Katalog nabídek</h2>
            <p className="text-gray-600">Najděte si perfektní službu pro vás</p>
          </div>

          <FilterBar
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            location={location}
            setLocation={setLocation}
            sortBy={sortBy}
            setSortBy={setSortBy}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}

          {!loading && offers.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nebyly nalezeny žádné nabídky odpovídající vašim kritériím.</p>
            </div>
          )}
        </main>
      </div>

      {accountOpen && (
        <AccountView onClose={() => setAccountOpen(false)} />
      )}
    </>
  )
}