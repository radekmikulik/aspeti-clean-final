// ASPETi PLUS - Provider Profile Overview (Public View)
// KROK 8: FINÁLNÍ INTEGRACE - Veřejný náhled profilu

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DatabaseService } from '@/lib/supabase'

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

interface Offer {
  id: string
  title: string
  description: string
  price: number
  image_url?: string
  category: string
  is_active: boolean
}

export const ProviderProfileOverview: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const [profile, setProfile] = useState<ProviderProfile | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        
        // Mock profil data
        const mockProfile: ProviderProfile = {
          id: (id as string) || '11111111-1111-1111-1111-111111111111',
          name: 'Test Provider',
          description: 'Profesionální poskytovatel služeb s dlouholetou praxí. Specializuji se na kvalitní a spolehlivé služby pro naše klienty.',
          location: 'Praha, Česká republika',
          phone: '+420 123 456 789',
          email: 'test@example.com',
          website: 'https://testprovider.cz',
          verified: true,
          profile_completeness: 85,
          is_active: true,
          created_at: '2024-01-01T00:00:00Z'
        }
        
        // Mock nabídky
        const mockOffers: Offer[] = [
          {
            id: '1',
            title: 'Profesionální úklid domácnosti',
            description: 'Kompletní úklid vaší domácnosti včetně mytí oken a žehlení',
            price: 1500,
            category: 'Úklid',
            is_active: true
          },
          {
            id: '2',
            title: 'Zahradní práce',
            description: 'Údržba zahrady, sekání trávy, prořezávání stromů',
            price: 800,
            category: 'Zahrada',
            is_active: true
          }
        ]
        
        setProfile(mockProfile)
        setOffers(mockOffers)
        setLoading(false)
      } catch (error) {
        console.error('Error loading profile:', error)
        setLoading(false)
      }
    }

    loadProfile()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám profil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profil nenalezen</h2>
          <p className="text-gray-600 mb-4">Požadovaný profil neexistuje nebo není veřejně dostupný.</p>
          <Link href="/" className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors">
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header s cover obrázkem - specifikace: výška 240-320px + poloprůhledný sage-strong proužek */}
      <div className="relative h-80 bg-gradient-to-r from-sage via-sage-light to-sage-dark">
        {/* Overlay pro text */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Poloprůhledný sage-strong proužek 2px nad spodkem */}
        <div className="absolute bottom-2 left-0 right-0 h-2 bg-sage-strong opacity-80"></div>
        
        {/* Název a město uprostřed */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
            <p className="text-xl opacity-90">{profile.location}</p>
            {profile.verified && (
              <div className="mt-3 flex items-center justify-center">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Ověřený poskytovatel
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Back button */}
        <Link href="/" className="absolute top-4 left-4 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white backdrop-blur-sm transition-all">
          ← Zpět na hlavní
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Profil informace */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl text-white">👤</span>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">{profile.description}</p>
              
              {/* Kontaktní informace */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">📍</span>
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">📞</span>
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">✉️</span>
                  <span>{profile.email}</span>
                </div>
                {profile.website && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">🌐</span>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">
                      Webové stránky
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nabídky služeb */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Nabídky služeb</h3>
          
          {offers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Zatím žádné nabídky</h4>
              <p className="text-gray-600">Tento poskytovatel zatím nemá publikované žádné služby.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Promo štítek podle specifikace - pod fotkou, ne v overlay */}
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-sage-light to-sage flex items-center justify-center">
                      <span className="text-sage-dark text-6xl">🖼️</span>
                    </div>
                    {/* Promo štítek pod fotkou */}
                    {offer.category === 'Sleva' && (
                      <div className="absolute bottom-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                        🔥 Sleva 20%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{offer.title}</h4>
                      <span className="text-sage font-bold text-lg">{offer.price} Kč</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{offer.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-sage bg-opacity-10 text-sage-dark px-3 py-1 rounded-full text-sm font-medium">
                        {offer.category}
                      </span>
                      
                      <button className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors text-sm font-medium">
                        Rezervovat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA sekce */}
        <div className="mt-12 bg-gradient-to-r from-sage to-sage-dark rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Zajímá vás tato služba?</h3>
          <p className="text-sage-light mb-6">Kontaktujte poskytovatele přímo nebo si rezervujte termín</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-sage-dark rounded-lg hover:bg-gray-100 transition-colors font-medium">
              📞 Kontaktovat
            </button>
            <button className="px-6 py-3 bg-sage-dark text-white rounded-lg hover:bg-sage-darkest transition-colors font-medium">
              📅 Rezervovat termín
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}