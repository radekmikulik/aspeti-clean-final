import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Tag, MapPin, Save, X, Loader2 } from '@/components/icons'
import { supabase, Offer } from '../../lib/supabase'

const CATEGORIES = ['beauty', 'gastro', 'ubytovani', 'reality', 'remesla']

interface OffersSectionProps {
  offers: Offer[]
  providerId: string
  onRefresh: () => void
}

export function OffersSection({ offers, providerId, onRefresh }: OffersSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'beauty',
    price: 0,
    old_price: 0,
    location: '',
    promo: '',
    vip: false,
  })

  const activeOffers = offers.filter(o => o.is_active)
  const inactiveOffers = offers.filter(o => !o.is_active)

  const openForm = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer)
      setFormData({
        title: offer.title,
        description: offer.description,
        category: offer.category,
        price: offer.new_price || offer.price,
        old_price: offer.old_price || 0,
        location: offer.location,
        promo: offer.promo || '',
        vip: offer.vip,
      })
    } else {
      setEditingOffer(null)
      setFormData({
        title: '',
        description: '',
        category: 'beauty',
        price: 0,
        old_price: 0,
        location: '',
        promo: '',
        vip: false,
      })
    }
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const offerData = {
      provider_id: providerId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      old_price: formData.old_price || null,
      new_price: formData.old_price ? formData.price : null,
      discount: formData.old_price ? Math.round((1 - formData.price / formData.old_price) * 100) : 0,
      location: formData.location,
      promo: formData.promo || null,
      vip: formData.vip,
      is_active: true,
    }

    if (editingOffer) {
      await supabase.from('offers').update(offerData).eq('id', editingOffer.id)
    } else {
      await supabase.from('offers').insert(offerData)
    }

    setSaving(false)
    setShowForm(false)
    onRefresh()
  }

  const toggleActive = async (offer: Offer) => {
    await supabase.from('offers').update({ is_active: !offer.is_active }).eq('id', offer.id)
    onRefresh()
  }

  const deleteOffer = async (id: string) => {
    if (confirm('Opravdu smazat tuto nabidku?')) {
      await supabase.from('offers').delete().eq('id', id)
      onRefresh()
    }
  }

  const OfferCard = ({ offer }: { offer: Offer }) => (
    <div className={`bg-white rounded-xl p-4 border ${offer.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-emerald-600 to-[#4a7a66] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {offer.title.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold truncate ${offer.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
              {offer.title}
            </h3>
            {offer.vip && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded flex items-center gap-1">
                <Star className="w-3 h-3" />
                VIP
              </span>
            )}
            {!offer.is_active && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                Neaktivni
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            <span className="capitalize">{offer.category}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {offer.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {offer.old_price && (
              <span className="text-gray-400 line-through text-sm">{offer.old_price} Kc</span>
            )}
            <span className="font-bold text-emerald-600">{offer.new_price || offer.price} Kc</span>
            {offer.discount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                -{offer.discount}%
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            {offer.views_count || 0}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {offer.is_active ? 'Stoji 10 Kc/den' : 'Pozastaveno - nestoji nic'}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleActive(offer)}
            className={`p-2 rounded-lg ${offer.is_active ? 'text-gray-500 hover:bg-gray-100' : 'text-green-600 hover:bg-green-50'}`}
            title={offer.is_active ? 'Pozastavit' : 'Aktivovat'}
          >
            {offer.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => openForm(offer)}
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteOffer(offer.id)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-3xl font-bold text-emerald-600">{offers.length}</div>
          <div className="text-sm text-gray-500">Celkem nabidek</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-3xl font-bold text-green-600">{activeOffers.length}</div>
          <div className="text-sm text-gray-500">Aktivnich</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-3xl font-bold text-gray-400">{inactiveOffers.length}</div>
          <div className="text-sm text-gray-500">Pozastavenych</div>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Vase nabidky</h2>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-5 h-5" />
          Nova nabidka
        </button>
      </div>

      {/* Active Offers */}
      {activeOffers.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Aktivni nabidky</h3>
          <div className="grid gap-4">
            {activeOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Offers */}
      {inactiveOffers.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Pozastavene nabidky</h3>
          <div className="grid gap-4">
            {inactiveOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      )}

      {offers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Zatim nematte zadne nabidky</p>
          <button
            onClick={() => openForm()}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg"
          >
            Vytvorit prvni nabidku
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingOffer ? 'Upravit nabidku' : 'Nova nabidka'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nazev</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Luxusni masaz 90min"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Popis</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lokalita</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Praha"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cena (Kc)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Puvodni cena</label>
                  <input
                    type="number"
                    value={formData.old_price || ''}
                    onChange={(e) => setFormData({ ...formData, old_price: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Pro slevu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Promo text</label>
                <input
                  type="text"
                  value={formData.promo}
                  onChange={(e) => setFormData({ ...formData, promo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="1+1 zdarma pro pary"
                />
              </div>

              <label className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.vip}
                  onChange={(e) => setFormData({ ...formData, vip: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-medium text-amber-700">VIP nabidka</span>
                  <p className="text-xs text-amber-600">Zvyraznena pozice, stoji 20 Kc/den navic</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                Zrusit
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.price}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Ulozit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
