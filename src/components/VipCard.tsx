import { MapPin, Eye, Star, Clock, Tag } from '../components/icons'
import { Offer } from '../lib/supabase'

interface VipCardProps {
  offer: Offer
  onClick: () => void
}

export function VipCard({ offer, onClick }: VipCardProps) {
  const discount = offer.discount || (offer.old_price && offer.new_price 
    ? Math.round((1 - offer.new_price / offer.old_price) * 100) 
    : 0)

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-300 hover:border-gray-400"
    >
      <div className="relative">
        <div className="aspect-[16/10] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          {offer.image_url ? (
            <img 
              src={offer.image_url} 
              alt={offer.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white/50 text-6xl font-bold">{offer.title.charAt(0)}</div>
          )}
        </div>
        
        {/* VIP Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3" />
            VIP
          </span>
          {offer.top && (
            <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
              TOP
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
            -{discount}%
          </div>
        )}

        {/* Promo */}
        {offer.promo && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">{offer.promo}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2">
            {offer.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {offer.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {offer.location}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {offer.views_count || 0}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {new Date(offer.created_at).toLocaleDateString('cs-CZ')}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {offer.old_price && offer.old_price > (offer.new_price || offer.price) && (
              <span className="text-gray-400 line-through text-sm">
                {offer.old_price} Kc
              </span>
            )}
            <span className="text-2xl font-bold text-blue-900">
              {offer.new_price || offer.price} Kc
            </span>
          </div>
          <span className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg group-hover:bg-gray-700 transition-colors">
            Zobrazit
          </span>
        </div>
      </div>
    </div>
  )
}
