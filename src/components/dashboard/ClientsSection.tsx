import { useState } from 'react'
import { Users, Calendar, Clock, Phone, Mail, Check, X, MessageSquare, Download, ChevronDown } from '@/components/icons'
import { supabase, Reservation } from '../../lib/supabase'

interface ClientsSectionProps {
  reservations: Reservation[]
  providerId: string
  onRefresh: () => void
}

export function ClientsSection({ reservations, providerId, onRefresh }: ClientsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter)

  const pendingCount = reservations.filter(r => r.status === 'pending').length
  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length
  const completedCount = reservations.filter(r => r.status === 'completed').length

  const updateStatus = async (id: string, status: Reservation['status']) => {
    await supabase.from('reservations').update({ status }).eq('id', id)
    onRefresh()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ceka na potvrzeni'
      case 'confirmed': return 'Potvrzeno'
      case 'completed': return 'Dokonceno'
      case 'cancelled': return 'Zruseno'
      default: return status
    }
  }

  // Get unique clients
  const uniqueClients = Array.from(new Set(reservations.map(r => r.client_email)))
    .map(email => {
      const clientReservations = reservations.filter(r => r.client_email === email)
      return {
        email,
        name: clientReservations[0]?.client_name || 'Neznamy',
        phone: clientReservations[0]?.client_phone,
        reservationCount: clientReservations.length,
        lastReservation: clientReservations[0]?.created_at
      }
    })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{uniqueClients.length}</div>
              <div className="text-sm text-gray-500">Klientu</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
              <div className="text-sm text-gray-500">Cekajicich</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
              <div className="text-sm text-gray-500">Potvrzenych</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
              <div className="text-sm text-gray-500">Dokoncenych</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reservations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Rezervace</h2>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Vsechny ({reservations.length})</option>
                <option value="pending">Cekajici ({pendingCount})</option>
                <option value="confirmed">Potvrzene ({confirmedCount})</option>
                <option value="completed">Dokoncene ({completedCount})</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filteredReservations.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredReservations.map((res) => (
                  <div key={res.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                          {res.client_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{res.client_name}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(res.reservation_date).toLocaleDateString('cs-CZ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {res.reservation_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <a href={`tel:${res.client_phone}`} className="flex items-center gap-1 hover:text-emerald-700">
                              <Phone className="w-3 h-3" />
                              {res.client_phone}
                            </a>
                            <a href={`mailto:${res.client_email}`} className="flex items-center gap-1 hover:text-emerald-700">
                              <Mail className="w-3 h-3" />
                              {res.client_email}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(res.status)}`}>
                          {getStatusLabel(res.status)}
                        </span>
                        {res.status === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateStatus(res.id, 'confirmed')}
                              className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              title="Potvrdit"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(res.id, 'cancelled')}
                              className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Zrusit"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(res.id, 'completed')}
                            className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Oznacit jako dokoncene"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>Zadne rezervace</p>
              </div>
            )}
          </div>
        </div>

        {/* Clients CRM */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Klienti</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {uniqueClients.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {uniqueClients.map((client, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{client.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{client.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-600">{client.reservationCount}x</div>
                        <div className="text-xs text-gray-500">rezervaci</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <a href={`tel:${client.phone}`} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200">
                        <Phone className="w-3 h-3" />
                        Volat
                      </a>
                      <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-600 rounded text-sm hover:bg-emerald-700">
                        <MessageSquare className="w-3 h-3" />
                        Zprava
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>Zatim zadni klienti</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
