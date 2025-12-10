// Database types and service
// Implementation for ASPETi application

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
    // Dočasně vracíme prázdný výsledek dokud nemáme Supabase credentials
    return []
  }

  // Získání jedné nabídky podle ID
  static async getOfferById(id: string) {
    // Dočasně vracíme null dokud nemáme Supabase credentials
    return null
  }

  // Inkrementace počtu zobrazení nabídky
  static async incrementOfferViews(offerId: string) {
    // Dočasně neimplementováno
    return
  }

  // Vytvoření nové nabídky (pro poskytovatele)
  static async createOffer(offerData: Omit<Offer, 'id' | 'created_at' | 'updated_at' | 'views_count'>) {
    // Dočasně neimplementováno
    return null
  }

  // Aktualizace nabídky
  static async updateOffer(id: string, updates: Partial<Offer>) {
    // Dočasně neimplementováno
    return null
  }

  // Smazání nabídky (soft delete)
  static async deleteOffer(id: string) {
    // Dočasně neimplementováno
    return
  }

  // Získání rezervací pro poskytovatele
  static async getProviderReservations(providerId: string) {
    // Dočasně neimplementováno
    return []
  }

  // Aktualizace stavu rezervace
  static async updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    // Dočasně neimplementováno
    return null
  }

  // Získání zpráv pro poskytovatele
  static async getProviderMessages(providerId: string) {
    // Dočasně neimplementováno
    return []
  }

  // Označení zprávy jako přečtené
  static async markMessageAsRead(id: string) {
    // Dočasně neimplementováno
    return null
  }

  // Získání statistik poskytovatele
  static async getProviderStats(providerId: string) {
    // Dočasně neimplementováno
    return null
  }
}