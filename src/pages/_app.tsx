import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import AppInner from '@/components/Home/AppInner'
import { AuthModal } from '@/components/AuthModal'
import { OfferDetail } from '@/components/OfferDetail'
import { ProviderOverviewDashboard } from '@/components/ProviderOverviewDashboard'
import { ProfileVizitka } from '@/components/ProfileVizitka'
import { ProfileEditVizitka } from '@/components/ProfileEditVizitka'
import { OffersManagement } from '@/components/OffersManagement'
import { Offer, Provider } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('offers')
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showOffersManagement, setShowOffersManagement] = useState(false)

  // Debug log current state
  console.log('Current state:', { currentPage, showDashboard, showProfileEdit, showOffersManagement, provider: provider?.business_name })

  // Load provider data when component mounts
  useEffect(() => {
    loadProviderData()
  }, [])

  // Handle URL hash navigation and debug parameters
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      console.log('Hash changed to:', hash)
      
      if (hash === 'dashboard' && provider) {
        setShowDashboard(true)
        setCurrentPage('offers')
        setShowProfileEdit(false)
        setShowOffersManagement(false)
      } else if (hash === 'offers' && provider) {
        setShowOffersManagement(true)
        setCurrentPage('offers')
        setShowDashboard(false)
        setShowProfileEdit(false)
      }
    }

    // Check URL parameters for debug mode
    const urlParams = new URLSearchParams(window.location.search)
    const debugMode = urlParams.get('debug')
    console.log('🔍 URL debug parameter:', debugMode)
    
    if (debugMode === 'offers' && provider) {
      console.log('🚀 Activating OffersManagement via URL parameter')
      setShowOffersManagement(true)
      setCurrentPage('offers')
      setShowDashboard(false)
      setShowProfileEdit(false)
    } else if (debugMode === 'dashboard' && provider) {
      console.log('🚀 Activating Dashboard via URL parameter')
      setShowDashboard(true)
      setCurrentPage('offers')
      setShowProfileEdit(false)
      setShowOffersManagement(false)
    }

    // Check initial hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [provider])

  // Track state changes for debugging
  useEffect(() => {
    console.log('Profile render condition:', {
      showDashboard, currentPage, showProfileEdit, 
      shouldShowProfile: !showDashboard && currentPage === 'profile' && provider
    })
  }, [showDashboard, currentPage, showProfileEdit, provider])

  const handleOfferClick = (offer: Offer) => {
    console.log('Offer clicked:', offer.id)
    setSelectedOffer(offer)
  }

  const handleNavigate = (page: string) => {
    console.log('Navigation requested:', page, { 
      showDashboard, 
      showProfileEdit, 
      showOffersManagement, 
      provider: !!provider 
    })
    
    if (page === 'login') {
      setAuthMode('login')
    } else if (page === 'register') {
      setAuthMode('register')
    } else if (page === 'profile') {
      setCurrentPage('profile')
      setShowProfileEdit(false)
      setShowDashboard(false)
      setShowOffersManagement(false) // Zobraz standalone profil
    } else if (page === 'profile-edit') {
      setCurrentPage('profile')
      setShowProfileEdit(true)
      setShowDashboard(false)
      setShowOffersManagement(false) // Zobraz standalone edit profil
    } else if (page === 'overview') {
      setShowDashboard(true) // Zobraz dashboard s menu
      setCurrentPage('offers')
      setShowProfileEdit(false)
      setShowOffersManagement(false)
    } else if (page === 'offers') {
      console.log('Setting showOffersManagement to true')
      setShowOffersManagement(true) // Zobraz správu nabídek
      setCurrentPage('offers')
      setShowDashboard(false)
      setShowProfileEdit(false)
    } else if (page === 'offers-edit') {
      // Future: edit specific offer or create new
      setShowOffersManagement(true)
      setCurrentPage('offers')
      setShowDashboard(false)
      setShowProfileEdit(false)
    } else {
      setCurrentPage(page)
      setShowDashboard(false)
      setShowProfileEdit(false)
      setShowOffersManagement(false)
    }
  }

  const loadProviderData = async (userId?: string) => {
    console.log('Loading provider data...', { userId })
    try {
      // Create demo provider data for all cases (similar to AuthContext)
      const demoProvider: Provider = {
        id: 'demo-provider-id',
        user_id: userId || 'demo-user-id',
        name: 'Jan Poskytovatel',
        email: 'poskytovatel@aspeti.cz',
        business_name: 'Studio Ravé',
        slogan: 'Krása a relaxace na jednom místě',
        description: 'Profesionální beauty studio nabízející komplexní služby pro vaši krásu a relaxaci.',
        about_me: 'Vítejte v našem moderním beauty studiu! Poskytujeme profesionální služby v oblasti kosmetiky, masáží a wellnes. Náš tým zkušených specialistů se postará o vaši spokojenost.',
        pricing_info: 'Masáž zad (45 min) - 590 Kč\nLash lifting + brow shape - 890 Kč\nKosmetické ošetření - od 800 Kč\nManikúra + pedikúra - 450 Kč',
        phone: '+420 777 123 456',
        website_url: 'https://studio-rave.cz',
        city: 'Olomouc',
        address: 'Wenceslasova 12, 779 00 Olomouc',
        categories: ['beauty', 'gastro'],
        logo_url: undefined,
        cover_url: undefined,
        profile_image_url: undefined,
        gallery_urls: [
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1501117716987-c8e2a4a3af5a?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1523986371872-9d3ba2a2b1a9?w=400&h=400&fit=crop'
        ],
        credit_balance: 150,
        is_verified: true,
        is_active: true,
        flash_offer_active: false,
        flash_offer_text: undefined,
        certificates: ['Certifikovaný kosmetik', 'Licencovaná masérka'],
        content_blocks: {
          about: [
            {
              id: 'about-1',
              type: 'text',
              content: 'Vítejte v našem moderním beauty studiu! Poskytujeme profesionální služby v oblasti kosmetiky, masáží a wellnes.',
              sortOrder: 1
            }
          ],
          space: [
            {
              id: 'space-1',
              type: 'image',
              imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
              imageAlt: 'Interiér studia',
              sortOrder: 1
            }
          ],
          team: [
            {
              id: 'team-1',
              type: 'text',
              content: 'Anna Kosmetička',
              sortOrder: 1
            },
            {
              id: 'team-2', 
              type: 'text',
              content: 'Petr Masér',
              sortOrder: 2
            }
          ],
          certs: [
            {
              id: 'cert-1',
              type: 'text',
              content: 'Certifikovaný kosmetik',
              sortOrder: 1
            },
            {
              id: 'cert-2',
              type: 'text', 
              content: 'Licencovaná masérka',
              sortOrder: 2
            }
          ]
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setProvider(demoProvider)
      console.log('Demo provider data loaded successfully:', demoProvider.business_name)
    } catch (error) {
      console.error('Error loading provider data:', error)
      console.log('Loading fallback demo provider data...')
      // Always load demo provider data as fallback
      const demoProvider: Provider = {
        id: 'demo-provider-id',
        user_id: userId || 'demo-user-id',
        name: 'Jan Poskytovatel',
        email: 'poskytovatel@aspeti.cz',
        business_name: 'Studio Ravé',
        slogan: 'Krása a relaxace na jednom místě',
        description: 'Profesionální beauty studio nabízející komplexní služby pro vaši krásu a relaxaci.',
        about_me: 'Vítejte v našem moderním beauty studiu! Poskytujeme profesionální služby v oblasti kosmetiky, masáží a wellnes. Náš tým zkušených specialistů se postará o vaši spokojenost.',
        pricing_info: 'Masáž zad (45 min) - 590 Kč\nLash lifting + brow shape - 890 Kč\nKosmetické ošetření - od 800 Kč\nManikúra + pedikúra - 450 Kč',
        phone: '+420 777 123 456',
        website_url: 'https://studio-rave.cz',
        city: 'Olomouc',
        address: 'Wenceslasova 12, 779 00 Olomouc',
        categories: ['beauty', 'gastro'],
        logo_url: undefined,
        cover_url: undefined,
        profile_image_url: undefined,
        gallery_urls: [
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1501117716987-c8e2a4a3af5a?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1523986371872-9d3ba2a2b1a9?w=400&h=400&fit=crop'
        ],
        credit_balance: 150,
        is_verified: true,
        is_active: true,
        flash_offer_active: false,
        flash_offer_text: undefined,
        certificates: ['Certifikovaný kosmetik', 'Licencovaná masérka'],
        content_blocks: {
          about: [
            {
              id: 'about-1',
              type: 'text',
              content: 'Vítejte v našem moderním beauty studiu! Poskytujeme profesionální služby v oblasti kosmetiky, masáží a wellnes.',
              sortOrder: 1
            }
          ],
          space: [
            {
              id: 'space-1',
              type: 'image',
              imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
              imageAlt: 'Interiér studia',
              sortOrder: 1
            }
          ],
          team: [
            {
              id: 'team-1',
              type: 'text',
              content: 'Anna Kosmetička',
              sortOrder: 1
            },
            {
              id: 'team-2', 
              type: 'text',
              content: 'Petr Masér',
              sortOrder: 2
            }
          ],
          certs: [
            {
              id: 'cert-1',
              type: 'text',
              content: 'Certifikovaný kosmetik',
              sortOrder: 1
            },
            {
              id: 'cert-2',
              type: 'text', 
              content: 'Licencovaná masérka',
              sortOrder: 2
            }
          ]
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // KROK 3 - INICIALIZACE MOCK STORAGE S DEMO DATY
      if (typeof window !== 'undefined') {
        (window as any).mockStorage = (window as any).mockStorage || {}
        // Initialize mockStorage with demo data if not already set
        if (!(window as any).mockStorage['demo-provider-id']) {
          (window as any).mockStorage['demo-provider-id'] = demoProvider
          console.log('✅ Mock storage initialized with demo provider data')
        }
      }
      
      setProvider(demoProvider)
      console.log('Fallback provider data loaded:', demoProvider.business_name)
    }
  }

  const updateProvider = async (updates: Partial<Provider>) => {
    if (!provider) return
    try {
      console.log('Updating provider with:', updates)
      
      // Always update local state immediately (no waiting for database)
      const newProviderData = {
        ...provider, 
        ...updates, 
        updated_at: new Date().toISOString()
      }
      setProvider(newProviderData)
      console.log('Provider updated locally immediately:', newProviderData)
      
      // Try to update in Supabase database synchronously
      try {
        const { data, error } = await supabase
          .from('providers')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', provider.id)
          .select()
          .single()
        
        if (!error && data) {
          console.log('Provider updated successfully in database:', data)
        } else {
          console.log('Supabase update failed:', error)
          // Fallback to local state only if database fails
        }
      } catch (supabaseError) {
        console.log('Supabase update failed:', supabaseError)
      }
      
    } catch (error) {
      console.error('Error in updateProvider:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6]">
      {/* Dashboard nebo hlavní stránka */}
      {showDashboard && provider ? (
        <ProviderOverviewDashboard 
          provider={provider}
          onClose={() => setShowDashboard(false)} 
          onNavigate={handleNavigate}
          onUpdateProvider={updateProvider}
          isDemo={true} // Set to false for production with real data
        />
      ) : showOffersManagement && provider ? (
        console.log('Rendering OffersManagement', { showOffersManagement, hasProvider: !!provider }),
        <OffersManagement
          provider={provider}
          onClose={() => setShowOffersManagement(false)} 
          onNavigate={handleNavigate}
          onUpdateProvider={updateProvider}
          isDemo={true} // Set to false for production with real data
        />
      ) : (
        <AppInner 
          onOfferClick={handleOfferClick}
          authMode={authMode}
          setAuthMode={setAuthMode}
          onNavigate={handleNavigate}
        />
      )}

      {/* Standalone profil (mimo dashboard) */}
      {!showDashboard && currentPage === 'profile' && provider && (
        <div key={`profile-${showProfileEdit ? 'edit' : 'view'}`} className="absolute top-0 left-0 w-full h-full bg-white z-50">
          {!showProfileEdit ? (
            <ProfileVizitka 
              provider={provider} 
              onEdit={() => {
                setShowProfileEdit(true)
              }}
              onOverview={() => {
                setShowDashboard(true)
                setCurrentPage('offers')
              }}
              onClose={() => setCurrentPage('offers')}
            />
          ) : (
            <ProfileEditVizitka 
              provider={provider} 
              onUpdate={updateProvider}
              onClose={() => {
                setShowProfileEdit(false)
              }}
            />
          )}
        </div>
      )}

      {selectedOffer && (
        <OfferDetail offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
      )}

      {authMode && (
        <AuthModal 
          mode={authMode} 
          onClose={() => setAuthMode(null)}
          onSwitch={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        />
      )}
    </div>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}