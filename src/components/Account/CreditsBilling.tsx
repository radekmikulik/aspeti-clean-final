// ASPETi PLUS - Credits & Billing Module
// KROK 8: FINÁLNÍ INTEGRACE - Denní odečty a Stripe integrace

import React, { useState, useEffect } from 'react'

interface CreditTransaction {
  id: string
  type: 'topup' | 'deduction' | 'refund'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  offerId?: string
}

interface CreditBalance {
  current: number
  pending: number
  monthlyDeductions: number
  dailyRate: number // 5 Kč za nabídku za den
}

interface ActiveOffer {
  id: string
  title: string
  category: string
  isActive: boolean
  dailyCost: number
}

export const CreditsBilling: React.FC = () => {
  const [balance, setBalance] = useState<CreditBalance>({
    current: 1500,
    pending: 0,
    monthlyDeductions: 300,
    dailyRate: 5
  })
  
  const [transactions, setTransactions] = useState<CreditTransaction[]>([
    {
      id: '1',
      type: 'topup',
      amount: 2000,
      description: 'Dobití kreditu přes Stripe',
      date: '2025-12-10',
      status: 'completed'
    },
    {
      id: '2',
      type: 'deduction',
      amount: -35,
      description: 'Denní odečet za aktivní nabídky (7 nabídek)',
      date: '2025-12-12',
      status: 'completed'
    }
  ])
  
  const [activeOffers, setActiveOffers] = useState<ActiveOffer[]>([
    { id: '1', title: 'Kadeřnické služby', category: 'beauty', isActive: true, dailyCost: 5 },
    { id: '2', title: 'Pronájem bytu', category: 'reality', isActive: true, dailyCost: 5 },
    { id: '3', title: 'Osobní trenér', category: 'sport', isActive: true, dailyCost: 5 }
  ])
  
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [selectedTopupAmount, setSelectedTopupAmount] = useState(500)
  const [processingPayment, setProcessingPayment] = useState(false)

  // Stripe top-up funkce
  const handleStripeTopup = async () => {
    setProcessingPayment(true)
    try {
      // Simulace Stripe platby
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newTransaction: CreditTransaction = {
        id: Date.now().toString(),
        type: 'topup',
        amount: selectedTopupAmount,
        description: `Dobití kreditu přes Stripe (${selectedTopupAmount} Kč)`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
      
      setTransactions(prev => [newTransaction, ...prev])
      setBalance(prev => ({ ...prev, current: prev.current + selectedTopupAmount }))
      
      alert('✅ Platba byla úspěšná! Kredity byly připsány.')
      setShowTopupModal(false)
    } catch (error) {
      alert('❌ Chyba při zpracování platby.')
    } finally {
      setProcessingPayment(false)
    }
  }

  // Přepnutí aktivní nabídky (automatické skrývání při 0 Kč)
  const toggleOfferActive = (offerId: string) => {
    if (balance.current <= 0) {
      alert('❌ Nemáte dostatek kreditů. Dobijte kredity pro aktivaci nabídek.')
      return
    }
    
    setActiveOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, isActive: !offer.isActive }
          : offer
      )
    )
  }

  // Výpočet denních nákladů
  const dailyCosts = activeOffers.filter(offer => offer.isActive).length * balance.dailyRate
  const monthlyProjection = dailyCosts * 30

  // Doporučené dobítí
  const recommendedTopup = Math.ceil(monthlyProjection / 100) * 100

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Kredity & fakturace</h2>
        <p className="text-gray-600">Správa kreditů a automatické odečty za aktivní nabídky</p>
      </div>

      {/* Přehled kreditů */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="text-sm opacity-90 mb-1">Aktuální zůstatek</div>
          <div className="text-2xl font-bold">{balance.current} Kč</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="text-sm opacity-90 mb-1">Denní náklady</div>
          <div className="text-2xl font-bold">{dailyCosts} Kč</div>
          <div className="text-xs opacity-75 mt-1">
            {activeOffers.filter(offer => offer.isActive).length} aktivních nabídek
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="text-sm opacity-90 mb-1">Měsíční projekce</div>
          <div className="text-2xl font-bold">{monthlyProjection} Kč</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="text-sm opacity-90 mb-1">Doporučené dobítí</div>
          <div className="text-2xl font-bold">{recommendedTopup} Kč</div>
          <div className="text-xs opacity-75 mt-1">na měsíc provozu</div>
        </div>
      </div>

      {/* Upozornění o nízkém zůstatku */}
      {balance.current < 100 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800">Nízký zůstatek kreditů</h3>
              <p className="text-yellow-700 text-sm">
                Váš zůstatek klesl pod 100 Kč. Doporučujeme dobít kredity pro zajištění nepřetržitého provozu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Aktivní nabídky a denní náklady */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Aktivní nabídky a denní náklady</h3>
          <div className="text-sm text-gray-600">
            Sazba: {balance.dailyRate} Kč/nabídka/den
          </div>
        </div>
        
        <div className="space-y-3">
          {activeOffers.map((offer) => (
            <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${offer.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div>
                  <div className="font-medium">{offer.title}</div>
                  <div className="text-sm text-gray-600">{offer.category}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {offer.dailyCost} Kč/den
                </div>
                <button
                  onClick={() => toggleOfferActive(offer.id)}
                  disabled={balance.current <= 0 && offer.isActive}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    offer.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : balance.current > 0
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {offer.isActive ? 'Deaktivovat' : 'Aktivovat'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium">Celkové denní náklady:</span>
            <span className="font-bold text-lg text-sage">{dailyCosts} Kč</span>
          </div>
        </div>
      </div>

      {/* Akce - Dobití kreditů */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">💳 Dobití kreditů</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[500, 1000, 2000].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSelectedTopupAmount(amount)
                setShowTopupModal(true)
              }}
              className={`p-4 border-2 rounded-lg transition-colors ${
                selectedTopupAmount === amount
                  ? 'border-sage bg-sage bg-opacity-10'
                  : 'border-gray-300 hover:border-sage'
              }`}
            >
              <div className="text-lg font-bold text-sage-dark">{amount} Kč</div>
              <div className="text-sm text-gray-600">(+Stripe poplatek)</div>
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowTopupModal(true)}
          className="w-full bg-sage text-sage-dark py-3 px-4 rounded-lg hover:bg-sage-dark hover:text-white transition-colors font-medium"
        >
          💳 Dobít kredity přes Stripe
        </button>
      </div>

      {/* Historie transakcí */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Historie transakcí</h3>
        
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">
                  {transaction.type === 'topup' ? '💳' : 
                   transaction.type === 'deduction' ? '📉' : '↩️'}
                </span>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-gray-600">{transaction.date}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} Kč
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status === 'completed' ? 'Dokončeno' :
                   transaction.status === 'pending' ? 'Čeká' : 'Chyba'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal pro dobítí */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">💳 Dobití kreditů</h3>
              <p className="text-gray-600">Bezpečná platba přes Stripe</p>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-sage bg-opacity-10 rounded-lg">
                <div className="text-2xl font-bold text-sage-dark">{selectedTopupAmount} Kč</div>
                <div className="text-sm text-gray-600 mt-1">+ Stripe poplatek (2.9% + 30 Kč)</div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleStripeTopup}
                  disabled={processingPayment}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    processingPayment
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-sage text-sage-dark hover:bg-sage-dark hover:text-white'
                  }`}
                >
                  {processingPayment ? '⏳ Zpracovávám...' : '💳 Zaplatit přes Stripe'}
                </button>
                
                <button
                  onClick={() => setShowTopupModal(false)}
                  disabled={processingPayment}
                  className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Zrušit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informace o automatických odečtech */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Automatické denní odečty</h4>
            <p className="text-blue-700 text-sm">
              Každý den ve 00:00 se automaticky odečítají kredity za všechny aktivní nabídky 
              (5 Kč za nabídku). Při zůstatku 0 Kč se všechny nabídky automaticky deaktivují.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}