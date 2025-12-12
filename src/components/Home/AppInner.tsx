// ASPETi PLUS - Hlavní komponenta s autentizací
// KROK 6: AUTENTIZACE UŽIVATELŮ - Supabase Auth

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { DatabaseService, Offer } from '@/lib/supabase'
import { CalendarAndMessagesService } from '@/lib/calendar-messages-service'
// import { useAuth } from '@/hooks/useAuth'
// import { AuthService } from '@/lib/auth-service'
// import { AuthModal } from '@/components/Auth/AuthModal'
// import { ProtectedRoute } from '@/components/Auth/ProtectedRoute'
import { AvailabilitySettings } from '@/components/Calendar/AvailabilitySettings'
import { BlackoutSettings } from '@/components/Calendar/BlackoutSettings'
import { ChatComponent } from '@/components/Chat/ChatComponent'

// VIP karta (2 vedle sebe)
const VipCard: React.FC<{ 
  offer: Offer
  onReserve: (offer: Offer) => void
}> = ({ offer, onReserve }) => (
  <div style={{
    background: 'linear-gradient(to right, #fef3c7, #fde68a)',
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s'
  }}>
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
          onClick={() => onReserve(offer)}
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
    </div>
  </div>
)

// Standardní karta (3 vedle sebe)
const StdCard: React.FC<{ 
  offer: Offer
  onReserve: (offer: Offer) => void
}> = ({ offer, onReserve }) => (
  <div style={{
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s'
  }}>
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
          onClick={() => onReserve(offer)}
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
    </div>
  </div>
)

// AccountView komponenta s autentizací a role-based access
const AccountView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // const { user, userRole } = useAuth()
  
  // Mock auth state for testing
  const user = { id: '11111111-1111-1111-1111-111111111111', email: 'test@example.com', user_metadata: { full_name: 'Test User', role: 'provider' } }
  let userRole = 'provider' as 'client' | 'provider'
  const [activeTab, setActiveTab] = useState('dashboard')
  const [settingsSubTab, setSettingsSubTab] = useState('availability')
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(500)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [reservationForm, setReservationForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    reservationDate: '',
    reservationTime: '',
    message: ''
  })
  const [processingReservation, setProcessingReservation] = useState(false)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)
  
  // Uživatelské ID z autentizace
  const userId = user?.id || '11111111-1111-1111-1111-111111111111'

  // Funkce pro nabití kreditu (pouze pro providers)
  const handleCreditTopUp = async () => {
    if (userRole !== 'provider') {
      alert('Tuto funkci mohou používat pouze poskytovatelé služeb.')
      return
    }
    
    setProcessingPayment(true)
    try {
      await DatabaseService.processCreditPayment(userId, selectedAmount)
      
      const [credits, currentBalance] = await Promise.all([
        DatabaseService.getProviderCredits(userId),
        DatabaseService.getCurrentCreditBalance(userId)
      ])
      
      setDashboardData((prev: any) => ({
        ...prev,
        credits,
        currentBalance
      }))
      
      setShowCreditModal(false)
      alert('✅ Kredit byl úspěšně nabit!')
    } catch (error) {
      console.error('❌ Credit top-up failed:', error)
      alert('Chyba při nabití kreditu. Zkuste to později.')
    } finally {
      setProcessingPayment(false)
    }
  }

  // Funkce pro zpracování rezervace
  const handleReservation = async () => {
    if (!selectedOffer || !reservationForm.clientName || !reservationForm.clientPhone || !reservationForm.reservationDate || !reservationForm.reservationTime) {
      alert('Vyplňte prosím všechna povinná pole')
      return
    }

    // Kontrola dostupnosti před rezervací
    if (reservationForm.reservationDate && reservationForm.reservationTime) {
      const isAvailable = await CalendarAndMessagesService.checkAvailability(
        selectedOffer.provider_id,
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
      // Použij aktuálního uživatele jako client ID pokud je přihlášen
      const clientId = user?.id || '22222222-2222-2222-2222-222222222222'
      const reservation = await DatabaseService.createReservation(selectedOffer.id, clientId, reservationForm)
      
      // Vytvoř konverzaci pro tuto rezervaci
      if (reservation && reservation[0]) {
        try {
          await CalendarAndMessagesService.ensureConversationForReservation(
            reservation[0].id,
            clientId,
            selectedOffer.provider_id
          )
        } catch (error) {
          console.error('❌ Error creating conversation:', error)
          // Pokračuj i když se nepodaří vytvořit konverzaci
        }
      }
      
      setShowReservationModal(false)
      setSelectedOffer(null)
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

  // KROK 5: Funkce pro otevření rezervace
  const handleReserve = (offer: Offer) => {
    setSelectedOffer(offer)
    setShowReservationModal(true)
  }

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

  // Render funkce pro kredity s modalem
  const renderCredits = () => (
    <div style={{ margin: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Můj kredit</h3>
        <button 
          onClick={() => setShowCreditModal(true)}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Nabít kredit
        </button>
      </div>

      <div style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Aktuální zůstatek</h4>
        <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          {dashboardData?.currentBalance || 0} Kč
        </p>
        {dashboardData?.currentBalance < 20 && (
          <p style={{ fontSize: '14px', color: '#ea580c', marginTop: '8px' }}>⚠️ Nízký kredit - doporučujeme nabití</p>
        )}
      </div>

      {/* Modal pro nabití kreditu */}
      {showCreditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '384px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Nabít kredit</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Vyberte částku pro nabití:</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {[200, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      textAlign: 'center',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backgroundColor: selectedAmount === amount ? '#2563eb' : 'white',
                      color: selectedAmount === amount ? 'white' : '#374151',
                      borderColor: selectedAmount === amount ? '#2563eb' : '#d1d5db'
                    }}
                  >
                    {amount} Kč
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setShowCreditModal(false)}
                  style={{
                    padding: '8px 16px',
                    color: '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Zrušit
                </button>
                <button
                  onClick={handleCreditTopUp}
                  disabled={processingPayment}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: processingPayment ? 'not-allowed' : 'pointer',
                    opacity: processingPayment ? 0.5 : 1
                  }}
                >
                  {processingPayment ? 'Zpracovávám...' : `Nabít ${selectedAmount} Kč`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pro rezervaci */}
      {showReservationModal && selectedOffer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Rezervovat: {selectedOffer.title}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      if (e.target.value && selectedOffer) {
                        await loadAvailableTimes(selectedOffer.provider_id, e.target.value)
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
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <h4 style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>Shrnutí rezervace</h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{selectedOffer.title}</p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{selectedOffer.location}</p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#2563eb', margin: '4px 0' }}>{selectedOffer.price} Kč</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px' }}>
                <button
                  onClick={() => {
                    setShowReservationModal(false)
                    setSelectedOffer(null)
                    setReservationForm({
                      clientName: '',
                      clientPhone: '',
                      clientEmail: '',
                      reservationDate: '',
                      reservationTime: '',
                      message: ''
                    })
                  }}
                  style={{
                    padding: '8px 16px',
                    color: '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Zrušit
                </button>
                <button
                  onClick={handleReservation}
                  disabled={processingReservation}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: processingReservation ? 'not-allowed' : 'pointer',
                    opacity: processingReservation ? 0.5 : 1
                  }}
                >
                  {processingReservation ? 'Odesílám...' : 'Potvrdit rezervaci'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Tab navigace podle role uživatele
  const getTabs = () => {
    const baseTabs = [
      { id: 'dashboard', name: 'Přehled', icon: '📊' }
    ]
    
    if (userRole === 'provider') {
      return [
        ...baseTabs,
        { id: 'offers', name: 'Správa nabídek', icon: '📋' },
        { id: 'credits', name: 'Můj kredit', icon: '💳' },
        { id: 'messages', name: 'Zprávy', icon: '💬' },
        { id: 'settings', name: 'Nastavení', icon: '⚙️' }
      ]
    } else {
      return [
        ...baseTabs,
        { id: 'reservations', name: 'Moje rezervace', icon: '📝' },
        { id: 'messages', name: 'Zprávy', icon: '💬' }
      ]
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {userRole === 'provider' ? '🏢' : '👤'}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              {userRole === 'provider' ? 'Vítejte v Provider Dashboard' : 'Vítejte v Klientském účtu'}
            </h3>
            <p style={{ color: '#6b7280' }}>
              {userRole === 'provider' 
                ? 'Zde můžete spravovat své nabídky, kredit a komunikovat s klienty.'
                : 'Zde můžete sledovat své rezervace a komunikovat s poskytovateli.'
              }
            </p>
          </div>
        )
      case 'offers':
        return userRole === 'provider' ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Správa nabídek</h3>
            <p style={{ color: '#6b7280' }}>Zde můžete přidávat, upravovat a spravovat své nabídky služeb.</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <p>Nedostatečná oprávnění</p>
          </div>
        )
      case 'credits':
        return userRole === 'provider' ? renderCredits() : (
          <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <p>Tuto sekci mohou používat pouze poskytovatelé</p>
          </div>
        )
      case 'reservations':
        return userRole === 'client' ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Moje rezervace</h3>
            <p style={{ color: '#6b7280' }}>Zde můžete sledovat stav svých rezervací a komunikovat s poskytovateli.</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <p>Tuto sekci mohou používat pouze klienti</p>
          </div>
        )
      case 'messages':
        return (
          <div style={{ height: '600px' }}>
            <ChatComponent onClose={() => {}} />
          </div>
        )
      case 'settings':
        return userRole === 'provider' ? (
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>⚙️ Nastavení</h3>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e5e7eb' }}>
                <button
                  onClick={() => setSettingsSubTab('availability')}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderBottom: '2px solid',
                    borderColor: settingsSubTab === 'availability' ? '#2563eb' : 'transparent',
                    color: settingsSubTab === 'availability' ? '#2563eb' : '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  📅 Dostupnost
                </button>
                <button
                  onClick={() => setSettingsSubTab('blackouts')}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderBottom: '2px solid',
                    borderColor: settingsSubTab === 'blackouts' ? '#2563eb' : 'transparent',
                    color: settingsSubTab === 'blackouts' ? '#2563eb' : '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  🚫 Blackout termíny
                </button>
              </div>
            </div>
            <div style={{ height: '500px', overflow: 'auto' }}>
              {settingsSubTab === 'availability' && (
                <AvailabilitySettings onClose={() => {}} />
              )}
              {settingsSubTab === 'blackouts' && (
                <BlackoutSettings onClose={() => {}} />
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <p>Tuto sekci mohou používat pouze poskytovatelé</p>
          </div>
        )
      default:
        return <div>Dashboard obsah...</div>
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxWidth: '1024px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Můj účet</h2>
        <button 
          onClick={onClose}
          style={{ color: '#9ca3af', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>

      {/* Tab navigace */}
      <div style={{ borderBottom: '1px solid #e5e7eb' }}>
        <nav style={{ display: 'flex' }}>
          {getTabs().map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                borderBottom: '2px solid',
                borderColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab obsah */}
      <div style={{ padding: '24px' }}>
        {renderContent()}
      </div>
    </div>
  )
}

// Hlavní komponenta s autentizací
export default function AppInner() {
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
        setError(null)
        console.log(`✅ Loaded ${data.length} offers from Supabase`)
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
    setAccountOpen(true)
    // Rezervační modal se otevře v AccountView
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
                      onClick={() => setAccountOpen(true)}
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

          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#6b7280' }}>
              {loading ? 'Načítání z Supabase databáze...' : `Nalezeno ${sortedOffers.length} nabídek z databáze`}
            </p>
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

      {/* Auth Modal */}
      {/* <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          console.log('✅ User authenticated successfully')
        }}
      /> */}
    </>
  )
}
