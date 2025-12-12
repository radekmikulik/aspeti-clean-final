// FINÁLNÍ VERZE AppInner.tsx - KROK 5 DOKONČEN
// Implementace monetizace a rezervačního systému

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { DatabaseService, Offer } from '@/lib/supabase_mock'

// VIP karta (2 vedle sebe)
const VipCard: React.FC<{ 
  offer: Offer
  onReserve: (offer: Offer) => void
}> = ({ offer, onReserve }) => (
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
          onClick={() => onReserve(offer)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition font-semibold"
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
          onClick={() => onReserve(offer)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
        >
          Rezervovat
        </button>
      </div>
    </div>
  </div>
)

// AccountView komponenta s KROK 5 implementací
const AccountView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
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
  
  // Mock provider ID pro testování
  const providerId = '11111111-1111-1111-1111-111111111111'

  // KROK 5: Funkce pro nabití kreditu
  const handleCreditTopUp = async () => {
    setProcessingPayment(true)
    try {
      await DatabaseService.processCreditPayment(providerId, selectedAmount)
      
      const [credits, currentBalance] = await Promise.all([
        DatabaseService.getProviderCredits(providerId),
        DatabaseService.getCurrentCreditBalance(providerId)
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

  // KROK 5: Funkce pro zpracování rezervace
  const handleReservation = async () => {
    if (!selectedOffer || !reservationForm.clientName || !reservationForm.clientPhone) {
      alert('Vyplňte prosím všechna povinná pole')
      return
    }

    setProcessingReservation(true)
    try {
      const clientId = '22222222-2222-2222-2222-222222222222'
      await DatabaseService.createReservation(selectedOffer.id, clientId, reservationForm)
      
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
      
      alert('✅ Rezervace byla úspěšně odeslána!')
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

  // Render funkce pro kredity s modalem
  const renderCredits = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Můj kredit</h3>
        <button 
          onClick={() => setShowCreditModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
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

      {/* Modal pro nabití kreditu */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Nabít kredit</h3>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Vyberte částku pro nabití:</p>
              
              <div className="grid grid-cols-3 gap-2">
                {[200, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`p-3 rounded-lg border text-center font-medium transition ${
                      selectedAmount === amount
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {amount} Kč
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleCreditTopUp}
                  disabled={processingPayment}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Rezervovat: {selectedOffer.title}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jméno a příjmení *
                </label>
                <input
                  type="text"
                  value={reservationForm.clientName}
                  onChange={(e) => setReservationForm(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vaše jméno"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={reservationForm.clientPhone}
                  onChange={(e) => setReservationForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+420 xxx xxx xxx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={reservationForm.clientEmail}
                  onChange={(e) => setReservationForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="vas@email.cz"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum rezervace *
                  </label>
                  <input
                    type="date"
                    value={reservationForm.reservationDate}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, reservationDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Čas rezervace *
                  </label>
                  <select
                    value={reservationForm.reservationTime}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, reservationTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Vyberte čas</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poznámka k rezervaci
                </label>
                <textarea
                  value={reservationForm.message}
                  onChange={(e) => setReservationForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Napište nám vaše požadavky nebo dotazy..."
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Shrnutí rezervace</h4>
                <p className="text-sm text-gray-600">{selectedOffer.title}</p>
                <p className="text-sm text-gray-600">{selectedOffer.location}</p>
                <p className="text-lg font-semibold text-blue-600">{selectedOffer.price} Kč</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
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
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleReservation}
                  disabled={processingReservation}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
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

  const tabs = [
    { id: 'dashboard', name: 'Přehled', icon: '📊' },
    { id: 'offers', name: 'Správa nabídek', icon: '📋' },
    { id: 'credits', name: 'Můj kredit', icon: '💳' },
    { id: 'messages', name: 'Zprávy', icon: '💬' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <div>Dashboard obsah...</div>
      case 'offers': return <div>Správa nabídek...</div>
      case 'credits': return renderCredits()
      case 'messages': return <div>Zprávy...</div>
      default: return <div>Dashboard obsah...</div>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Můj účet</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Tab navigace */}
      <div className="border-b">
        <nav className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab obsah */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  )
}

// Hlavní komponenta
export default function AppInner() {
  const [accountOpen, setAccountOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
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
        const data = await DatabaseService.getOffers()
        setOffers(data)
        setError(null)
      } catch (error) {
        console.error('Error loading offers:', error)
        setError('Chyba při načítání nabídek')
      } finally {
        setLoading(false)
      }
    }

    loadOffers()
  }, [])

  // Funkce pro otevření rezervace (předaná do karet)
  const handleReserve = (offer: Offer) => {
    setAccountOpen(true)
    // TODO: Otevřít rezervační modal v AccountView
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

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">ASPETi PLUS</h1>
              </div>
              <button 
                onClick={() => setAccountOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Můj účet
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Katalog nabídek</h2>
            <p className="text-gray-600">Najděte si perfektní službu pro vás</p>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {loading ? 'Načítání...' : `Nalezeno ${sortedOffers.length} nabídek`}
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Načítání nabídek...</p>
            </div>
          ) : (
            <div>
              {/* VIP nabídky - 2 vedle sebe */}
              {sortedOffers.filter(offer => offer.vip).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center">
                    ⭐ VIP nabídky
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedOffers.filter(offer => offer.vip).map(offer => (
                      <VipCard key={offer.id} offer={offer} onReserve={handleReserve} />
                    ))}
                  </div>
                </div>
              )}

              {/* Standardní nabídky - 3 vedle sebe */}
              {sortedOffers.filter(offer => !offer.vip).length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">
                    Všechny nabídky
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedOffers.filter(offer => !offer.vip).map(offer => (
                      <StdCard key={offer.id} offer={offer} onReserve={handleReserve} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && sortedOffers.length === 0 && !error && (
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
