import { 
  MapPin, Phone, Mail, Globe, Instagram, Facebook, Award, Star, Clock, Shield, Edit3, Camera, Image, Tag, Globe2, Users, CheckCircle, Settings, User
} from '../components/icons'
import { Provider } from '../lib/supabase'

const CATEGORIES = [
  { id: 'beauty', label: 'Beauty & Wellbeing' },
  { id: 'gastro', label: 'Gastronomie' },
  { id: 'ubytovani', label: 'Ubytování' },
  { id: 'reality', label: 'Reality' },
  { id: 'remesla', label: 'Řemesla' },
]

// Sage color palette from specification
const SAGE = {
  light: '#E8F0E6',
  strong: '#DDEBE3', 
  navy: '#0F2A43'
}

interface ProfileVizitkaProps {
  provider: Provider
  onEdit: () => void
  onOverview: () => void
  onClose: () => void
}

export function ProfileVizitka({ provider, onEdit, onOverview, onClose }: ProfileVizitkaProps) {
  const getCategoryLabel = (id: string) => {
    return CATEGORIES.find(cat => cat.id === id)?.label || id
  }

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-white overflow-y-auto">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold" style={{ color: SAGE.navy }}></h1>
              <p className="text-sm text-gray-600"></p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOverview}
                className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all"
                style={{ backgroundColor: SAGE.navy }}
              >
                Přehled
              </button>
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-2"
                style={{ backgroundColor: SAGE.strong }}
              >
                <Edit3 className="w-4 h-4" />
                Upravit
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Section (velmi kompaktní výška) */}
      <div className="relative w-full" style={{ aspectRatio: '16/2', backgroundColor: SAGE.light }}>
        {/* Cover Background */}
        <div className="absolute inset-0 bg-gradient-to-br" style={{ 
          background: provider.cover_url 
            ? `linear-gradient(rgba(15, 42, 67, 0.1), rgba(202, 216, 208, 0.3)), url(${provider.cover_url})`
            : `linear-gradient(135deg, ${SAGE.light} 0%, ${SAGE.strong} 100%)`
        }}></div>
        
        {/* Logo a název firmy - vodorovně vedle sebe */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
          {/* Logo - zvětšené a zviditelněné */}
          <div className="relative">
            <div className="w-28 h-28 rounded-xl border-3 border-white shadow-xl overflow-hidden bg-white">
              {provider.profile_image_url ? (
                <img src={provider.profile_image_url} alt="Profilová fotka" className="w-full h-full object-cover" />
              ) : provider.logo_url ? (
                <img src={provider.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-600 text-2xl font-bold">
                  {provider.business_name?.charAt(0) || 'S'}
                </div>
              )}
            </div>
          </div>
          
          {/* Název firmy - hlavní priorita */}
          <div>
            <h2 
              className="text-4xl font-bold mb-2"
              style={{ color: SAGE.navy }}
            >
              {provider.business_name || 'Název podniku'}
            </h2>
            {provider.slogan && (
              <div className="flex items-center gap-2">
                <span 
                  className="text-lg italic"
                  style={{ color: SAGE.navy, opacity: 0.9 }}
                >
                  "{provider.slogan}"
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lokace a ověření - pravá strana */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <div className="flex items-center gap-4">
            {provider.city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: SAGE.navy }} />
                <span 
                  className="text-base font-medium"
                  style={{ color: SAGE.navy }}
                >
                  {provider.city}
                </span>
              </div>
            )}
            {provider.is_verified && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-base font-medium text-green-700">Ověřený</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Malý spacer */}
      <div className="h-4"></div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content - Left */}
          <div className="flex-1 space-y-8">

            {/* O společnosti Section */}
            {(provider.description || provider.about_me || provider.content_blocks?.about) && 
             (provider.content_blocks?.visibility?.about ?? true) && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="flex gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-6" style={{ color: SAGE.navy }}>
                      {provider.content_blocks?.section_titles?.about || 'O společnosti'}
                    </h3>
                    <div className="space-y-6">
                  {/* Legacy description */}
                  {provider.description && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Krátký popis</h4>
                      <p className="text-gray-600 leading-relaxed">{provider.description}</p>
                    </div>
                  )}
                  {provider.about_me && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Detailní informace</h4>
                      <div className="text-gray-600 leading-relaxed whitespace-pre-line">{provider.about_me}</div>
                    </div>
                  )}
                  
                  {/* Content Blocks */}
                  {provider.content_blocks?.about && provider.content_blocks.about.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="font-medium text-gray-700">Obsahové bloky</h4>
                      {provider.content_blocks.about.map((block, i) => (
                        <div key={block.id} className="space-y-4">
                          {block.type === 'text' && block.content && (
                            <p className="text-gray-600 leading-relaxed">{block.content}</p>
                          )}
                          {block.type === 'image' && block.imageUrl && (
                            <div className="w-1/3 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                              <img 
                                src={block.imageUrl} 
                                alt={block.imageAlt || `O mně ${i + 1}`} 
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" 
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Legacy gallery fallback */}
                  {(!provider.content_blocks?.about || provider.content_blocks.about.length === 0) && provider.gallery_urls && provider.gallery_urls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      {provider.gallery_urls.slice(0, 3).map((url, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <img 
                            src={url} 
                            alt={`O mně ${i + 1}`} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                    </div>
                  </div>
                  
                  {/* Right Sidebar - Základní informace a Kontakt */}
                  <div className="w-80 space-y-6">
                    {/* Základní informace */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: SAGE.navy }}>
                        <User className="w-4 h-4" style={{ color: SAGE.navy }} />
                        Základní informace
                      </h3>
                      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm" style={{ backgroundColor: SAGE.light }}>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Tag className="w-5 h-5" style={{ color: SAGE.navy }} />
                            <div>
                              <p className="text-sm text-gray-600">Název podniku</p>
                              <p className="font-medium text-gray-900">{provider.business_name || 'Neuvedeno'}</p>
                            </div>
                          </div>
                          {provider.slogan && (
                            <div className="flex items-start gap-3">
                              <Tag className="w-5 h-5 mt-1" style={{ color: SAGE.navy }} />
                              <div>
                                <p className="text-sm text-gray-600">Slogan</p>
                                <p className="font-medium text-gray-900 italic">{provider.slogan}</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-3">
                            <Tag className="w-5 h-5 mt-1" style={{ color: SAGE.navy }} />
                            <div>
                              <p className="text-sm text-gray-600">Kategorie</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span 
                                  className="px-3 py-1 rounded-full text-sm font-medium"
                                  style={{ backgroundColor: SAGE.light, color: SAGE.navy }}
                                >
                                  {getCategoryLabel(provider.categories?.[0] || 'beauty')}
                                </span>
                                {provider.categories && provider.categories.slice(1).map((cat, i) => (
                                  <span 
                                    key={i}
                                    className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                  >
                                    {getCategoryLabel(cat)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Kontakt */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: SAGE.navy }}>
                        <Phone className="w-4 h-4" style={{ color: SAGE.navy }} />
                        Kontakt
                      </h3>
                      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm" style={{ backgroundColor: SAGE.light }}>
                        <div className="space-y-4">
                          {provider.phone && (
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5" style={{ color: SAGE.navy }} />
                              <div>
                                <p className="text-sm text-gray-600">Telefon</p>
                                <a href={`tel:${provider.phone}`} className="text-sm text-blue-600 hover:underline">
                                  {provider.phone}
                                </a>
                              </div>
                            </div>
                          )}
                          {provider.email && (
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5" style={{ color: SAGE.navy }} />
                              <div>
                                <p className="text-sm text-gray-600">E-mail</p>
                                <a href={`mailto:${provider.email}`} className="text-sm text-blue-600 hover:underline">
                                  {provider.email}
                                </a>
                              </div>
                            </div>
                          )}
                          {provider.website_url && (
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5" style={{ color: SAGE.navy }} />
                              <div>
                                <p className="text-sm text-gray-600">Web</p>
                                <a 
                                  href={provider.website_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline truncate"
                                >
                                  {provider.website_url.replace(/^https?:\/\//, '')}
                                </a>
                              </div>
                            </div>
                          )}
                          {provider.city && (
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5" style={{ color: SAGE.navy }} />
                              <div>
                                <p className="text-sm text-gray-600">Lokace</p>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{provider.city}</p>
                                  {provider.address && (
                                    <p className="text-xs text-gray-600">{provider.address}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prostory Section */}
            {(provider.gallery_urls?.length > 0 || provider.content_blocks?.space) && 
             (provider.content_blocks?.visibility?.space ?? true) && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ color: SAGE.navy }}>
                  {provider.content_blocks?.section_titles?.space || 'Prostory'}
                </h3>
                
                {/* Content Blocks for Space */}
                {provider.content_blocks?.space && provider.content_blocks.space.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {provider.content_blocks.space.map((block, i) => (
                      <div key={block.id} className="space-y-4">
                        {block.type === 'image' && block.imageUrl && (
                          <div className="w-1/3 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                            <img 
                              src={block.imageUrl} 
                              alt={block.imageAlt || `Prostor ${i + 1}`} 
                              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" 
                            />
                          </div>
                        )}
                        {block.type === 'text' && block.content && (
                          <p className="text-gray-600 leading-relaxed">{block.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Legacy gallery fallback */}
                {(!provider.content_blocks?.space || provider.content_blocks.space.length === 0) && provider.gallery_urls && provider.gallery_urls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {provider.gallery_urls.map((url, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <img 
                          src={url} 
                          alt={`Prostor ${i + 1}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-4">
                  Fotografie interiéru a prostor podniku
                </p>
              </div>
            )}

            {/* Tým Section */}
            {(provider.content_blocks?.team_members?.length > 0 || 
              provider.content_blocks?.team?.length > 0 || 
              provider.certificates?.length > 0) && 
             (provider.content_blocks?.visibility?.team ?? true) && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-6" style={{ color: SAGE.navy }}>
                {provider.content_blocks?.section_titles?.team || 'Tým'}
              </h3>
              
              {/* Team Members - NEW FORMAT */}
              {provider.content_blocks?.team_members && provider.content_blocks.team_members.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {provider.content_blocks.team_members.map((member) => (
                    <div key={member.id} className="text-center">
                      {member.photo ? (
                        <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border-2 border-gray-200">
                          <img 
                            src={member.photo} 
                            alt={member.photoAlt || member.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center border-2 border-gray-200">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-700">{member.name}</p>
                        {member.role && (
                          <p className="text-xs text-gray-500">{member.role}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : provider.content_blocks?.team && provider.content_blocks.team.length > 0 ? (
                /* Legacy content blocks fallback */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {provider.content_blocks.team.map((block, i) => (
                    <div key={block.id} className="text-center">
                      {block.type === 'image' && block.imageUrl ? (
                        <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border-2 border-gray-200">
                          <img 
                            src={block.imageUrl} 
                            alt={block.imageAlt || `Člen týmu ${i + 1}`}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center border-2 border-gray-200">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      {block.content && (
                        <p className="text-sm font-medium text-gray-700">{block.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : provider.certificates && provider.certificates.length > 0 ? (
                /* Legacy certificates fallback */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {provider.certificates.slice(0, 4).map((cert, i) => (
                    <div key={i} className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center border-2 border-gray-200">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">{cert}</p>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">Zatím žádní členové týmu</p>
                  <p className="text-sm text-gray-500">Přidejte členy týmu v sekci Úprava profilu</p>
                </div>
              )}
            </div>
            )}

            {/* Certifikace Section */}
            {(provider.certificates?.length > 0 || provider.content_blocks?.certs) && 
             (provider.content_blocks?.visibility?.certs ?? true) && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3" style={{ color: SAGE.navy }}>
                  <Award className="w-6 h-6" />
                  {provider.content_blocks?.section_titles?.certs || 'Certifikace a kvalifikace'}
                </h3>
                
                {/* Content Blocks for Certifications */}
                {provider.content_blocks?.certs && provider.content_blocks.certs.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {provider.content_blocks.certs.map((block, i) => (
                      <div key={block.id} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: SAGE.light }}
                        >
                          <Award className="w-6 h-6" style={{ color: SAGE.navy }} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{block.content || `Certifikát ${i + 1}`}</p>
                          <p className="text-sm text-gray-600">Profesionální certifikát</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Legacy certificates fallback */}
                {(!provider.content_blocks?.certs || provider.content_blocks.certs.length === 0) && provider.certificates && provider.certificates.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {provider.certificates.map((cert, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: SAGE.light }}
                        >
                          <Award className="w-6 h-6" style={{ color: SAGE.navy }} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{cert}</p>
                          <p className="text-sm text-gray-600">Profesionální certifikát</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pricing Section */}
            {provider.pricing_info && (provider.content_blocks?.visibility?.pricing ?? true) && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ color: SAGE.navy }}>Ceník služeb</h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {provider.pricing_info}
                </div>
              </div>
            )}

            {/* Flash Offer Section */}
            {provider.flash_offer_active && provider.flash_offer_text && 
             (provider.content_blocks?.visibility?.flash_offer ?? true) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-semibold text-amber-800">Aktuální nabídka</h3>
                </div>
                <p className="text-amber-700 font-medium text-lg">{provider.flash_offer_text}</p>
              </div>
            )}
            {/* Gallery Section */}
            {provider.gallery_urls && provider.gallery_urls.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-semibold mb-6" style={{ color: SAGE.navy }}>Galerie</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {provider.gallery_urls.map((url, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                      <img 
                        src={url} 
                        alt={`Galerie ${i + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state if no content */}
            {!provider.description && !provider.about_me && !provider.pricing_info && 
             !provider.certificates?.length && !provider.gallery_urls?.length && 
             !provider.content_blocks?.about?.length && !provider.content_blocks?.space?.length && 
             !provider.content_blocks?.team?.length && !provider.content_blocks?.certs?.length && 
             !provider.flash_offer_active && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                  <Edit3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Zatím prázdný profil</h3>
                <p className="text-gray-600 mb-6">Přidejte informace o vašem podniku, abyste přilákali více zákazníků.</p>
                <button
                  onClick={onEdit}
                  className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
                  style={{ backgroundColor: SAGE.strong }}
                >
                  <Edit3 className="w-4 h-4" />
                  Začít upravovat
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Právní a provozní informace - dolů */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4" style={{ color: SAGE.navy }}>Právní a provozní informace</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Storno zásady</h5>
                <p className="text-gray-600">
                  {provider.pricing_info?.includes('storno') ? 
                    'Storno podle individuální dohody' : 
                    'Storno podle obchodních podmínek'
                  }
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Dostupnost</h5>
                <p className="text-gray-600">Informace o otevírací době a dostupnosti služeb</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}