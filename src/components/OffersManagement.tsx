import { useState, useEffect } from 'react'
import { 
  Package, Plus, Edit, Eye, EyeOff, Archive, Trash2, 
  CheckCircle, XCircle, Clock, AlertTriangle, ArrowLeft,
  Filter, Grid3X3, List, X
} from '../components/icons'
import { Provider } from '../lib/supabase'

// Sage color palette
const SAGE = {
  light: '#E8F0E6',
  strong: '#DDEBE3', 
  navy: '#0F2A43'
}

interface Offer {
  id: string
  title: string
  category: string
  subcategory?: string
  price: number
  description: string
  imageUrl?: string
  status: 'active' | 'inactive' | 'archived'
  archiveReason?: 'expired' | 'reservation_completed' | 'cancelled_by_provider'
  archivedAt?: string
  createdAt: string
}

interface OffersManagementProps {
  provider: Provider
  onClose: () => void
  onNavigate: (page: string) => void
  onUpdateProvider?: (updates: Partial<Provider>) => Promise<void>
  isDemo?: boolean
}

const OFFER_STATUSES = [
  { value: 'all', label: 'Vše', color: 'bg-gray-100 text-gray-800' },
  { value: 'active', label: 'Aktivní', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Neaktivní', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'archived', label: 'Archivované', color: 'bg-gray-100 text-gray-800' }
]

const ARCHIVE_REASONS = {
  expired: 'Vypršel termín',
  reservation_completed: 'Rezervace dokončena',
  cancelled_by_provider: 'Zrušeno poskytovatelem'
}

export function OffersManagement({ 
  provider, 
  onClose, 
  onNavigate, 
  onUpdateProvider,
  isDemo = true 
}: OffersManagementProps) {
  console.log('OffersManagement component loaded', { provider: !!provider, isDemo })
  const [offers, setOffers] = useState<Offer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadOffers()
  }, [provider])

  const loadOffers = async () => {
    console.log('Loading offers...', { isDemo })
    setLoading(true)
    
    try {
      if (isDemo) {
        console.log('Loading demo offers...')
        // Demo data - for development/testing
        const mockOffers: Offer[] = [
          {
            id: 'offer-1',
            title: 'Profesionální manikúra',
            category: 'Beauty',
            subcategory: 'Nails',
            price: 800,
            description: 'Kompletní péče o nehty s gelovým lakem a výživou',
            imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop',
            status: 'active',
            createdAt: '2024-12-01'
          },
          {
            id: 'offer-2',
            title: 'Relaxační masáž zad',
            category: 'Wellness',
            subcategory: 'Massage',
            price: 1200,
            description: '60 minut hluboké relaxace a uvolnění sádou',
            imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
            status: 'active',
            createdAt: '2024-11-28'
          },
          {
            id: 'offer-3',
            title: 'Lash lifting + brow shape',
            category: 'Beauty',
            subcategory: 'Eyes',
            price: 1500,
            description: 'Nejnovější trend v péči o řasy a obočí',
            imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
            status: 'inactive',
            createdAt: '2024-11-25'
          },
          {
            id: 'offer-4',
            title: 'Čištění pleti s oxygeneací',
            category: 'Beauty',
            subcategory: 'Facial',
            price: 900,
            description: 'Intenzivní čištění s kyslíkem pro zářivou pleť',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
            status: 'archived',
            archiveReason: 'expired',
            archivedAt: '2024-12-10',
            createdAt: '2024-11-20'
          },
          {
            id: 'offer-5',
            title: 'Parní lázeň s aromaterapií',
            category: 'Wellness',
            subcategory: 'Spa',
            price: 650,
            description: 'Uvolňující procedura s éterickými oleji',
            status: 'archived',
            archiveReason: 'reservation_completed',
            archivedAt: '2024-12-08',
            createdAt: '2024-11-15'
          }
        ]
        console.log('Setting offers:', mockOffers.length, 'offers')
        setOffers(mockOffers)
      } else {
        // Real data would come from Supabase
        setOffers([])
      }
    } catch (error) {
      console.error('Error loading offers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Filter effect triggered:', { filter, offersCount: offers.length })
    let filtered = offers

    if (filter === 'active') {
      filtered = offers.filter(offer => offer.status === 'active')
      console.log('Active filter result:', filtered.length, 'offers')
    } else if (filter === 'inactive') {
      filtered = offers.filter(offer => offer.status === 'inactive')
      console.log('Inactive filter result:', filtered.length, 'offers')
    } else if (filter === 'archived') {
      filtered = offers.filter(offer => offer.status === 'archived')
      console.log('Archived filter result:', filtered.length, 'offers')
    } else {
      console.log('All filter result:', filtered.length, 'offers')
    }

    setFilteredOffers(filtered)
  }, [offers, filter])

  const getStatusBadge = (offer: Offer) => {
    if (offer.status === 'active') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Aktivní</span>
    } else if (offer.status === 'inactive') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Neaktivní</span>
    } else {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Archivovaná</span>
    }
  }

  const handleStatusChange = (offerId: string, newStatus: 'active' | 'inactive' | 'archived') => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { 
            ...offer, 
            status: newStatus,
            ...(newStatus === 'archived' ? { 
              archiveReason: 'cancelled_by_provider' as const,
              archivedAt: new Date().toISOString().split('T')[0]
            } : {})
          }
        : offer
    ))
  }

  const handleRestore = (offerId: string) => {
    // Restoration would typically open edit form
    alert('Obnova nabídky by měla otevřít formulář pro editaci')
  }

  const handleDelete = (offerId: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== offerId))
    setShowDeleteConfirm(null)
  }

  const formatPrice = (price: number) => {
    return `${price} Kč`
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
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: SAGE.navy }}>Moje nabídky</h1>
                <p className="text-sm text-gray-600">Spravujte své nabídky a jejich stavy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Zpět na Přehled
              </button>
              <button
                onClick={() => onNavigate('offers-edit')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Přidat nabídku
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isDemo && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              DEMO DATA - Zobrazená data jsou pouze pro demonstraci
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {OFFER_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  console.log('Setting filter to:', status.value)
                  setFilter(status.value as any)
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === status.value
                    ? status.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Zobrazení:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offers Grid/List */}
        {filteredOffers.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                }`}
              >
                {/* Image */}
                <div className={`bg-gray-100 ${
                  viewMode === 'list' 
                    ? 'w-full sm:w-48 h-32 sm:h-auto' 
                    : 'h-48'
                } flex items-center justify-center overflow-hidden`}>
                  {offer.imageUrl ? (
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{offer.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{offer.category}</span>
                        {offer.subcategory && (
                          <>
                            <span>•</span>
                            <span>{offer.subcategory}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {getStatusBadge(offer)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{offer.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">{formatPrice(offer.price)}</span>
                    <span className="text-xs text-gray-500">
                      Vytvořeno {new Date(offer.createdAt).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>

                  {/* Archive Reason */}
                  {offer.status === 'archived' && offer.archiveReason && (
                    <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <strong>Důvod archivace:</strong> {ARCHIVE_REASONS[offer.archiveReason]}
                      </p>
                      {offer.archivedAt && (
                        <p className="text-xs text-gray-500">
                          Archivováno {new Date(offer.archivedAt).toLocaleDateString('cs-CZ')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onNavigate('offers-edit')}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      Upravit
                    </button>

                    {offer.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(offer.id, 'inactive')}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <EyeOff className="w-3 h-3" />
                        Deaktivovat
                      </button>
                    ) : offer.status === 'inactive' ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(offer.id, 'active')}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Aktivovat
                        </button>
                        <button
                          onClick={() => handleStatusChange(offer.id, 'archived')}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Archive className="w-3 h-3" />
                          Archivovat
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRestore(offer.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Obnovit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(offer.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Smazat
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            {filter === 'all' ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Zatím nemáte žádné nabídky</h3>
                <p className="text-gray-600 mb-6">Vytvořte svou první nabídku a začněte získávat zákazníky</p>
                <button
                  onClick={() => onNavigate('offers-edit')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Přidat první nabídku
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Žádné {OFFER_STATUSES.find(s => s.value === filter)?.label.toLowerCase()} nabídky
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'active' && 'Aktivujte nebo vytvořte novou nabídku pro získávání zákazníků'}
                  {filter === 'inactive' && 'Neaktivní nabídky se zde nezobrazují'}
                  {filter === 'archived' && 'Archivované nabídky se zobrazují zde'}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setFilter('all')}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Zobrazit všechny nabídky
                  </button>
                  <button
                    onClick={() => onNavigate('offers-edit')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Vytvořit nabídku
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Smazat nabídku</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Opravdu chcete tuto nabídku smazat natrvalo? Tuto akci nelze vrátit zpět.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Smazat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}