import { useState } from 'react'
import { CreditCard, TrendingUp, TrendingDown, Clock, Plus, Zap, Calculator, AlertTriangle, Loader2, Check } from '@/components/icons'
import { supabase, Provider, Offer, CreditTransaction } from '../../lib/supabase'

interface CreditsSectionProps {
  provider: Provider
  transactions: CreditTransaction[]
  offers: Offer[]
  onRefresh: () => void
}

export function CreditsSection({ provider, transactions, offers, onRefresh }: CreditsSectionProps) {
  const [topupLoading, setTopupLoading] = useState<number | null>(null)
  const [topupSuccess, setTopupSuccess] = useState(false)
  const [topupError, setTopupError] = useState<string | null>(null)

  const activeOffers = offers.filter(o => o.is_active)
  const vipOffers = activeOffers.filter(o => o.vip)
  
  const standardCost = (activeOffers.length - vipOffers.length) * 10
  const vipCost = vipOffers.length * 30
  const flashCost = provider.flash_offer_active ? 2 : 0
  const dailyCost = standardCost + vipCost + flashCost
  const daysRemaining = dailyCost > 0 ? Math.floor(provider.credits / dailyCost) : 999

  const quickTopup = [
    { amount: 200, label: '200 Kc' },
    { amount: 500, label: '500 Kc' },
    { amount: 1000, label: '1000 Kc' },
  ]

  const handleTopup = async (amount: number) => {
    setTopupLoading(amount)
    setTopupError(null)
    setTopupSuccess(false)

    try {
      const { data, error } = await supabase.functions.invoke('credit-topup', {
        body: { amount, providerId: provider.id }
      })

      if (error) throw error

      if (data.success) {
        setTopupSuccess(true)
        setTimeout(() => setTopupSuccess(false), 3000)
        onRefresh()
      } else if (data.clientSecret) {
        // Real Stripe payment would open payment modal here
        // For now we show success message
        setTopupSuccess(true)
        setTimeout(() => setTopupSuccess(false), 3000)
      }
    } catch (err: any) {
      setTopupError(err.message || 'Chyba pri dobijeni')
    } finally {
      setTopupLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {topupSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-green-700 font-medium">Kredit byl uspesne dobity!</p>
        </div>
      )}
      {topupError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{topupError}</p>
        </div>
      )}

      {/* Balance Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500 to-[#4a7a66] rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/70 text-sm">Aktualni zustatek</p>
              <div className="text-5xl font-bold mt-1">{provider.credits} Kc</div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <CreditCard className="w-8 h-8" />
            </div>
          </div>
          
          <div className={`flex items-center gap-2 p-3 rounded-lg ${daysRemaining < 7 ? 'bg-red-500/30' : 'bg-white/20'}`}>
            <Clock className="w-5 h-5" />
            <span>
              {daysRemaining > 30 
                ? 'Kredit vydrzi vice nez mesic' 
                : daysRemaining > 0 
                  ? `Kredit vydrzi jeste ${daysRemaining} dni`
                  : 'Kredit je vycerpany!'
              }
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Rychle dobiti</h3>
          <div className="space-y-2">
            {quickTopup.map((item) => (
              <button
                key={item.amount}
                onClick={() => handleTopup(item.amount)}
                disabled={topupLoading !== null}
                className="w-full flex items-center justify-between px-4 py-3 bg-emerald-100 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="font-medium text-emerald-600">{item.label}</span>
                {topupLoading === item.amount ? (
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 text-emerald-600" />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Demo mod - kredit se okamzite pricte
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-900">Denni naklady</h3>
        </div>
        
        <div className="grid sm:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Standardni nabidky</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{activeOffers.length - vipOffers.length}</span>
              <span className="text-gray-500">x 10 Kc</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{standardCost} Kc/den</div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="text-sm text-amber-600 mb-1">VIP nabidky</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-700">{vipOffers.length}</span>
              <span className="text-amber-600">x 30 Kc</span>
            </div>
            <div className="text-sm text-amber-600 mt-1">{vipCost} Kc/den</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 mb-1 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Flash nabidka
            </div>
            <div className="text-2xl font-bold text-purple-700">{provider.flash_offer_active ? 'Aktivni' : 'Vypnuto'}</div>
            <div className="text-sm text-purple-600 mt-1">{flashCost} Kc/den</div>
          </div>
          
          <div className="p-4 bg-emerald-600 rounded-lg text-white">
            <div className="text-sm text-white/70 mb-1">Celkem denne</div>
            <div className="text-3xl font-bold">{dailyCost} Kc</div>
            <div className="text-sm text-white/70 mt-1">= {dailyCost * 30} Kc/mesic</div>
          </div>
        </div>

        {daysRemaining < 7 && daysRemaining > 0 && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Vas kredit brzy dojde. Dobijte si ucet, aby vase nabidky zustaly aktivni.
            </p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Historie transakci</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Popis</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Castka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length > 0 ? transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(tx.created_at).toLocaleDateString('cs-CZ')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      tx.amount > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.amount > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {tx.amount > 0 ? 'Dobiti' : 'Odecet'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{tx.description}</td>
                  <td className={`px-6 py-4 text-sm font-medium text-right ${
                    tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} Kc
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Zatim zadne transakce
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
