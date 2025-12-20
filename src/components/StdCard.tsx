import { MapPin, Eye, Tag } from '../components/icons'
import { Offer } from '../lib/supabase'

interface StdCardProps {
  offer: Offer
  onClick: () => void
}

export function StdCard({ offer, onClick }: StdCardProps) {
  const discount = offer.discount || (offer.old_price && offer.new_price 
    ? Math.round((1 - offer.new_price / offer.old_price) * 100) 
    : 0)

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-400"
    >
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {offer.image_url ? (
            <img 
              src={offer.image_url} 
              alt={offer.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-400 text-4xl font-bold">{offer.title.charAt(0)}</div>
          )}
        </div>
        
        {/* Category Badge */}
        <span className="absolute top-2 left-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
          {offer.category}
        </span>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{discount}%
          </div>
        )}

        {/* Promo */}
        {offer.promo && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
            <div className="flex items-center gap-1 text-white text-xs">
              <Tag className="w-3 h-3" />
              {offer.promo}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2 mb-2">
          {offer.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {offer.location}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {offer.views_count || 0}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            {offer.old_price && offer.old_price > (offer.new_price || offer.price) && (
              <span className="text-gray-400 line-through text-xs">
                {offer.old_price} Kc
              </span>
            )}
            <span className="text-lg font-bold text-blue-900">
              {offer.new_price || offer.price} Kc
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
