import { useState, useEffect, useRef } from 'react'
import { 
  ArrowLeft, Camera, Upload, MapPin, Phone, Mail, Globe, Instagram, Facebook, Plus, X, Save, Check, Award, User
} from '../components/icons'
import { Provider, uploadProviderImage } from '../lib/supabase'

const CATEGORIES = [
  { id: 'beauty', label: 'Beauty' },
  { id: 'gastro', label: 'Gastro' },
  { id: 'ubytovani', label: 'Ubytovani' },
  { id: 'reality', label: 'Reality' },
  { id: 'remesla', label: 'Remesla' },
]

interface ProfileEditPageProps {
  provider: Provider
  onUpdate: (updates: Partial<Provider>) => Promise<void>
  onClose: () => void
}

export function ProfileEditPage({ provider, onUpdate, onClose }: ProfileEditPageProps) {
  const [formData, setFormData] = useState({
    business_name: provider.business_name || '',
    slogan: provider.slogan || '',
    description: provider.description || '',
    about_me: provider.about_me || '',
    pricing_info: provider.pricing_info || '',
    city: provider.city || '',
    address: provider.address || '',
    phone: provider.phone || '',
    email: provider.email || '',
    website_url: provider.website_url || '',
    categories: provider.categories || [],
    flash_offer_active: provider.flash_offer_active || false,
    flash_offer_text: provider.flash_offer_text || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Auto-save
  useEffect(() => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(() => {
      handleSave()
    }, 2000)
    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    }
  }, [formData])

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(formData)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleImageUpload = async (file: File, type: 'logo' | 'cover' | 'gallery') => {
    setUploading(type)
    try {
      const url = await uploadProviderImage(file, type === 'gallery' ? 'gallery' : type)
      if (url) {
        if (type === 'logo') {
          await onUpdate({ logo_url: url })
        } else if (type === 'cover') {
          await onUpdate({ cover_url: url })
        } else {
          const newGallery = [...(provider.gallery_urls || []), url]
          await onUpdate({ gallery_urls: newGallery })
        }
      }
    } catch (e) {
      console.error('Upload failed:', e)
    }
    setUploading(null)
  }

  const removeGalleryImage = async (index: number) => {
    const newGallery = (provider.gallery_urls || []).filter((_, i) => i !== index)
    await onUpdate({ gallery_urls: newGallery })
  }

  const toggleCategory = (cat: string) => {
    const newCats = formData.categories.includes(cat)
      ? formData.categories.filter(c => c !== cat)
      : [...formData.categories, cat]
    setFormData({ ...formData, categories: newCats })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] to-[#ecfdf5]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Identita a Profil - Editace</h1>
                <p className="text-sm text-gray-500">Upravte informace o vašem podniku</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all shadow-lg flex items-center gap-2 font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                PŘEHLED
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2 font-semibold"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? 'Ukládám...' : 'ULOŽIT'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header Images */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            {/* Cover Photo */}
            <div className="relative h-64 bg-gradient-to-r from-emerald-400 to-teal-500">
              {provider.cover_url && (
                <img src={provider.cover_url} alt="Cover" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white rounded-xl text-sm font-medium text-gray-700 shadow-lg transition-all backdrop-blur-sm"
                disabled={uploading === 'cover'}
              >
                {uploading === 'cover' ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                Změnit cover
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
              />
            </div>

            {/* Logo */}
            <div className="relative px-8 pb-8">
              <div className="absolute -top-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-white shadow-2xl overflow-hidden border-4 border-white">
                    {provider.logo_url ? (
                      <img src={provider.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-600 text-4xl font-bold">
                        {formData.business_name?.charAt(0) || 'S'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    disabled={uploading === 'logo'}
                  >
                    {uploading === 'logo' ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                  />
                </div>
              </div>

              <div className="pt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {formData.business_name || 'Název vašeho podniku'}
                </h2>
                <p className="text-gray-600 text-lg">{formData.slogan || 'Přidejte slogan'}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Info */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Základní informace
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Název firmy</label>
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="Studio Rave"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slogan</label>
                    <input
                      type="text"
                      value={formData.slogan}
                      onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="Krása a relaxace na jednom místě"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Krátký popis</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                      placeholder="Popis vašeho podniku..."
                    />
                  </div>
                </div>
              </div>

              {/* About & Pricing */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">O nás a ceník</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">O mně / O nás</label>
                    <textarea
                      value={formData.about_me}
                      onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                      placeholder="Napište něco o sobě nebo vašem týmu..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ceník</label>
                    <textarea
                      value={formData.pricing_info}
                      onChange={(e) => setFormData({ ...formData, pricing_info: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                      placeholder="Masáž 60min - 1200 Kč | Kosmetika - od 800 Kč"
                    />
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Galerie</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(provider.gallery_urls || []).map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-md">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploading === 'gallery'}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-emerald-500 hover:text-emerald-600 transition-all hover:bg-emerald-50/50"
                  >
                    {uploading === 'gallery' ? (
                      <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-8 h-8" />
                        <span className="text-sm font-medium">Přidat</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'gallery')}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-8">
              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Kontakt</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="Město"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Ulice a číslo"
                  />
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="+420 777 123 456"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="email@example.cz"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="https://vaš-web.cz"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Kategorie</h3>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        formData.categories.includes(cat.id)
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flash Offer */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Flash nabídka</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.flash_offer_active}
                      onChange={(e) => setFormData({ ...formData, flash_offer_active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mb-4">Stojí 2 Kč/den z kreditu</p>
                <input
                  type="text"
                  value={formData.flash_offer_text}
                  onChange={(e) => setFormData({ ...formData, flash_offer_text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="DNES VOLNÝ TERMÍN - SLEVA 10%"
                  disabled={!formData.flash_offer_active}
                />
              </div>

              {/* Certificates */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Certifikáty
                </h3>
                <div className="space-y-3">
                  {(provider.certificates || []).map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                      <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      {cert}
                    </div>
                  ))}
                  {(!provider.certificates || provider.certificates.length === 0) && (
                    <p className="text-sm text-gray-400 bg-gray-50 px-4 py-3 rounded-xl">Zatím žádné certifikáty</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}