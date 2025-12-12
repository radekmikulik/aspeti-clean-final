// ASPETi PLUS - Čistá verze bez chyb

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { DatabaseService, Offer } from '@/lib/supabase'

const VipCard: React.FC<{ offer: Offer; onReserve: (offer: Offer) => void }> = ({ offer, onReserve }) => {
  const handleCardClick = () => {
    window.location.href = `/offers/${offer.id}`
  }

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReserve(offer)
  }

  return (
    <div onClick={handleCardClick} style={{ 
      background: 'linear-gradient(to right, #fef3c7, #fde68a)', 
      border: '2px solid #f59e0b', 
      borderRadius: '12px', 
      padding: '16px', 
      marginBottom: '16px', 
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ aspectRatio: '16/9', background: 'linear-gradient(to right, #fde68a, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <span style={{ color: '#92400e', fontWeight: 'bold' }}>⭐ VIP nabídka</span>
      </div>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>{offer.title}</h3>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{offer.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{offer.location}</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#d97706' }}>{offer.price} Kč</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{offer.provider?.name || 'Neznámý poskytovatel'}</span>
          <button onClick={handleReserveClick} style={{ backgroundColor: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Rezervovat
          </button>
        </div>
      </div>
    </div>
  )
}

const StdCard: React.FC<{ offer: Offer; onReserve: (offer: Offer) => void }> = ({ offer, onReserve }) => {
  const handleCardClick = () => {
    window.location.href = `/offers/${offer.id}`
  }

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReserve(offer)
  }

  return (
    <div onClick={handleCardClick} style={{ 
      backgroundColor: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px', 
      padding: '16px', 
      marginBottom: '16px', 
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ aspectRatio: '16/9', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <span style={{ color: '#9ca3af' }}>Obrázek služby</span>
      </div>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>{offer.title}</h3>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{offer.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{offer.location}</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{offer.price} Kč</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>{offer.provider?.name || 'Neznámý poskytovatel'}</span>
          <button onClick={handleReserveClick} style={{ backgroundColor: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Rezervovat
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AppInner() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await DatabaseService.getOffers()
        setOffers(data)
      } catch (error) {
        console.error('Error loading offers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOffers()
  }, [])

  const handleReserve = (offer: Offer) => {
    window.location.href = `/offers/${offer.id}`
  }

  const filteredOffers = offers.filter(offer => {
    const matchesQuery = offer.title.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === "all" || offer.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      <header style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>ASPETi PLUS</h1>
          <button onClick={() => router.push('/account/profile/edit')} style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none' }}>
            Můj účet
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '20px' }}>Katalog nabídek</h2>

        {/* Vyhledávání */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hledat službu..."
              style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px' }}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px' }}
            >
              <option value="all">Všechny kategorie</option>
              <option value="beauty">Krása a wellness</option>
              <option value="sport">Sport a fitness</option>
              <option value="education">Vzdělávání</option>
              <option value="home">Domácí služby</option>
              <option value="food">Gastronomie</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <p>Načítání nabídek...</p>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '20px' }}>Nalezeno {filteredOffers.length} nabídek</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredOffers.map(offer => (
                offer.vip ? (
                  <VipCard key={offer.id} offer={offer} onReserve={handleReserve} />
                ) : (
                  <StdCard key={offer.id} offer={offer} onReserve={handleReserve} />
                )
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}