// Detail nabídky - /offers/[id].tsx

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { DatabaseService, Offer } from '@/lib/supabase'
import { CalendarAndMessagesService } from '@/lib/calendar-messages-service'

export default function OfferDetail() {
  const router = useRouter()
  const { id } = router.query
  const [offer, setOffer] = useState<Offer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  // Rezervační stav
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [reservationForm, setReservationForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    reservationDate: '',
    reservationTime: '',
    message: ''
  })
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [processingReservation, setProcessingReservation] = useState(false)

  useEffect(() => {
    const loadOffer = async () => {
      if (!id || typeof id !== 'string') return

      try {
        setLoading(true)
        console.log(`🚀 Loading offer detail for ID: ${id}`)
        
        const offers = await DatabaseService.getOffers()
        const foundOffer = offers.find(o => o.id === id)
        
        if (foundOffer) {
          setOffer(foundOffer)
          setError(null)
          console.log(`✅ Found offer: ${foundOffer.title}`)
        } else {
          setError('Nabídka nebyla nalezena')
          console.log(`❌ Offer not found for ID: ${id}`)
        }
      } catch (err) {
        console.error('❌ Error loading offer detail:', err)
        setError('Chyba při načítání nabídky')
      } finally {
        setLoading(false)
      }
    }

    loadOffer()
  }, [id])

  // Funkce pro načtení dostupných časů
  const loadAvailableTimes = async (providerId: string, date: string) => {
    try {
      setLoadingTimes(true)
      const times = await CalendarAndMessagesService.getAvailableTimes(providerId, date)
      setAvailableTimes(times)
    } catch (error) {
      console.error('❌ Error loading available times:', error)
      setAvailableTimes([])
    } finally {
      setLoadingTimes(false)
    }
  }

  // Funkce pro zpracování rezervace
  const handleReservation = async () => {
    if (!offer || !reservationForm.clientName || !reservationForm.clientPhone || !reservationForm.reservationDate || !reservationForm.reservationTime) {
      alert('Vyplňte prosím všechna povinná pole')
      return
    }

    // Kontrola dostupnosti před rezervací
    if (reservationForm.reservationDate && reservationForm.reservationTime) {
      const isAvailable = await CalendarAndMessagesService.checkAvailability(
        offer.provider_id,
        reservationForm.reservationDate,
        reservationForm.reservationTime
      )
      
      if (!isAvailable) {
        alert('Vybraný termín není dostupný. Prosím vyberte jiný čas.')
        return
      }
    }

    setProcessingReservation(true)
    try {
      // Mock client ID pro rezervaci
      const clientId = '22222222-2222-2222-2222-222222222222'
      const reservation = await DatabaseService.createReservation(offer.id, clientId, reservationForm)
      
      // Vytvoř konverzaci pro tuto rezervaci
      if (reservation && reservation[0]) {
        try {
          await CalendarAndMessagesService.ensureConversationForReservation(
            reservation[0].id,
            clientId,
            offer.provider_id
          )
        } catch (error) {
          console.error('❌ Error creating conversation:', error)
          // Pokračuj i když se nepodaří vytvořit konverzaci
        }
      }
      
      setShowReservationForm(false)
      setReservationForm({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        reservationDate: '',
        reservationTime: '',
        message: ''
      })
      
      alert('✅ Rezervace byla úspěšně vytvořena!')
    } catch (error) {
      console.error('❌ Reservation failed:', error)
      alert('Chyba při vytváření rezervace. Zkuste to později.')
    } finally {
      setProcessingReservation(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Načítání detailu nabídky...</p>
        </div>
      </div>
    )
  }

  if (error || !offer) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            Nabídka nenalezena
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {error || 'Požadovaná nabídka nebyla nalezena'}
          </p>
          <Link 
            href="/"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Zpět do katalogu
          </Link>
        </div>
      </div>
    )
  }

  // Mock obrázky pro ukázku (v produkci by se načítaly z databáze)
  const images = [
    '/file.svg', // placeholder obrázek
    '/next.svg',
    '/globe.svg'
  ]

  return (
    <>
      <Head>
        <title>{offer.title} - ASPETi PLUS</title>
        <meta name="description" content={offer.description} />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
            <Link 
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              <span>←</span> Zpět do katalogu
            </Link>
          </div>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '600px' }}>
              {/* Galerie obrázků */}
              <div style={{ padding: '24px' }}>
                <div style={{ 
                  aspectRatio: '4/3', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '8px',
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={images[selectedImageIndex]}
                    alt={offer.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                {/* Náhledy obrázků */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        width: '80px',
                        height: '60px',
                        border: '2px solid',
                        borderColor: selectedImageIndex === index ? '#2563eb' : '#e5e7eb',
                        borderRadius: '4px',
                        background: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      <img 
                        src={image}
                        alt={`${offer.title} ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail nabídky */}
              <div style={{ padding: '24px', borderLeft: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                      {offer.title}
                    </h1>
                    {offer.vip && (
                      <span style={{ 
                        backgroundColor: '#f59e0b', 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '9999px', 
                        fontSize: '12px', 
                        fontWeight: 'bold' 
                      }}>
                        VIP
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#fbbf24', marginRight: '4px' }}>★</span>
                      <span style={{ fontSize: '16px', color: '#6b7280' }}>
                        {offer.provider?.rating || 0}
                      </span>
                    </div>
                    <span style={{ fontSize: '16px', color: '#6b7280' }}>
                      📍 {offer.location}
                    </span>
                  </div>

                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold', 
                    color: offer.vip ? '#d97706' : '#2563eb',
                    marginBottom: '24px'
                  }}>
                    {offer.price} Kč
                  </div>

                  <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', marginBottom: '24px' }}>
                    {offer.description}
                  </p>
                </div>

                {/* Informace o poskytovateli */}
                <div style={{ 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '8px', 
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                    👤 Poskytovatel služby
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#6b7280'
                    }}>
                      {(offer.provider?.name || 'P')[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: '500', color: '#111827', margin: '0 0 4px 0' }}>
                        {offer.provider?.name || 'Neznámý poskytovatel'}
                      </p>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        ⭐ {offer.provider?.rating || 0} hodnocení
                      </p>
                    </div>
                  </div>
                </div>

                {/* Možnosti platby */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    💳 Možnosti platby
                  </h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '8px',
                      border: '1px solid #bae6fd'
                    }}>
                      <span style={{ color: '#0284c7' }}>💳</span>
                      <span style={{ fontSize: '14px', color: '#0c4a6e' }}>Platební kartou online</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <span style={{ color: '#16a34a' }}>💰</span>
                      <span style={{ fontSize: '14px', color: '#14532d' }}>Hotově na místě</span>
                    </div>
                  </div>
                </div>

                {/* Rezervační formulář */}
                {!showReservationForm ? (
                  <button
                    onClick={() => setShowReservationForm(true)}
                    style={{
                      width: '100%',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#15803d'}
                    onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#16a34a'}
                  >
                    Rezervovat tuto službu
                  </button>
                ) : (
                  <div style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                        📝 Rezervace: {offer.title}
                      </h3>
                      <button
                        onClick={() => setShowReservationForm(false)}
                        style={{
                          color: '#6b7280',
                          background: 'none',
                          border: 'none',
                          fontSize: '20px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                          Jméno a příjmení *
                        </label>
                        <input
                          type="text"
                          value={reservationForm.clientName}
                          onChange={(e) => setReservationForm(prev => ({ ...prev, clientName: e.target.value }))}
                          style={{
                            width: '100%',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            outline: 'none'
                          }}
                          placeholder="Vaše jméno"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          value={reservationForm.clientPhone}
                          onChange={(e) => setReservationForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                          style={{
                            width: '100%',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            outline: 'none'
                          }}
                          placeholder="+420 xxx xxx xxx"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={reservationForm.clientEmail}
                          onChange={(e) => setReservationForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                          style={{
                            width: '100%',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            outline: 'none'
                          }}
                          placeholder="vas@email.cz"
                        />
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                            Datum rezervace *
                          </label>
                          <input
                            type="date"
                            value={reservationForm.reservationDate}
                            onChange={async (e) => {
                              setReservationForm(prev => ({ ...prev, reservationDate: e.target.value, reservationTime: '' }))
                              if (e.target.value && offer) {
                                await loadAvailableTimes(offer.provider_id, e.target.value)
                              }
                            }}
                            style={{
                              width: '100%',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              outline: 'none'
                            }}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                            Čas rezervace *
                          </label>
                          <select
                            value={reservationForm.reservationTime}
                            onChange={(e) => setReservationForm(prev => ({ ...prev, reservationTime: e.target.value }))}
                            style={{
                              width: '100%',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              outline: 'none'
                            }}
                            disabled={loadingTimes || !reservationForm.reservationDate}
                          >
                            <option value="">
                              {!reservationForm.reservationDate 
                                ? 'Nejprve vyberte datum' 
                                : loadingTimes 
                                  ? 'Načítám dostupné časy...' 
                                  : availableTimes.length === 0 
                                    ? 'Žádné dostupné časy' 
                                    : 'Vyberte čas'
                              }
                            </option>
                            {availableTimes.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                          Poznámka k rezervaci
                        </label>
                        <textarea
                          value={reservationForm.message}
                          onChange={(e) => setReservationForm(prev => ({ ...prev, message: e.target.value }))}
                          style={{
                            width: '100%',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            outline: 'none',
                            height: '80px'
                          }}
                          placeholder="Napište nám vaše požadavky nebo dotazy..."
                        />
                      </div>
                      
                      <div style={{
                        backgroundColor: '#f0f9ff',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #bae6fd'
                      }}>
                        <h4 style={{ fontWeight: '600', color: '#0c4a6e', marginBottom: '8px' }}>📋 Shrnutí rezervace</h4>
                        <p style={{ fontSize: '14px', color: '#0c4a6e', margin: '4px 0' }}><strong>Služba:</strong> {offer.title}</p>
                        <p style={{ fontSize: '14px', color: '#0c4a6e', margin: '4px 0' }}><strong>Lokace:</strong> {offer.location}</p>
                        <p style={{ fontSize: '18px', fontWeight: '600', color: '#0c4a6e', margin: '8px 0 4px 0' }}><strong>Celkem:</strong> {offer.price} Kč</p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => setShowReservationForm(false)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            color: '#6b7280',
                            background: 'none',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Zrušit
                        </button>
                        <button
                          onClick={handleReservation}
                          disabled={processingReservation}
                          style={{
                            flex: 2,
                            backgroundColor: '#16a34a',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: processingReservation ? 'not-allowed' : 'pointer',
                            opacity: processingReservation ? 0.5 : 1,
                            fontWeight: '600'
                          }}
                        >
                          {processingReservation ? 'Odesílám...' : 'Potvrdit rezervaci'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dodatečné informace */}
                <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fefce8', borderRadius: '8px', border: '1px solid #fde047' }}>
                  <p style={{ fontSize: '14px', color: '#713f12', margin: 0 }}>
                    ℹ️ Po odeslání rezervace vás budeme kontaktovat do 24 hodin pro potvrzení termínu a dalších detailů.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}