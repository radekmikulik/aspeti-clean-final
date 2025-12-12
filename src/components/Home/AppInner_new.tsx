// ASPETi PLUS - Hlavní komponenta s autentizací
// KROK 6: AUTENTIZACE UŽIVATELŮ - Supabase Auth

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DatabaseService, Offer } from '@/lib/supabase'
import { CalendarAndMessagesService } from '@/lib/calendar-messages-service'
// import { useAuth } from '@/hooks/useAuth'
// import { AuthService } from '@/lib/auth-service'
// import { AuthModal } from '@/components/Auth/AuthModal'
// import { ProtectedRoute } from '@/components/Auth/ProtectedRoute'
import { AvailabilitySettings } from '@/components/Calendar/AvailabilitySettings'
import { BlackoutSettings } from '@/components/Calendar/BlackoutSettings'
import { ChatComponent } from '@/components/Chat/ChatComponent'

// VIP karta (2 vedle sebe) - klikací celá karta
const VipCard: React.FC<{ 
  offer: Offer
  onReserve: (offer: Offer) => void
}> = ({ offer, onReserve }) => {
  const handleCardClick = () => {
    // Přejdi na detail nabídky
    window.location.href = `/offers/${offer.id}`
  }

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Zabraň navigaci na detail při kliknutí na rezervovat
    onReserve(offer)
  }

  return (
    <div 
      onClick={handleCardClick}
      style={{
        background: 'linear-gradient(to right, #fef3c7, #fde68a)',
        border: '2px solid #f59e0b',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{
        aspectRatio: '16/9',
        background: 'linear-gradient(to right, #fde68a, #f59e0b)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <span style={{ color: '#92400e', fontWeight: 'bold', fontSize: '18px' }}>⭐ VIP nabídka</span>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>{offer.title}</h3>
            <span style={{ 
              backgroundColor: '#eab308', 
              color: 'white', 
              padding: '2px 8px', 
              borderRadius: '9999px', 
              fontSize: '12px', 
              fontWeight: 'bold' 
            }}>VIP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#fbbf24', marginRight: '4px' }}>★</span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>{offer.provider?.rating || 0}</span>
          </div>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{offer.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{offer.location}</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#d97706' }}>{offer.price} Kč</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{offer.provider?.name || 'Neznámý poskytovatel'}</span>
          <button 
            onClick={handleReserveClick}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#15803d'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#16a34a'}
          >
            Rezervovat
          </button>
        </div>
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(180, 83, 9, 0.2)' }}>
          <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>💡 Klikněte na kartu pro zobrazení detailu</span>
        </div>
      </div>
    </div>
  )
}

// Standardní karta (3 vedle sebe) - klikací celá karta
const StdCard: React.FC<{ 
  offer: Offer
  onReserve: (offer: Offer) => void
}> = ({ offer, onReserve }) => {
  const handleCardClick = () => {
    // Přejdi na detail nabídky
    window.location.href = `/offers/${offer.id}`
  }

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Zabraň navigaci na detail při kliknutí na rezervovat
    onReserve(offer)
  }

  return (
    <div 
      onClick={handleCardClick}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#2563eb'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#e5e7eb'
      }}
    >
      <div style={{
        aspectRatio: '16/9',
        backgroundColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <span style={{ color: '#9ca3af' }}>Obrázek služby</span>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>{offer.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#fbbf24', marginRight: '4px' }}>★</span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>{offer.provider?.rating || 0}</span>
          </div>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{offer.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{offer.location}</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{offer.price} Kč</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{offer.provider?.name || 'Neznámý poskytovatel'}</span>
          <button 
            onClick={handleReserveClick}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#15803d'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#16a34a'}
          >
            Rezervovat
          </button>
        </div>
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>💡 Klikněte na kartu pro zobrazení detailu</span>
        </div>
      </div>
    </div>
  )
}

// Zde bude pokračování s AccountView a hlavní komponentou...

export default function AppInner() {
  const router = useRouter()
  const [accountOpen, setAccountOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  
  // Auth hook (temporarily disabled for build)
  // const { user, loading: authLoading, isAuthenticated, userRole } = useAuth()
  
  // Mock auth state for testing
  const user = { id: '11111111-1111-1111-1111-111111111111', email: 'test@example.com', user_metadata: { full_name: 'Test User', role: 'provider' } }
  const authLoading = false
  const isAuthenticated = true
  let userRole = 'provider' as 'client' | 'provider'

  // Načtení nabídek z reálné Supabase databáze
  useEffect(() => {
    const loadOffers = async () => {
      try {
        console.log('🚀 Loading offers from Supabase database...')
        const data = await DatabaseService.getOffers()
        setOffers(data)
        
        // Získej dostupné kategorie z nabídek
        const categories = [...new Set(data.map(offer => offer.category).filter(Boolean))]
        setAvailableCategories(categories)
        
        setError(null)
        console.log(`✅ Loaded ${data.length} offers from Supabase`)
        console.log(`✅ Available categories:`, categories)
      } catch (error) {
        console.error('❌ Error loading offers from Supabase:', error)
        setError('Chyba při načítání nabídek z databáze')
      } finally {
        setLoading(false)
      }
    }

    loadOffers()
  }, [])

  // Funkce pro otevření rezervace (předaná do karet)
  const handleReserve = (offer: Offer) => {
    // Místo otevření účtu, přejdi na detail nabídky kde bude rezervace
    window.location.href = `/offers/${offer.id}`
  }

  // Filtrování nabídek
  const filteredOffers = offers.filter(offer => {
    const matchesQuery = offer.title.toLowerCase().includes(query.toLowerCase()) ||
                         offer.description.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === "all" || offer.category === category
    const matchesLocation = !location || offer.location.toLowerCase().includes(location.toLowerCase())
    
    return matchesQuery && matchesCategory && matchesLocation
  })

  // Řazení nabídek
  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc': return a.price - b.price
      case 'priceDesc': return b.price - a.price
      case 'rating': return (b.provider?.rating || 0) - (a.provider?.rating || 0)
      default: return 0
    }
  })

  return (
    <>
      <Head>
        <title>ASPETi PLUS - Katalog služeb</title>
        <meta name="description" content="Najděte si perfektní službu pro vás" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>ASPETi PLUS</h1>
              </div>
              
              {/* Auth sekce */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {authLoading ? (
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Načítání...</span>
                ) : isAuthenticated ? (
                  <>
                    <span style={{ color: '#374151', fontSize: '14px' }}>
                      👋 Ahoj, {user?.user_metadata?.full_name || user?.email}
                    </span>
                    <button 
                      onClick={() => router.push('/account/profile/edit')}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Můj účet
                    </button>
                    <button 
                      onClick={() => console.log('Sign out clicked (mock)')}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Odhlásit
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    style={{
                      backgroundColor: '#16a34a',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Přihlásit se / Registrovat
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Katalog nabídek</h2>
            <p style={{ color: '#6b7280' }}>Najděte si perfektní službu pro vás</p>
          </div>

          {/* Vyhledávání a filtrování */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {/* Vyhledávání */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  🔍 Hledat službu
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Název služby..."
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Kategorie */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  📂 Kategorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    outline: 'none'
                  }}
                >
                  <option value="all">Všechny kategorie</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'beauty' ? 'Krása a wellness' :
                       cat === 'sport' ? 'Sport a fitness' :
                       cat === 'education' ? 'Vzdělávání' :
                       cat === 'home' ? 'Domácí služby' :
                       cat === 'food' ? 'Gastronomie' :
                       cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lokace */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  📍 Lokace
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Město nebo region..."
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Řazení */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  🔄 Řadit podle
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    outline: 'none'
                  }}
                >
                  <option value="relevance">Relevance</option>
                  <option value="priceAsc">Cena: nízká → vysoká</option>
                  <option value="priceDesc">Cena: vysoká → nízká</option>
                  <option value="rating">Hodnocení</option>
                </select>
              </div>
            </div>

            {/* Tlačítka akce */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {loading ? 'Načítání z Supabase databáze...' : `Nalezeno ${sortedOffers.length} nabídek`}
              </p>
              <button
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                  setLocation('')
                  setSortBy('relevance')
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔄 Vymazat filtry
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#92400e' }}>{error}</p>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p style={{ color: '#6b7280' }}>Načítání nabídek z Supabase databáze...</p>
            </div>
          ) : (
            <div>
              {/* VIP nabídky - 2 vedle sebe */}
              {sortedOffers.filter(offer => offer.vip).length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                    ⭐ VIP nabídky
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {sortedOffers.filter(offer => offer.vip).map(offer => (
                      <VipCard key={offer.id} offer={offer} onReserve={handleReserve} />
                    ))}
                  </div>
                </div>
              )}

              {/* Standardní nabídky - 3 vedle sebe */}
              {sortedOffers.filter(offer => !offer.vip).length > 0 && (
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>
                    Všechny nabídky
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {sortedOffers.filter(offer => !offer.vip).map(offer => (
                      <StdCard key={offer.id} offer={offer} onReserve={handleReserve} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && sortedOffers.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ color: '#9ca3af', fontSize: '18px' }}>Nebyly nalezeny žádné nabídky odpovídající vašim kritériím.</p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}