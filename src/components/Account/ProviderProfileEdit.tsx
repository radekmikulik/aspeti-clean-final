// ASPETi PLUS - Provider Profile Edit Page Component
// KROK 8: FINÁLNÍ INTEGRACE - Plnohodnotná stránka s designem

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DatabaseService } from '@/lib/supabase'
import { CalendarAndMessagesService } from '@/lib/calendar-messages-service'
import { AvailabilitySettings } from '@/components/Calendar/AvailabilitySettings'
import { BlackoutSettings } from '@/components/Calendar/BlackoutSettings'
import { ChatComponent } from '@/components/Chat/ChatComponent'

// Typy pro profil a stav
interface ProviderProfile {
  id: string
  name: string
  description: string
  location: string
  phone: string
  email: string
  website?: string
  verified: boolean
  profile_completeness: number
  is_active: boolean
  created_at: string
}

interface TabInfo {
  id: string
  label: string
  icon: string
  component: React.ComponentType<any>
}

// Mock auth state (budoucí integrace s useAuth)
const mockUser = { 
  id: '11111111-1111-1111-1111-111111111111', 
  email: 'test@example.com', 
  user_metadata: { full_name: 'Test Provider', role: 'provider' } 
}
let mockUserRole = 'provider' as 'client' | 'provider'

export const ProviderProfileEdit: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [profile, setProfile] = useState<ProviderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileCompleteness, setProfileCompleteness] = useState(0)
  
  // Tab configuration podle specifikace
  const tabs: TabInfo[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      component: DashboardTab
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: '👤',
      component: ProfileTab
    },
    {
      id: 'offers',
      label: 'Nabídky',
      icon: '💼',
      component: OffersTab
    },
    {
      id: 'availability',
      label: 'Dostupnost',
      icon: '📅',
      component: AvailabilityTab
    },
    {
      id: 'clients',
      label: 'Klienti',
      icon: '👥',
      component: ClientsTab
    },
    {
      id: 'credits',
      label: 'Kredity',
      icon: '💳',
      component: CreditsTab
    },
    {
      id: 'messages',
      label: 'Zprávy',
      icon: '💬',
      component: MessagesTab
    },
    {
      id: 'settings',
      label: 'Nastavení',
      icon: '⚙️',
      component: SettingsTab
    }
  ]

  // Načtení profilu při inicializaci
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        // Mock profil data - budoucí integrace s DatabaseService
        const mockProfile: ProviderProfile = {
          id: mockUser.id,
          name: 'Test Provider',
          description: 'Profesionální poskytovatel služeb',
          location: 'Praha, Česká republika',
          phone: '+420 123 456 789',
          email: mockUser.email,
          website: 'https://testprovider.cz',
          verified: false,
          profile_completeness: 65,
          is_active: true,
          created_at: '2024-01-01T00:00:00Z'
        }
        
        setProfile(mockProfile)
        setProfileCompleteness(mockProfile.profile_completeness)
        setLoading(false)
      } catch (error) {
        console.error('Error loading profile:', error)
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Kontrola oprávnění
  if (mockUserRole !== 'provider') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Přístup zamítnut</h2>
          <p className="text-gray-600">Tuto stránku mohou používat pouze poskytovatelé služeb.</p>
          <Link href="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám profil...</p>
        </div>
      </div>
    )
  }

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || DashboardTab

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header s cover obrázkem - podle specifikace */}
      <div className="relative h-80 bg-gradient-to-r from-sage via-sage-light to-sage-dark">
        {/* Overlay pro text */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Content overlay s poloprůhledným sage proužkem */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-sage-strong"></div>
        
        {/* Název a město uprostřed */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{profile?.name || 'Poskytovatel služeb'}</h1>
            <p className="text-xl opacity-90">{profile?.location || 'Česká republika'}</p>
          </div>
        </div>
        
        {/* Back button */}
        <Link href="/" className="absolute top-4 left-4 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white backdrop-blur-sm transition-all">
          ← Zpět na hlavní
        </Link>
      </div>

      {/* Main Content - Levý Panel + Pravý Obsah */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Levý Panel - Logo, Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Status Indikátory */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{profile?.name}</h3>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                </div>
                
                {/* Status karty */}
                <div className="space-y-3">
                  {/* Ověření */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{profile?.verified ? '✅' : '⏳'}</span>
                      <span className="text-sm font-medium">Ověření</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      profile?.verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profile?.verified ? 'Ověřen' : 'Čeká'}
                    </span>
                  </div>
                  
                  {/* Kompletnost profilu */}
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Kompletnost</span>
                      <span className="text-sm text-gray-600">{profileCompleteness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          profileCompleteness >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${profileCompleteness}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {profileCompleteness >= 70 ? 'Připraveno k publikování' : 'Chybí ' + (100 - profileCompleteness) + '%'}
                    </p>
                  </div>
                  
                  {/* Stav účtu */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{profile?.is_active ? '🟢' : '🔴'}</span>
                      <span className="text-sm font-medium">Aktivní</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      profile?.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile?.is_active ? 'Aktivní' : 'Neaktivní'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pravý Obsah - Tabs */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Tab Navigation - Sticky */}
              <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'border-sage text-sage-dark bg-sage bg-opacity-10'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <ActiveTabComponent 
                  profile={profile} 
                  profileCompleteness={profileCompleteness}
                  setProfileCompleteness={setProfileCompleteness}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Tab Component
const DashboardTab: React.FC<any> = ({ profile }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
        <p className="text-gray-600">Přehled vašeho účtu a aktivit</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">📊 Statistiky</h3>
          <p className="text-blue-100">Zobrazení profilu a kliky na nabídky</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">💼 Nabídky</h3>
          <p className="text-green-100">Správa vašich služeb</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">👥 Klienti</h3>
          <p className="text-purple-100">Vaši zákazníci a rezervace</p>
        </div>
      </div>
    </div>
  )
}

// Profile Tab Component
const ProfileTab: React.FC<any> = ({ profile, setProfileCompleteness }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upravit profil</h2>
        <p className="text-gray-600">Dokončete svůj profil pro lepší nalezitelnost</p>
      </div>
      
      {/* Formulář pro úpravu profilu - implementace podle specifikace */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-center text-gray-500">🚧 Formulář pro úpravu profilu v implementaci</p>
        <p className="text-center text-sm text-gray-400 mt-2">
          Zahrnuje: jméno, popis, lokace, kontakt, ověření (ARES), galerie
        </p>
      </div>
    </div>
  )
}

// Offers Tab Component - s Gating logikou
const OffersTab: React.FC<any> = ({ profile, profileCompleteness }) => {
  const canPublish = profileCompleteness >= 70 && profile?.verified
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Správa nabídek</h2>
        <p className="text-gray-600">Vytvořte a spravujte své služby</p>
      </div>
      
      {/* Gating indikátor */}
      <div className={`p-4 rounded-lg border-2 ${
        canPublish 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center">
          <span className="text-2xl mr-3">{canPublish ? '✅' : '⏳'}</span>
          <div>
            <h3 className="font-semibold">Stav publikování</h3>
            <p className="text-sm text-gray-600">
              {canPublish 
                ? 'Můžete publikovat nové nabídky' 
                : 'Pro publikování potřebujete: ověřený profil + 70% kompletnost'
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-sage to-sage-dark p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">➕ Vytvořit nabídku</h3>
          <p className="text-sage-light mb-4">Nová služba pro zákazníky</p>
          <button 
            disabled={!canPublish}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              canPublish 
                ? 'bg-white text-sage-dark hover:bg-gray-100' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {canPublish ? 'Vytvořit nabídku' : 'Nedostupné'}
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">📋 Stávající nabídky</h3>
          <p className="text-gray-200 mb-4">Správa publikovaných služeb</p>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            Zobrazit nabídky
          </button>
        </div>
      </div>
    </div>
  )
}

// Availability Tab Component
const AvailabilityTab: React.FC<any> = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dostupnost</h2>
        <p className="text-gray-600">Nastavte své pracovní hodiny a blokace</p>
      </div>
      
      <AvailabilitySettings onClose={() => console.log('Availability settings closed')} />
      <BlackoutSettings onClose={() => console.log('Blackout settings closed')} />
    </div>
  )
}

// Clients Tab Component
const ClientsTab: React.FC<any> = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Moji klienti</h2>
        <p className="text-gray-600">Správa zákazníků a rezervací</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">🚧 Modul "Moji klienti" v implementaci</p>
        <p className="text-sm text-gray-400 mt-2">
          Pozvánky, přijetí/odmítnutí, hromadné akce
        </p>
      </div>
    </div>
  )
}

// Credits Tab Component
const CreditsTab: React.FC<any> = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Kredity & fakturace</h2>
        <p className="text-gray-600">Správa kreditů a plateb</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">🚧 Modul "Kredity & fakturace" v implementaci</p>
        <p className="text-sm text-gray-400 mt-2">
          Denní odečet 5 Kč/24h, Stripe top-up, automatické skrývání nabídek
        </p>
      </div>
    </div>
  )
}

// Messages Tab Component
const MessagesTab: React.FC<any> = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Zprávy</h2>
        <p className="text-gray-600">Komunikace s klienty</p>
      </div>
      
      <ChatComponent onClose={() => console.log('Chat component closed')} />
    </div>
  )
}

// Settings Tab Component
const SettingsTab: React.FC<any> = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nastavení</h2>
        <p className="text-gray-600">Konfigurace účtu a aplikace</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">🚧 Nastavení účtu v implementaci</p>
        <p className="text-sm text-gray-400 mt-2">
          Notifikace, soukromí, bezpečnost
        </p>
      </div>
    </div>
  )
}