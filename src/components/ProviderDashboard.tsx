import { useState, useEffect } from 'react'
import { 
  User, Package, CreditCard, Users, BarChart3, LogOut, 
  ChevronLeft, Bell, MessageSquare, Zap, Shield
} from '../components/icons'
import { useAuth } from '../context/AuthContext'
import { supabase, Provider, Offer, Reservation, Review, CreditTransaction } from '../lib/supabase'
import { ProfileViewPage } from './ProfileViewPage'
import { ProfileEditPage } from './ProfileEditPage'
import { KreditniCentrum } from './KreditniCentrum'
import { OffersSection } from './dashboard/OffersSection'
import { CreditsSection } from './dashboard/CreditsSection'
import { ClientsSection } from './dashboard/ClientsSection'
import { StatsSection } from './dashboard/StatsSection'

type Section = 'profile' | 'offers' | 'credits' | 'clients' | 'stats' | 'kredit'
type ProfileMode = 'view' | 'edit'

interface ProviderDashboardProps {
  onClose: () => void
}

export function ProviderDashboard({ onClose }: ProviderDashboardProps) {
  const { user, signOut } = useAuth()
  const [activeSection, setActiveSection] = useState<Section>('profile')
  const [profileMode, setProfileMode] = useState<ProfileMode>('view')
  const [provider, setProvider] = useState<Provider | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    loadProviderData()
  }, [user])

  // Real-time subscriptions
  useEffect(() => {
    if (!provider) return

    // Subscribe to reservations changes
    const reservationsSub = supabase
      .channel('reservations-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reservations',
        filter: `provider_id=eq.${provider.id}`
      }, () => {
        loadReservations(provider.id)
      })
      .subscribe()

    // Subscribe to chat messages
    const chatSub = supabase
      .channel('chat-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'provider_chat_messages'
      }, (payload) => {
        setNotifications(n => n + 1)
      })
      .subscribe()

    return () => {
      reservationsSub.unsubscribe()
      chatSub.unsubscribe()
    }
  }, [provider])

  const loadProviderData = async () => {
    setLoading(true)

    try {
      // Create demo provider data
      const demoProvider: Provider = {
        id: 'demo-provider-dashboard',
        user_id: user?.id || 'demo-user-id',
        name: 'Jan Poskytovatel',
        email: 'poskytovatel@aspeti.cz',
        business_name: 'Studio Ravé',
        slogan: 'Krása a relaxace na jednom místě',
        description: 'Profesionální beauty studio nabízející komplexní služby pro vaši krásu a relaxaci.',
        about_me: 'Vítejte v našem moderním beauty studiu! Poskytujeme profesionální služby v oblasti kosmetiky, masáží a wellnes.',
        pricing_info: 'Masáž zad (45 min) - 590 Kč\nLash lifting + brow shape - 890 Kč\nKosmetické ošetření - od 800 Kč',
        phone: '+420 777 123 456',
        website_url: 'https://studio-rave.cz',
        city: 'Olomouc',
        address: 'Wenceslasova 12, 779 00 Olomouc',
        categories: ['beauty'],
        logo_url: null,
        cover_url: null,
        gallery_urls: [],
        credit_balance: 150,
        is_verified: true,
        is_active: true,
        flash_offer_active: false,
        flash_offer_text: null,
        certificates: ['Certifikovaný kosmetik'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Mock offers data
      const mockOffers: Offer[] = [
        {
          id: 'offer-1',
          title: 'Lash lifting + brow shape',
          provider_id: demoProvider.id,
          category: 'beauty',
          description: 'Luxusní balíček pro perfektní pohled.',
          price: 890,
          old_price: 990,
          location: 'Olomouc',
          is_active: true,
          views_count: 150,
          clicks: 45,
          vip: true,
          top: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'offer-2',
          title: 'Masáž zad 45 min',
          provider_id: demoProvider.id,
          category: 'beauty',
          description: 'Uvolněte napětí při příjemné masáži.',
          price: 590,
          location: 'Olomouc',
          is_active: true,
          views_count: 200,
          clicks: 60,
          vip: false,
          top: true,
          created_at: new Date().toISOString()
        }
      ]

      // Mock reservations data
      const mockReservations: Reservation[] = [
        {
          id: 'reservation-1',
          provider_id: demoProvider.id,
          offer_id: 'offer-1',
          client_name: 'Marie Nováková',
          client_phone: '+420 777 654 321',
          client_email: 'marie@email.cz',
          reservation_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          reservation_time: '14:00',
          status: 'confirmed',
          created_at: new Date().toISOString()
        }
      ]

      // Mock reviews data
      const mockReviews: Review[] = [
        {
          id: 'review-1',
          provider_id: demoProvider.id,
          client_name: 'Anna Svobodová',
          client_email: 'anna@email.cz',
          rating: 5,
          review_text: 'Skvělé služby, určitě se vrátím!',
          created_at: new Date().toISOString()
        }
      ]

      // Mock transactions data
      const mockTransactions: CreditTransaction[] = [
        {
          id: 'tx-1',
          provider_id: demoProvider.id,
          amount: 200,
          transaction_type: 'credit',
          description: 'Dobití kreditu',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      setProvider(demoProvider)
      setOffers(mockOffers)
      setReservations(mockReservations)
      setReviews(mockReviews)
      setTransactions(mockTransactions)
      setNotifications(1) // 1 pending reservation

    } catch (error) {
      console.error('Error loading provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReservations = async (providerId: string) => {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .eq('provider_id', providerId)
      .order('reservation_date', { ascending: true })
    if (data) setReservations(data)
  }

  const updateProvider = async (updates: Partial<Provider>) => {
    if (!provider) return
    try {
      // Update provider locally (mock implementation)
      setProvider({ ...provider, ...updates, updated_at: new Date().toISOString() })
      console.log('Provider updated successfully:', updates)
      
      // In real app, this would update Supabase:
      // const { error } = await supabase.from('providers').update(updates).eq('id', provider.id)
      // if (!error) {
      //   setProvider({ ...provider, ...updates })
      // }
    } catch (error) {
      console.error('Error updating provider:', error)
    }
  }

  const refreshCredits = async () => {
    if (!provider) return
    const { data } = await supabase.from('providers').select('credits').eq('id', provider.id).maybeSingle()
    if (data) {
      setProvider({ ...provider, credits: data.credits })
    }
  }

  const handleLogout = async () => {
    await signOut()
    onClose()
  }

  const menuItems = [
    { id: 'profile' as Section, icon: User, label: 'Identita a Profil' },
    { id: 'offers' as Section, icon: Package, label: 'Sprava Nabidek' },
    { id: 'credits' as Section, icon: CreditCard, label: 'Kreditni Centrum' },
    { id: 'clients' as Section, icon: Users, label: 'Klienti a Rezervace' },
    { id: 'stats' as Section, icon: BarChart3, label: 'Statistiky a Recenze' },
  ]

  const handleSectionChange = (section: Section) => {
    setActiveSection(section)
    if (section === 'profile') {
      setProfileMode('view') // Reset to view mode when entering profile section
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F5F7F6] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F7F6] flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">A</span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="font-bold text-emerald-600 truncate">ASPETi</div>
                <div className="text-xs text-gray-500">Provider Portal</div>
              </div>
            )}
          </div>
        </div>

        <div className={`p-4 border-b border-gray-200 ${sidebarCollapsed ? 'text-center' : ''}`}>
          <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'items-center gap-3'}`}>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg flex-shrink-0 overflow-hidden">
              {provider?.logo_url ? (
                <img src={provider.logo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                provider?.business_name?.charAt(0) || 'P'
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">{provider?.business_name || 'Vas podnik'}</div>
                <div className="flex items-center gap-1 text-sm">
                  {provider?.is_verified && <Shield className="w-3 h-3 text-blue-500" />}
                  <span className="text-gray-500 truncate">{provider?.city || 'Nastavte lokaci'}</span>
                </div>
              </div>
            )}
          </div>
          {!sidebarCollapsed && provider?.credits !== undefined && (
            <div className="mt-3 p-2 bg-emerald-100 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Kredit</span>
                <span className="font-bold text-emerald-600">{provider.credits} Kc</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                activeSection === item.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              {item.id === 'clients' && notifications > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 space-y-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span className="text-sm">Sbalit menu</span>}
          </button>
          <button
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <ChevronLeft className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Zpet na web</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm">Odhlasit</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-gray-900">
            {menuItems.find(m => m.id === activeSection)?.label}
          </h1>
          <div className="flex items-center gap-4">
            {provider?.flash_offer_active && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Flash nabidka aktivni
              </div>
            )}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'profile' && provider && (
            profileMode === 'view' ? (
              <ProfileViewPage 
                provider={provider} 
                onEdit={() => setProfileMode('edit')}
                onClose={onClose}
              />
            ) : (
              <ProfileEditPage 
                provider={provider} 
                onUpdate={updateProvider}
                onClose={() => setProfileMode('view')}
              />
            )
          )}
          {activeSection === 'offers' && provider && (
            <OffersSection offers={offers} providerId={provider.id} onRefresh={loadProviderData} />
          )}
          {activeSection === 'credits' && (
            <KreditniCentrum />
          )}
          {activeSection === 'clients' && provider && (
            <ClientsSection reservations={reservations} providerId={provider.id} onRefresh={loadProviderData} />
          )}
          {activeSection === 'stats' && provider && (
            <StatsSection provider={provider} offers={offers} reviews={reviews} onRefresh={loadProviderData} />
          )}
        </main>
      </div>
    </div>
  )
}
