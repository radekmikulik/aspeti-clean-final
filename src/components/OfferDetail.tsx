import { X, MapPin, Clock, Eye, Star, Phone, Mail, Calendar } from '../components/icons'
import { Offer } from '../lib/supabase'

interface OfferDetailProps {
  offer: Offer
  onClose: () => void
}

export function OfferDetail({ offer, onClose }: OfferDetailProps) {
  const discount = offer.discount || (offer.old_price && offer.new_price 
    ? Math.round((1 - offer.new_price / offer.old_price) * 100) 
    : 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-emerald-500 to-[#4a7a66] flex items-center justify-center">
            {offer.image_url ? (
              <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-white/50 text-8xl font-bold">{offer.title.charAt(0)}</div>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {offer.vip && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
              <Star className="w-4 h-4" />
              VIP
            </div>
          )}

          {discount > 0 && (
            <div className="absolute bottom-4 right-4 px-4 py-2 bg-red-500 text-white text-lg font-bold rounded-lg">
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 text-sm font-medium rounded-full mb-2 capitalize">
                {offer.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900">{offer.title}</h2>
            </div>
            <div className="text-right">
              {offer.old_price && offer.old_price > (offer.new_price || offer.price) && (
                <div className="text-gray-400 line-through">{offer.old_price} Kc</div>
              )}
              <div className="text-3xl font-bold text-emerald-600">
                {offer.new_price || offer.price} Kc
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {offer.location}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {offer.views_count || 0} zobrazeni
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(offer.created_at).toLocaleDateString('cs-CZ')}
            </div>
          </div>

          {offer.promo && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <p className="text-amber-800 font-medium">{offer.promo}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Popis</h3>
            <p className="text-gray-600 leading-relaxed">{offer.description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
              <Calendar className="w-5 h-5" />
              Rezervovat
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-100 transition-colors">
              <Phone className="w-5 h-5" />
              Kontakt
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Mail className="w-5 h-5" />
              Zprava
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
