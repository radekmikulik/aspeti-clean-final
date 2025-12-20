import React, { useState, useEffect } from 'react'
import { 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus,
  DollarSign,
  Calendar,
  FileText,
  Zap,
  Shield,
  RefreshCw
} from '../components/icons'
import { useAuth } from '../context/AuthContext'

interface CreditTransaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
}

interface CreditBalance {
  current: number
  warning: boolean
  blocked: boolean
}

export function KreditniCentrum() {
  const { user } = useAuth()
  const [creditBalance, setCreditBalance] = useState<CreditBalance>({
    current: 45.50,
    warning: false,
    blocked: false
  })
  const [transactions, setTransactions] = useState<CreditTransaction[]>([
    {
      id: '1',
      date: '2025-12-14',
      description: 'Dobití kartou',
      amount: 500,
      type: 'credit'
    },
    {
      id: '2', 
      date: '2025-12-13',
      description: 'Denní odečet za 3 aktivní nabídky',
      amount: -15,
      type: 'debit'
    },
    {
      id: '3',
      date: '2025-12-12', 
      description: 'Dobití kartou',
      amount: 200,
      type: 'credit'
    },
    {
      id: '4',
      date: '2025-12-11',
      description: 'Denní odečet za 2 aktivní nabídky',
      amount: -10,
      type: 'debit'
    }
  ])
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simulace načítání zůstatku
    updateBalanceStatus()
  }, [creditBalance.current])

  const updateBalanceStatus = () => {
    const current = creditBalance.current
    setCreditBalance(prev => ({
      ...prev,
      warning: current < 20 && current > 0,
      blocked: current <= 0
    }))
  }

  const handleQuickCharge = (amount: number) => {
    setLoading(true)
    setTimeout(() => {
      setCreditBalance(prev => ({
        ...prev,
        current: prev.current + amount
      }))
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        description: `Dobití ${amount} Kč`,
        amount: amount,
        type: 'credit' as const
      })
      setLoading(false)
    }, 1500)
  }

  const handleCustomCharge = () => {
    const amount = parseInt(customAmount)
    if (amount && amount > 0) {
      setLoading(true)
      setTimeout(() => {
        setCreditBalance(prev => ({
          ...prev,
          current: prev.current + amount
        }))
        addTransaction({
          date: new Date().toISOString().split('T')[0],
          description: `Dobití ${amount} Kč`,
          amount: amount,
          type: 'credit' as const
        })
        setCustomAmount('')
        setLoading(false)
      }, 1500)
    }
  }

  const addTransaction = (transaction: Omit<CreditTransaction, 'id'>) => {
    const newTransaction: CreditTransaction = {
      ...transaction,
      id: Date.now().toString()
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} Kč`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('cs-CZ')
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6]">
      {/* Header */}
      <div className="bg-[#F5F7F6] border-b border-[#E0E8E3] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2F4B40] rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-blue-900">Kreditní Centrum</h1>
                <p className="text-sm text-gray-600">Správa vašeho kreditu a plateb</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-900 hover:bg-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Obnovit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Hlavní sekce - Zůstatek a dobití */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SEKCE ZŮSTATEK */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E0E8E3] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Aktuální zůstatek
                  </h2>
                  <div className="text-xs text-gray-500">
                    Poslední aktualizace: {new Date().toLocaleString('cs-CZ')}
                  </div>
                </div>

                {/* Zůstatek s varováními */}
                <div className={`relative p-8 rounded-xl mb-6 ${
                  creditBalance.blocked 
                    ? 'bg-red-50 border-2 border-red-200' 
                    : creditBalance.warning 
                    ? 'bg-orange-50 border-2 border-orange-200'
                    : 'bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-200'
                }`}>
                  
                  {/* Hlavní zůstatek */}
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${
                      creditBalance.blocked ? 'text-red-600' :
                      creditBalance.warning ? 'text-orange-600' : 'text-emerald-600'
                    }`}>
                      {formatCurrency(creditBalance.current)}
                    </div>
                    
                    {/* Varování */}
                    {creditBalance.warning && (
                      <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-orange-800">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">Upozornění:</span>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                          Kredit je nízký. Doporučujeme dobít, aby vaše nabídky zůstaly aktivní.
                        </p>
                      </div>
                    )}

                    {creditBalance.blocked && (
                      <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-red-800">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">Blokování:</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          Váš kredit vypršel. Nabídky byly automaticky přepnuty do stavu Neaktivní.
                        </p>
                      </div>
                    )}

                    {/* Statistika */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Aktivní nabídky</div>
                        <div className="text-lg font-semibold text-gray-900">3</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Denní poplatek</div>
                        <div className="text-lg font-semibold text-gray-900">15 Kč</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEKCE DOBITÍ KREDITU */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E0E8E3] overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Dobití kreditu
                </h2>

                {/* Přednastavené částky */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rychlé dobití
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[200, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleQuickCharge(amount)}
                        disabled={loading}
                        className="p-4 border-2 border-[#E0E8E3] rounded-lg hover:border-[#2F4B40] hover:bg-[#F5F7F6] transition-colors disabled:opacity-50"
                      >
                        <div className="text-lg font-semibold text-blue-900">{amount} Kč</div>
                        <div className="text-xs text-gray-500">Výhodné</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vlastní částka */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Vlastní částka
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Zadejte částku"
                      min="1"
                      max="10000"
                      className="flex-1 px-4 py-3 border border-[#E0E8E3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4B40] focus:border-transparent"
                    />
                    <button
                      onClick={handleCustomCharge}
                      disabled={loading || !customAmount || parseInt(customAmount) <= 0}
                      className="px-6 py-3 bg-[#2F4B40] text-white rounded-lg hover:bg-[#2F4B40]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Zpracovává se...' : 'Dobít'}
                    </button>
                  </div>
                </div>

                {/* Platební brána placeholder */}
                <div className="border-t border-[#E0E8E3] pt-6">
                  <div className="bg-[#F5F7F6] rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-5 h-5 text-[#2F4B40]" />
                      <span className="font-medium text-blue-900">Platební metody</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-[#E0E8E3]">
                        <div className="font-medium text-sm">Platební karta</div>
                        <div className="text-xs text-gray-500">Visa, Mastercard</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-[#E0E8E3]">
                        <div className="font-medium text-sm">Bankovní převod</div>
                        <div className="text-xs text-gray-500">Okamžité připsání</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    disabled={loading}
                    className="w-full py-4 bg-[#2F4B40] text-white rounded-lg hover:bg-[#2F4B40]/90 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Zpracovává se platba...
                      </div>
                    ) : (
                      'Zaplatit / Dobít kredit'
                    )}
                  </button>
                  
                  <div className="text-center mt-3 text-xs text-gray-500">
                    Bezpečné platby zpracovává Stripe
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEKCE POHYBY KREDITU (Historie) */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-[#E0E8E3] overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Historie transakcí
                </h2>

                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        transaction.type === 'credit' 
                          ? 'bg-emerald-50 border-emerald-200' 
                          : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' 
                            ? 'bg-emerald-100' 
                            : 'bg-orange-100'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <TrendingUp className={`w-4 h-4 ${
                              transaction.type === 'credit' ? 'text-emerald-600' : 'text-orange-600'
                            }`} />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-right ${
                        transaction.type === 'credit' ? 'text-emerald-600' : 'text-orange-600'
                      }`}>
                        <div className="font-semibold">
                          {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs opacity-75">
                          {transaction.type === 'credit' ? 'Příjem' : 'Výdaj'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {transactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>Zatím žádné transakce</p>
                  </div>
                )}

                {transactions.length > 5 && (
                  <div className="mt-4 text-center">
                    <button className="text-sm text-blue-900 hover:underline">
                      Zobrazit všechny transakce
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info karta */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Jak funguje kredit?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 5 Kč za každou aktivní nabídku denně</li>
                    <li>• Automatické odečítání ve 23:59</li>
                    <li>• Nabídky se deaktivují při nulovém zůstatku</li>
                    <li>• Okamžité připsání po dobití</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}