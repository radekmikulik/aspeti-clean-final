import React, { useState } from 'react'
import Head from 'next/head'

interface Offer {
  id: number
  title: string
  description: string
  price: number
  location: string
  category: string
  image: string
  provider: string
  rating: number
  views: number
}

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

const mockOffers: Offer[] = [
  {
    id: 1,
    title: "Masáž zad 45 min",
    description: "Profesionální masáž zad s aromaterapií",
    price: 800,
    location: "Praha 1",
    category: "beauty",
    image: "/images/massage.jpg",
    provider: "Relax Studio",
    rating: 4.8,
    views: 156
  },
  {
    id: 2,
    title: "Lash lifting + brow shape",
    description: "Zdvihnutí řas a tvarování obočí",
    price: 1200,
    location: "Praha 2",
    category: "beauty",
    image: "/images/lashes.jpg",
    provider: "Beauty Studio",
    rating: 4.9,
    views: 234
  },
  {
    id: 3,
    title: "Manikúra s gelovým lakem",
    description: "Kompletní péče o nehty s dlouhodobým gelovým lakem",
    price: 650,
    location: "Praha 3",
    category: "beauty",
    image: "/images/manicure.jpg",
    provider: "Nail Art Studio",
    rating: 4.7,
    views: 89
  },
  {
    id: 4,
    title: "Osobní trénink fitness",
    description: "Individuální fitness trénink s osobním trenérem",
    price: 900,
    location: "Praha 4",
    category: "sport",
    image: "/images/fitness.jpg",
    provider: "Fit Zone",
    rating: 4.6,
    views: 145
  },
  {
    id: 5,
    title: "Rodinné fotení v ateliéru",
    description: "Profesionální fotografování rodinných portrétů",
    price: 2500,
    location: "Praha 5",
    category: "photo",
    image: "/images/photography.jpg",
    provider: "Photo Studio",
    rating: 4.9,
    views: 78
  }
]

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
          <span className="text-sm text-gray-600">{offer.rating}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{offer.location}</span>
        <span className="text-lg font-bold text-blue-600">{offer.price} Kč</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{offer.provider}</span>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
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

export default function AppInner() {
  const [accountOpen, setAccountOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("")
  const [sortBy, setSortBy] = useState("relevance")

  const filteredOffers = mockOffers.filter(offer => {
    const matchesQuery = offer.title.toLowerCase().includes(query.toLowerCase()) ||
                        offer.description.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === "all" || offer.category === category
    const matchesLocation = location === "" || offer.location.toLowerCase().includes(location.toLowerCase())
    
    return matchesQuery && matchesCategory && matchesLocation
  })

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case "priceAsc":
        return a.price - b.price
      case "priceDesc":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return b.views - a.views
    }
  })

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
              Nalezeno {sortedOffers.length} nabídek
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {sortedOffers.length === 0 && (
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