import { 
  MapPin, Phone, Mail, Globe, Instagram, Facebook, Award, Star, Clock, Shield, Edit3
} from '../components/icons'
import { Provider } from '../lib/supabase'

const CATEGORIES = [
  { id: 'beauty', label: 'Beauty' },
  { id: 'gastro', label: 'Gastro' },
  { id: 'ubytovani', label: 'Ubytování' },
  { id: 'reality', label: 'Reality' },
  { id: 'remesla', label: 'Řemesla' },
]

interface ProfileViewPageProps {
  provider: Provider
  onEdit: () => void
  onClose: () => void
}

export function ProfileViewPage({ provider, onEdit, onClose }: ProfileViewPageProps) {
  const getCategoryLabel = (id: string) => {
    return CATEGORIES.find(cat => cat.id === id)?.label || id
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] to-[#ecfdf5]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Identita a Profil</h1>
              <p className="text-gray-600">Přehled informací o vašem podniku</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onEdit}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
              >
                <Edit3 className="w-5 h-5" />
                UPRAVIT
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            {/* Cover Photo */}
            <div className="relative h-80 bg-gradient-to-r from-emerald-400 to-teal-500">
              {provider.cover_url ? (
                <img src={provider.cover_url} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Provider Info Overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-end gap-6">
                  {/* Logo */}
                  <div className="w-32 h-32 rounded-2xl bg-white shadow-2xl overflow-hidden border-4 border-white flex-shrink-0">
                    {provider.logo_url ? (
                      <img src={provider.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 text-4xl font-bold">
                        {provider.business_name?.charAt(0) || 'S'}
                      </div>
                    )}
                  </div>
                  
                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                      {provider.business_name || 'Název vašeho podniku'}
                    </h2>
                    <p className="text-xl text-white/90 mb-3 drop-shadow">
                      {provider.slogan || 'Přidejte slogan pro váš podnik'}
                    </p>
                    <div className="flex items-center gap-4">
                      {provider.is_verified && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm rounded-full">
                          <Shield className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-medium">Ověřený</span>
                        </div>
                      )}
                      {provider.flash_offer_active && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full">
                          <Clock className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-medium">Flash nabídka</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">O nás</h3>
                <div className="space-y-6">
                  {provider.description && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Popis</h4>
                      <p className="text-gray-600 leading-relaxed">{provider.description}</p>
                    </div>
                  )}
                  {provider.about_me && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Více o nás</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{provider.about_me}</p>
                    </div>
                  )}
                  {provider.pricing_info && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Ceník</h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{provider.pricing_info}</p>
                    </div>
                  )}
                  {!provider.description && !provider.about_me && !provider.pricing_info && (
                    <p className="text-gray-400 italic">Zatím nebyly přidány žádné informace</p>
                  )}
                </div>
              </div>

              {/* Gallery */}
              {provider.gallery_urls && provider.gallery_urls.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Galerie</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {provider.gallery_urls.map((url, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-md">
                        <img src={url} alt={`Galerie ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Kontakt</h3>
                <div className="space-y-4">
                  {provider.city && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{provider.city}</p>
                        {provider.address && <p className="text-sm text-gray-500">{provider.address}</p>}
                      </div>
                    </div>
                  )}
                  {provider.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      <a href={`tel:${provider.phone}`} className="hover:text-emerald-600 transition-colors">
                        {provider.phone}
                      </a>
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-5 h-5 text-emerald-600" />
                      <a href={`mailto:${provider.email}`} className="hover:text-emerald-600 transition-colors">
                        {provider.email}
                      </a>
                    </div>
                  )}
                  {provider.website_url && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Globe className="w-5 h-5 text-emerald-600" />
                      <a 
                        href={provider.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-emerald-600 transition-colors truncate"
                      >
                        {provider.website_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {provider.categories && provider.categories.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Kategorie</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.categories.map((catId) => (
                      <span 
                        key={catId}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                      >
                        {getCategoryLabel(catId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Flash Offer */}
              {provider.flash_offer_active && provider.flash_offer_text && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Flash nabídka
                  </h3>
                  <p className="text-amber-700 font-medium">{provider.flash_offer_text}</p>
                  <p className="text-xs text-amber-600 mt-2">Stojí 2 Kč/den z kreditu</p>
                </div>
              )}

              {/* Certificates */}
              {provider.certificates && provider.certificates.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    Certifikáty
                  </h3>
                  <div className="space-y-3">
                    {provider.certificates.map((cert, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                        <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credits */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-3">Kredit</h3>
                <div className="text-3xl font-bold mb-1">{provider.credits || 0} Kč</div>
                <p className="text-emerald-100 text-sm">Aktuální zůstatek</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}