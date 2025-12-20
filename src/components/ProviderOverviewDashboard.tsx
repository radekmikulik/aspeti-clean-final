import { useState, useEffect } from 'react'
import { 
  User, Phone, AlertTriangle, CreditCard, Package, MessageSquare, 
  Clock, MapPin, Calendar, Plus, Eye, Edit, TrendingUp, Users,
  X, Bell, Zap, Shield, CheckCircle, XCircle, Info
} from '../components/icons'
import { Provider } from '../lib/supabase'

// Sage color palette
const SAGE = {
  light: '#E8F0E6',
  strong: '#DDEBE3', 
  navy: '#0F2A43'
}

interface DashboardData {
  // KPI data
  activeOffers: number
  newRequests: number
  todayReservations: number
  creditBalance: number
  
  // Alert data
  lowCredit: boolean
  zeroCredit: boolean
  incompleteProfile: boolean
  pendingReservations: number
  
  // Lists data
  upcomingEvents: Array<{
    id: string
    type: 'reservation' | 'request'
    title: string
    client?: string
    date: string
    time?: string
    location?: string
    status?: string
    matchPercentage?: number
  }>
  
  requestsToReact: Array<{
    id: string
    title: string
    description: string
    location: string
    date: string
    matchPercentage: number
    urgent: boolean
  }>
  
  // Offers status
  offersStatus: {
    active: number
    inactive: number
    archived: number
  }
}

interface ProviderOverviewDashboardProps {
  provider: Provider
  onClose: () => void
  onNavigate: (page: string) => void
  onUpdateProvider?: (updates: Partial<Provider>) => Promise<void>
  isDemo?: boolean
}

export function ProviderOverviewDashboard({ 
  provider, 
  onClose, 
  onNavigate, 
  onUpdateProvider,
  isDemo = true 
}: ProviderOverviewDashboardProps) {
  const [hiddenRequests, setHiddenRequests] = useState<Set<string>>(new Set())
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    activeOffers: 0,
    newRequests: 0,
    todayReservations: 0,
    creditBalance: 0,
    lowCredit: false,
    zeroCredit: false,
    incompleteProfile: false,
    pendingReservations: 0,
    upcomingEvents: [],
    requestsToReact: [],
    offersStatus: { active: 0, inactive: 0, archived: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [provider])

  const loadDashboardData = async () => {
    setLoading(true)
    
    try {
      if (isDemo) {
        // Demo data - for development/testing
        const mockData: DashboardData = {
          activeOffers: 2,
          newRequests: 3,
          todayReservations: 1,
          creditBalance: 150,
          
          lowCredit: false,
          zeroCredit: false,
          incompleteProfile: false,
          pendingReservations: 1,
          
          upcomingEvents: [
            {
              id: 'res-1',
              type: 'reservation',
              title: 'Lash lifting + brow shape',
              date: 'Zítra',
              time: '14:00'
            },
            {
              id: 'res-2', 
              type: 'reservation',
              title: 'Masáž zad',
              date: 'Pozítří',
              time: '10:30'
            }
          ],
          
          requestsToReact: [
            {
              id: 'req-1',
              title: 'Hledám kosmetičku na obličej',
              description: 'Potřebuji profesionální čištění pleti...',
              location: 'Olomouc',
              date: 'Dnes',
              matchPercentage: 100,
              urgent: true
            },
            {
              id: 'req-2',
              title: 'Masáž pro relaxaci',
              description: 'Hledám kvalitní masáž zad...',
              location: 'Olomouc',
              date: 'Zítra',
              matchPercentage: 70,
              urgent: false
            },
            {
              id: 'req-3',
              title: 'Manikúra a pedikúra',
              description: 'Kompletní péče o nehty...',
              location: 'Prostějov',
              date: 'Tento týden',
              matchPercentage: 40,
              urgent: false
            }
          ].sort((a, b) => b.matchPercentage - a.matchPercentage), // 100% → 70% → 40%
          
          offersStatus: {
            active: 2,
            inactive: 1,
            archived: 0
          }
        }
        setDashboardData(mockData)
      } else {
        // Real data - empty states when no data available
        const realData: DashboardData = {
          activeOffers: 0,
          newRequests: 0,
          todayReservations: 0,
          creditBalance: provider.credit_balance || 0,
          
          lowCredit: (provider.credit_balance || 0) < 20 && (provider.credit_balance || 0) > 0,
          zeroCredit: (provider.credit_balance || 0) === 0,
          incompleteProfile: !provider.description || !provider.phone || !provider.city,
          pendingReservations: 0,
          
          upcomingEvents: [],
          requestsToReact: [],
          offersStatus: { active: 0, inactive: 0, archived: 0 }
        }
        setDashboardData(realData)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCreditDaysEstimate = () => {
    if (dashboardData.creditBalance === 0) return null
    if (dashboardData.activeOffers === 0) return null // No offers = no consumption
    
    // Rule: 5 Kč per day per active offer
    const dailyUsage = dashboardData.activeOffers * 5
    const daysLeft = Math.floor(dashboardData.creditBalance / dailyUsage)
    
    return daysLeft > 0 ? daysLeft : 1
  }

  const formatMatchPercentage = (percentage: number) => {
    const colors = {
      100: 'bg-green-100 text-green-800',
      70: 'bg-yellow-100 text-yellow-800', 
      40: 'bg-blue-100 text-blue-800'
    }
    const labels = {
      100: '100%',
      70: '70%',
      40: '40%'
    }
    
    return {
      className: colors[percentage as keyof typeof colors] || 'bg-gray-100 text-gray-800',
      label: labels[percentage as keyof typeof labels] || `${percentage}%`
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4" style={{ borderColor: SAGE.navy, borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-gray-200">
                  {provider.logo_url ? (
                    <img src={provider.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm sm:text-base">
                      {provider.business_name?.charAt(0) || 'S'}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold" style={{ color: SAGE.navy }}>
                    {provider.business_name || 'Váš podnik'}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {provider.is_verified ? (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      )}
                      {provider.is_verified ? 'Profil veřejný' : 'Profil není veřejný'}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>Aktualizace: {new Date().toLocaleDateString('cs-CZ')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => onNavigate('profile')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Zobrazit profil
              </button>
              <button
                onClick={() => onNavigate('profile-edit')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Upravit profil
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isDemo && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <Info className="w-4 h-4" />
              DEMO DATA - Zobrazená data jsou pouze pro demonstraci
            </div>
          </div>
        )}
        <div className="space-y-8">
          {/* Alerts */}
          {(dashboardData.lowCredit || dashboardData.zeroCredit || dashboardData.incompleteProfile || dashboardData.pendingReservations > 0) && (
            <div className="space-y-3">
              {dashboardData.zeroCredit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 sm:mt-0" />
                    <div className="flex-1">
                      <p className="font-medium text-red-800">Kredit je vyčerpán</p>
                      <p className="text-sm text-red-700">Vaše nabídky jsou pozastaveny. Dobijte kredit pro pokračování.</p>
                    </div>
                    <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm w-full sm:w-auto">
                      Dobít kredit
                    </button>
                  </div>
                </div>
              )}
              
              {dashboardData.lowCredit && !dashboardData.zeroCredit && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <CreditCard className="w-5 h-5 text-amber-600 mt-0.5 sm:mt-0" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-800">Nízký kredit</p>
                      <p className="text-sm text-amber-700">Zůstatek {dashboardData.creditBalance} Kč. Doporučujeme dobít.</p>
                    </div>
                    <button className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm w-full sm:w-auto">
                      Dobít kredit
                    </button>
                  </div>
                </div>
              )}
              
              {dashboardData.incompleteProfile && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 sm:mt-0" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Neúplný profil</p>
                      <p className="text-sm text-blue-700">Dokončete profil pro lepší viditelnost v人群中.</p>
                    </div>
                    <button 
                      onClick={() => onNavigate('profile-edit')}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto"
                    >
                      Upravit profil
                    </button>
                  </div>
                </div>
              )}
              
              {dashboardData.pendingReservations > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5 sm:mt-0" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Nové rezervace čekají na potvrzení</p>
                      <p className="text-sm text-green-700">{dashboardData.pendingReservations} rezervace{dashboardData.pendingReservations > 1 ? 'čeká' : 'čeká'} na váš response</p>
                    </div>
                    <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto">
                      Rezervace
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Active Offers */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{dashboardData.activeOffers}</p>
                <p className="text-sm text-gray-600">Aktivní nabídky</p>
              </div>
              <button 
                onClick={() => onNavigate('offers')}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Moje nabídky →
              </button>
            </div>

            {/* New Requests */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">100% shoda</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{dashboardData.newRequests}</p>
                <p className="text-sm text-gray-600">Nové poptávky</p>
              </div>
              <button 
                onClick={() => onNavigate('requests')}
                className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Dostupné poptávky →
              </button>
            </div>

            {/* Today's Reservations */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{dashboardData.todayReservations}</p>
                <p className="text-sm text-gray-600">Dnešní rezervace</p>
              </div>
              <button 
                onClick={() => onNavigate('reservations')}
                className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Rezervace →
              </button>
            </div>

            {/* Credit */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                {dashboardData.creditBalance < 20 && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{dashboardData.creditBalance} Kč</p>
                <p className="text-sm text-gray-600">
                  {getCreditDaysEstimate() ? `Vystačí ~${getCreditDaysEstimate()} dní` : 'Kredit'}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('credit')}
                className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Dobít kredit →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: SAGE.navy }}>Rychlé akce</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <button 
                onClick={() => onNavigate('offers')}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Přidat nabídku</span>
              </button>
              <button 
                onClick={() => onNavigate('offers')}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Spravovat nabídky</span>
              </button>
              <button 
                onClick={() => onNavigate('requests')}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Zobrazit poptávky</span>
              </button>
              <button 
                onClick={() => onNavigate('reservations')}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Zobrazit rezervace</span>
              </button>
              <button 
                onClick={() => onNavigate('credit')}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Dobít kredit</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: SAGE.navy }}>Nejbližší události</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              
              {dashboardData.upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcomingEvents.map((event) => (
                    <div key={event.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg self-start">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                          <span>{event.date} {event.time}</span>
                          {event.client && <span className="hidden sm:inline">•</span>}
                          {event.client && <span>{event.client}</span>}
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium self-start sm:self-center">
                        Detaily
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Zatím nemáte rezervace</p>
                  <div className="space-y-2">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium block w-full">
                      Zkontrolovat poptávky
                    </button>
                    <button 
                      onClick={() => onNavigate('offers')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium block w-full"
                    >
                      Upravit nabídky
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Requests to React */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: SAGE.navy }}>Poptávky k reakci</h3>
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>
              
              {dashboardData.requestsToReact.filter(request => !hiddenRequests.has(request.id)).length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.requestsToReact
                    .filter(request => !hiddenRequests.has(request.id))
                    .map((request) => {
                    const matchFormat = formatMatchPercentage(request.matchPercentage)
                    return (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${matchFormat.className}`}>
                              {matchFormat.label}
                            </span>
                            {request.urgent && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Urgentní
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              setHiddenRequests(prev => new Set([...prev, request.id]))
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600 self-end sm:self-start"
                          >
                            Skrýt
                          </button>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">{request.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {request.location}
                            </span>
                            <span>{request.date}</span>
                          </div>
                          <button 
                            onClick={() => onNavigate('requests')}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto"
                          >
                            Odpovědět
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Žádné nové poptávky</p>
                  <p className="text-sm text-gray-400">Objeví se podle vaší lokality a kategorií</p>
                </div>
              )}
            </div>
          </div>

          {/* Offers Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold" style={{ color: SAGE.navy }}>Stav nabídek</h3>
              <button 
                onClick={() => onNavigate('offers')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium self-start sm:self-center"
              >
                Moje nabídky →
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{dashboardData.offersStatus.active}</div>
                <div className="text-sm text-gray-600">Aktivní</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-600 mb-1">{dashboardData.offersStatus.inactive}</div>
                <div className="text-sm text-gray-600">Neaktivní</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-400 mb-1">{dashboardData.offersStatus.archived}</div>
                <div className="text-sm text-gray-600">Archivované</div>
              </div>
            </div>
            
            {dashboardData.offersStatus.active === 0 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-medium mb-2">Aktivujte alespoň jednu nabídku</p>
                <button className="text-sm text-amber-700 hover:text-amber-800 font-medium">
                  Přidat nabídku →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
