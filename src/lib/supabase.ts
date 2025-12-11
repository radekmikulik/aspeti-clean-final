// Database types and service
// Implementation for ASPETi application

import { createClient } from '@supabase/supabase-js'

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bwwulsqzujrokxmyepzg.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3d3Vsc3F6dWpyb2t4bXllcHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDY4MzksImV4cCI6MjA4MTAyMjgzOX0.OW9W0gg3jpgn1Wb6msswNHlq5RLpCfTbO-L30jILopI'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('🔌 Supabase connected to:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Offer {
  id: string
  title: string
  description: string
  price: number
  location: string
  category: string
  image_url?: string
  provider_id: string
  created_at: string
  updated_at: string
  is_active: boolean
  views_count: number
  vip: boolean
  provider?: {
    name: string
    rating: number
  }
}

export interface Reservation {
  id: string
  offer_id: string
  client_name: string
  client_phone: string
  client_email?: string
  reservation_date: string
  reservation_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  offer_id: string
  sender_name: string
  sender_email?: string
  message: string
  is_read: boolean
  created_at: string
}

export interface ProviderStats {
  id: string
  provider_id: string
  total_views: number
  total_clicks: number
  total_reservations: number
  total_messages: number
  today_views: number
  today_clicks: number
  today_reservations: number
  today_messages: number
  created_at: string
  updated_at: string
}

export class DatabaseService {
  
  // Získání všech nabídek s filtrováním
  static async getOffers(filters: {
    query?: string
    category?: string
    location?: string
    sortBy?: 'relevance' | 'priceAsc' | 'priceDesc' | 'rating'
  } = {}) {
    try {
      console.log('📊 DatabaseService.getOffers called with filters:', filters)
      
      let query = supabase
        .from('offers')
        .select(`
          *,
          provider:providers(name, rating)
        `)
        .eq('is_active', true)
      
      console.log('🔍 Starting database query...')

      // Filtrování podle vyhledávání
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
      }

      // Filtrování podle kategorie
      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      // Filtrování podle lokality
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      // Řazení
      switch (filters.sortBy) {
        case 'priceAsc':
          query = query.order('price', { ascending: true })
          break
        case 'priceDesc':
          query = query.order('price', { ascending: false })
          break
        case 'rating':
          query = query.order('provider.rating', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      console.log('📊 Query result:', { data, error })
      console.log('📈 Data length:', data?.length || 0)

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      console.log('✅ Returning data:', data?.length || 0, 'offers')
      return data || []
    } catch (error) {
      console.error('Chyba při načítání nabídek:', error)
      throw error
    }
  }

  // Získání jedné nabídky podle ID
  static async getOfferById(id: string) {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          provider:providers(name, rating)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Chyba při načítání nabídky:', error)
      throw error
    }
  }

  // Inkrementace počtu zobrazení nabídky
  static async incrementOfferViews(offerId: string) {
    try {
      // Nejprve načteme současnou hodnotu
      const { data: offer, error: fetchError } = await supabase
        .from('offers')
        .select('views_count')
        .eq('id', offerId)
        .single()

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError)
        throw fetchError
      }

      // Pak aktualizujeme s novou hodnotou
      const { error } = await supabase
        .from('offers')
        .update({ views_count: (offer?.views_count || 0) + 1 })
        .eq('id', offerId)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
    } catch (error) {
      console.error('Chyba při inkrementaci zobrazení:', error)
    }
  }

  // Vytvoření nové nabídky (pro poskytovatele)
  static async createOffer(offerData: Omit<Offer, 'id' | 'created_at' | 'updated_at' | 'views_count'>) {
    try {
      const { data, error } = await supabase
        .from('offers')
        .insert([offerData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Chyba při vytváření nabídky:', error)
      throw error
    }
  }

  // Aktualizace nabídky
  static async updateOffer(id: string, updates: Partial<Offer>) {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Chyba při aktualizaci nabídky:', error)
      throw error
    }
  }

  // Smazání nabídky (soft delete)
  static async deleteOffer(id: string) {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: false })
        .eq('id', id)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
    } catch (error) {
      console.error('Chyba při mazání nabídky:', error)
      throw error
    }
  }

  // Získání rezervací pro poskytovatele
  static async getProviderReservations(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          offer:offers(title, price, location)
        `)
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Chyba při načítání rezervací:', error)
      throw error
    }
  }

  // Aktualizace stavu rezervace
  static async updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Chyba při aktualizaci stavu rezervace:', error)
      throw error
    }
  }

  // Získání zpráv pro poskytovatele
  static async getProviderMessages(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          offer:offers(title)
        `)
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Chyba při načítání zpráv:', error)
      throw error
    }
  }

  // Označení zprávy jako přečtené
  static async markMessageAsRead(id: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Chyba při označování zprávy:', error)
      throw error
    }
  }

  // Získání statistik poskytovatele
  static async getProviderStats(providerId: string) {
    try {
      const { data, error } = await supabase
        .from('provider_stats')
        .select('*')
        .eq('provider_id', providerId)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Chyba při načítání statistik:', error)
      throw error
    }
  }
}