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
import { ProviderVerification } from '@/components/Account/ProviderVerification'
import { CreditsBilling } from '@/components/Account/CreditsBilling'

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

// Profile Tab Component - s ověřením
const ProfileTab: React.FC<any> = ({ profile, setProfileCompleteness }) => {
  const [verificationData, setVerificationData] = useState(null)

  const handleVerificationUpdate = (verification: any) => {
    setVerificationData(verification)
    // Zde by byla aktualizace kompletnosti profilu
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upravit profil</h2>
        <p className="text-gray-600">Dokončete svůj profil pro lepší nalezitelnost</p>
      </div>
      
      {/* Kompletnost profilu indikátor */}
      <div className="bg-sage bg-opacity-10 border border-sage rounded-lg p-4">
        <h3 className="font-semibold text-sage-dark mb-2">📊 Kompletnost profilu</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className="bg-sage h-3 rounded-full transition-all duration-300"
              style={{ width: '65%' }}
            ></div>
          </div>
          <span className="text-sage-dark font-medium">65%</span>
        </div>
        <p className="text-sm text-sage-dark mt-2">
          Pro publikování nabídek potřebujete min. 70% kompletnost + ověření
        </p>
      </div>

      {/* Sekce profilu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Základní informace */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">👤 Základní informace</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Název firmy</label>
              <input 
                type="text" 
                defaultValue={profile?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Popis</label>
              <textarea 
                rows={3}
                defaultValue={profile?.description || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                placeholder="Popište vaše služby a zkušenosti..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokace</label>
              <input 
                type="text" 
                defaultValue={profile?.location || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
              />
            </div>
          </div>
        </div>

        {/* Kontaktní informace */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">📞 Kontakt</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input 
                type="email" 
                defaultValue={profile?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input 
                type="tel" 
                defaultValue={profile?.phone || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webové stránky</label>
              <input 
                type="url" 
                defaultValue={profile?.website || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ověření účtu */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">🔒 Ověření účtu</h3>
        <ProviderVerification 
          providerId={profile?.id || ''}
          currentVerification={verificationData || undefined}
          onVerificationUpdate={handleVerificationUpdate}
        />
      </div>

      {/* Galerie */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">🖼️ Galerie</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-2">📷</div>
          <p className="text-gray-600">Nahrajte obrázky vašich prací a služeb</p>
          <p className="text-sm text-gray-500 mt-1">Podporované formáty: JPG, PNG (max. 5MB)</p>
          <button className="mt-4 px-4 py-2 bg-sage text-sage-dark rounded-lg hover:bg-sage-dark hover:text-white transition-colors">
            Nahrát obrázky
          </button>
        </div>
      </div>

      {/* Uložit změny */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Zrušit
        </button>
        <button className="px-6 py-3 bg-sage text-sage-dark rounded-lg hover:bg-sage-dark hover:text-white transition-colors font-medium">
          💾 Uložit změny
        </button>
      </div>
    </div>
  )
}

// Offers Tab Component - s Gating logikou podle specifikace
const OffersTab: React.FC<any> = ({ profile, profileCompleteness }) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewChecked, setPreviewChecked] = useState(false)
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image_url: ''
  })

  // Gating logika podle specifikace: verified + 70% + zkontrolovaný náhled
  const canPublish = profileCompleteness >= 70 && profile?.verified && previewChecked
  
  const handleCreateOffer = () => {
    if (!canPublish) {
      alert('Pro publikování nabídky musíte splnit všechny podmínky.')
      return
    }
    setShowCreateForm(true)
  }

  const handlePreview = () => {
    if (!offerForm.title || !offerForm.description || !offerForm.price) {
      alert('Vyplňte všechna povinná pole před náhledem.')
      return
    }
    setPreviewMode(true)
  }

  const handlePublish = () => {
    if (!previewChecked) {
      alert('Musíte zaškrtnout, že jste zkontrolovali náhled.')
      return
    }
    // Zde by byla logika publikování nabídky
    alert('Nabídka byla úspěšně publikována!')
    setShowCreateForm(false)
    setPreviewMode(false)
    setOfferForm({ title: '', description: '', price: '', category: '', image_url: '' })
    setPreviewChecked(false)
  }
  
  // Renderování podle stavu
  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Vytvořit novou nabídku</h2>
          <button 
            onClick={() => setShowCreateForm(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Zpět
          </button>
        </div>

        {!previewMode ? (
          // Formulář pro vytvoření nabídky
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Název služby *</label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                  placeholder="Např. Profesionální úklid domácnosti"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Popis *</label>
                <textarea
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                  placeholder="Detailní popis vaší služby..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cena (Kč) *</label>
                  <input
                    type="number"
                    value={offerForm.price}
                    onChange={(e) => setOfferForm({...offerForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                    placeholder="500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                  <select
                    value={offerForm.category}
                    onChange={(e) => setOfferForm({...offerForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                  >
                    <option value="">Vyberte kategorii</option>
                    <option value="beauty">Kosmetika a krása</option>
                    <option value="reality">Nemovitosti</option>
                    <option value="sport">Sport a fitness</option>
                    <option value="cleaning">Úklid</option>
                    <option value="other">Ostatní</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL obrázku</label>
                <input
                  type="url"
                  value={offerForm.image_url}
                  onChange={(e) => setOfferForm({...offerForm, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handlePreview}
                  className="flex-1 bg-sage text-sage-dark py-3 px-4 rounded-lg hover:bg-sage-dark hover:text-white transition-colors font-medium"
                >
                  👁️ Zobrazit náhled
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Náhled podle specifikace - 2 varianty
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Náhled nabídky</h3>
              <p className="text-gray-600">Zkontrolujte, jak bude vaše nabídka vypadat</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Homepage Karta */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">🏠 Homepage karta</h4>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-sage-light to-sage flex items-center justify-center">
                      {offerForm.image_url ? (
                        <img src={offerForm.image_url} alt={offerForm.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sage-dark text-4xl">🖼️</span>
                      )}
                    </div>
                    {/* Promo štítek podle specifikace - pod fotkou */}
                    {offerForm.category === 'beauty' && (
                      <div className="absolute bottom-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                        🔥 Sleva 20%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">{offerForm.title || 'Název služby'}</h5>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {offerForm.description || 'Popis služby'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sage font-bold">{offerForm.price || '0'} Kč</span>
                      <button className="px-3 py-1 bg-sage text-sage-dark rounded text-sm font-medium">
                        Rezervovat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detail stránka */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">📋 Detail stránka</h4>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <h5 className="text-xl font-bold text-gray-900 mb-2">{offerForm.title || 'Název služby'}</h5>
                    <p className="text-2xl font-bold text-sage mb-4">{offerForm.price || '0'} Kč</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Popis</h6>
                      <p className="text-gray-600">{offerForm.description || 'Popis služby'}</p>
                    </div>
                    
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Kategorie</h6>
                      <span className="inline-block bg-sage bg-opacity-10 text-sage-dark px-3 py-1 rounded-full text-sm">
                        {offerForm.category || 'Nedefinována'}
                      </span>
                    </div>
                    
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">Poskytovatel</h6>
                      <p className="text-gray-600">{profile?.name || 'Název firmy'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Checkbox "Zkontroloval/a jsem náhled" podle specifikace */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={previewChecked}
                  onChange={(e) => setPreviewChecked(e.target.checked)}
                  className="w-4 h-4 text-sage border-gray-300 rounded focus:ring-sage"
                />
                <span className="text-blue-900 font-medium">
                  ✅ Zkontroloval/a jsem náhled a souhlasím s publikováním této nabídky
                </span>
              </label>
            </div>
            
            {/* Tlačítka */}
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setPreviewMode(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Upravit
              </button>
              
              <button
                onClick={handlePublish}
                disabled={!previewChecked}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  previewChecked
                    ? 'bg-sage text-sage-dark hover:bg-sage-dark hover:text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                🚀 Publikovat nabídku
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Hlavní zobrazení Offers tab
  const canStartCreating = profileCompleteness >= 70 && profile?.verified
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Správa nabídek</h2>
        <p className="text-gray-600">Vytvořte a spravujte své služby</p>
      </div>
      
      {/* Gating indikátor podle specifikace */}
      <div className={`p-6 rounded-xl border-2 ${
        canStartCreating 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-start space-x-4">
          <span className="text-3xl">{canStartCreating ? '✅' : '⏳'}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Stav publikování nabídek</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`w-4 h-4 rounded-full ${profile?.verified ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-sm">Profil ověřen</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-4 h-4 rounded-full ${profileCompleteness >= 70 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-sm">Kompletnost profilu: {profileCompleteness}% (potřeba min. 70%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-4 h-4 rounded-full ${previewChecked ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-sm">Zkontrolovaný náhled nabídky</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {canStartCreating 
                ? 'Můžete začít vytvářet nové nabídky' 
                : 'Dokončte všechny požadavky pro povolení publikování'
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl transition-all ${
          canStartCreating 
            ? 'bg-gradient-to-r from-sage to-sage-dark text-white' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          <h3 className="text-lg font-semibold mb-2">➕ Vytvořit nabídku</h3>
          <p className="mb-4 opacity-90">Nová služba pro zákazníky</p>
          <button 
            onClick={handleCreateOffer}
            disabled={!canStartCreating}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              canStartCreating 
                ? 'bg-white text-sage-dark hover:bg-gray-100' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {canStartCreating ? 'Vytvořit nabídku' : 'Nedostupné'}
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">📋 Stávající nabídky</h3>
          <p className="mb-4 opacity-90">Správa publikovaných služeb</p>
          <button className="w-full py-3 px-4 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
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

// Credits Tab Component - s denními odečty a Stripe integrací
const CreditsTab: React.FC<any> = () => {
  return <CreditsBilling />
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