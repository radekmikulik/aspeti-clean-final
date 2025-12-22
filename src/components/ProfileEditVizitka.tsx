import { useState, useEffect, useRef } from 'react'
import { 
  ArrowLeft, Camera, Upload, MapPin, Phone, Mail, Globe, Plus, X, Save, Award, User, Image as ImageIcon
} from '../components/icons'
import ReactQuill from './ReactQuill'
import { Provider, uploadProviderImage } from '../lib/supabase'
import { ContentBlockEditor } from './ContentBlockEditor'
import { TeamEditor } from './TeamEditor'

const SAGE = {
  light: '#E8F0E6',
  strong: '#DDEBE3', 
  navy: '#0F2A43'
}

const CATEGORIES = [
  { id: 'beauty', label: 'Beauty & Wellbeing' },
  { id: 'gastro', label: 'Gastronomie' },
  { id: 'ubytovani', label: 'Ubytování' },
  { id: 'reality', label: 'Reality' },
  { id: 'remesla', label: 'Řemesla' },
]

interface ProfileEditVizitkaProps {
  provider: Provider
  onUpdate: (updates: Partial<Provider>) => Promise<void>
  onClose: () => void
}

export function ProfileEditVizitka({ provider, onUpdate, onClose }: ProfileEditVizitkaProps) {
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
  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // State for content blocks
  const [contentBlocks, setContentBlocks] = useState({
    about: provider.content_blocks?.about || [],
    space: provider.content_blocks?.space || [],
    team: provider.content_blocks?.team || [],
    certs: provider.content_blocks?.certs || []
  })

  // State for section titles
  const [sectionTitles, setSectionTitles] = useState({
    about: provider.content_blocks?.section_titles?.about || 'O mně',
    space: provider.content_blocks?.section_titles?.space || 'Prostory',
    team: provider.content_blocks?.section_titles?.team || 'Tým',
    certs: provider.content_blocks?.section_titles?.certs || 'Certifikace'
  })

  // State for team members (new format)
  const [teamMembers, setTeamMembers] = useState(
    provider.content_blocks?.team_members || []
  )

  // State for section visibility
  const [sectionVisibility, setSectionVisibility] = useState({
    about: provider.content_blocks?.visibility?.about ?? true,
    space: provider.content_blocks?.visibility?.space ?? true,
    team: provider.content_blocks?.visibility?.team ?? true,
    certs: provider.content_blocks?.visibility?.certs ?? true,
    pricing: provider.content_blocks?.visibility?.pricing ?? true,
    flash_offer: provider.content_blocks?.visibility?.flash_offer ?? true
  })
  
  // Sync content blocks when provider changes
  useEffect(() => {
    setContentBlocks({
      about: provider.content_blocks?.about || [],
      space: provider.content_blocks?.space || [],
      team: provider.content_blocks?.team || [],
      certs: provider.content_blocks?.certs || []
    })
    setSectionTitles({
      about: provider.content_blocks?.section_titles?.about || 'O společnosti',
      space: provider.content_blocks?.section_titles?.space || 'Prostory',
      team: provider.content_blocks?.section_titles?.team || 'Tým',
      certs: provider.content_blocks?.section_titles?.certs || 'Certifikace'
    })
    setTeamMembers(provider.content_blocks?.team_members || [])
    setSectionVisibility({
      about: provider.content_blocks?.visibility?.about ?? true,
      space: provider.content_blocks?.visibility?.space ?? true,
      team: provider.content_blocks?.visibility?.team ?? true,
      certs: provider.content_blocks?.visibility?.certs ?? true,
      pricing: provider.content_blocks?.visibility?.pricing ?? true,
      flash_offer: provider.content_blocks?.visibility?.flash_offer ?? true
    })
  }, [provider.content_blocks])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending operations
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Uložit jak formData, tak contentBlocks s názvy sekcí, team members a viditelností současně
      await onUpdate({
        ...formData,
        content_blocks: {
          ...contentBlocks,
          section_titles: sectionTitles,
          team_members: teamMembers,
          visibility: sectionVisibility
        }
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Chyba při ukládání profilu:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, type: 'logo' | 'cover' | 'gallery') => {
    setUploading(type)
    
    // KROK 1 - LOGGING VYBRANÉHO SOUBORU
    console.log('🔍 SELECTED FILE:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })
    
    try {
      const url = await uploadProviderImage(file, type === 'gallery' ? 'gallery' : type)
      
      // KROK 1 - PREVIEW VYBRANÉHO SOUBORU
      const objectUrl = URL.createObjectURL(file)
      console.log('🔍 PREVIEW URL for selected file:', objectUrl)
      
      if (url) {
        if (type === 'logo') {
          // KROK 4 - Uložení do profile_image_url pro skutečný upload
          await onUpdate({ profile_image_url: url })
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

  const handleContentBlocksChange = (section: 'about' | 'space' | 'team' | 'certs', blocks: any[]) => {
    setContentBlocks(prev => ({
      ...prev,
      [section]: blocks
    }))
  }

  const handleSectionTitleChange = (section: 'about' | 'space' | 'team' | 'certs', title: string) => {
    setSectionTitles(prev => ({
      ...prev,
      [section]: title
    }))
  }

  const handleTeamMembersChange = (members: any[]) => {
    setTeamMembers(members)
  }

  const handleSectionVisibilityChange = (section: keyof typeof sectionVisibility, visible: boolean) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: visible
    }))
  }

  const saveContentBlocks = async () => {
    try {
      console.log('Ukládám obsahové bloky:', contentBlocks)
      // Uložení obsahových bloků do Provider objektu
      await onUpdate({ content_blocks: contentBlocks })
      console.log('Obsahové bloky uloženy úspěšně')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Chyba při ukládání obsahových bloků:', error)
    }
  }

  // WYSIWYG Editor modules and formats
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet',
    'align', 'link', 'image'
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
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
                <h1 className="text-2xl font-bold text-gray-900">Editace firemního profilu</h1>
                <p className="text-sm text-gray-500">Upravte informace o vašem podniku</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                Zpět na profil
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2 font-semibold"
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
          {/* Company Identity */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-white shadow-lg overflow-hidden border-2 border-gray-200">
                  {provider.profile_image_url ? (
                    <img src={provider.profile_image_url} alt="Profilová fotka" className="w-full h-full object-cover" />
                  ) : provider.logo_url ? (
                    <img src={provider.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold">
                      {formData.business_name?.charAt(0) || 'S'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"
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
              
              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder="Název vašeho podniku"
                />
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  className="w-full text-lg text-gray-600 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 mt-2"
                  placeholder="Váš slogan"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Main Content - Left */}
            <div className="flex-1 space-y-8">
              {/* Basic Description */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100" style={{ backgroundColor: SAGE.light }}>
                <div className="flex gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <User className="w-5 h-5" style={{ color: SAGE.navy }} />
                      Základní informace
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Krátký popis</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none bg-white"
                          placeholder="Stručný popis vašeho podniku..."
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Sidebar - Kontakt */}
                  <div className="w-80 space-y-6">
                    {/* Kontakt */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100" style={{ backgroundColor: SAGE.light }}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Phone className="w-4 h-4" style={{ color: SAGE.navy }} />
                        Kontakt
                      </h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                            placeholder="Město"
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                          placeholder="Ulice a číslo"
                        />
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                            placeholder="Telefon"
                          />
                        </div>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                            placeholder="E-mail"
                          />
                        </div>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="url"
                            value={formData.website_url}
                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                            placeholder="Webová stránka"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Content Blocks Sections */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-gray-600 mb-6">
                  Vytvořte obsahové bloky s textem a fotkami pro jednotlivé sekce. Bloky můžete upravovat a mazat.
                </p>
                
                <div className="space-y-8">
                  <ContentBlockEditor
                    section="about"
                    blocks={contentBlocks.about}
                    onBlocksChange={(blocks) => handleContentBlocksChange('about', blocks)}
                    onSave={saveContentBlocks}
                    dragAndDropEnabled={false}
                    sectionTitle={sectionTitles.about}
                    onSectionTitleChange={(title) => handleSectionTitleChange('about', title)}
                    visible={sectionVisibility.about}
                    onVisibilityChange={(visible) => handleSectionVisibilityChange('about', visible)}
                  />
                  
                  <ContentBlockEditor
                    section="space"
                    blocks={contentBlocks.space}
                    onBlocksChange={(blocks) => handleContentBlocksChange('space', blocks)}
                    onSave={saveContentBlocks}
                    dragAndDropEnabled={false}
                    sectionTitle={sectionTitles.space}
                    onSectionTitleChange={(title) => handleSectionTitleChange('space', title)}
                    visible={sectionVisibility.space}
                    onVisibilityChange={(visible) => handleSectionVisibilityChange('space', visible)}
                  />
                  
                  {/* Team Editor - Special component for team members */}
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                    <TeamEditor
                      sectionTitle={sectionTitles.team}
                      onSectionTitleChange={(title) => handleSectionTitleChange('team', title)}
                      teamMembers={teamMembers}
                      onTeamMembersChange={handleTeamMembersChange}
                      onSave={saveContentBlocks}
                      visible={sectionVisibility.team}
                      onVisibilityChange={(visible) => handleSectionVisibilityChange('team', visible)}
                    />
                  </div>
                  
                  <ContentBlockEditor
                    section="certs"
                    blocks={contentBlocks.certs}
                    onBlocksChange={(blocks) => handleContentBlocksChange('certs', blocks)}
                    onSave={saveContentBlocks}
                    dragAndDropEnabled={false}
                    sectionTitle={sectionTitles.certs}
                    onSectionTitleChange={(title) => handleSectionTitleChange('certs', title)}
                    visible={sectionVisibility.certs}
                    onVisibilityChange={(visible) => handleSectionVisibilityChange('certs', visible)}
                  />
                </div>
              </div>

              {/* Legacy About Section - kept for backward compatibility */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Základní popis (starý formát)</h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Detailní popis</label>
                  <textarea
                    value={formData.about_me}
                    onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Napište detailní informace o vašem podniku..."
                  />
                </div>
              </div>

              {/* Pricing Section - Simplified for testing */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Ceník</h3>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={sectionVisibility.pricing}
                      onChange={(e) => handleSectionVisibilityChange('pricing', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Zobrazit na veřejném profilu
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ceník služeb</label>
                  <textarea
                    value={formData.pricing_info}
                    onChange={(e) => setFormData({ ...formData, pricing_info: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Vytvořte ceník se službami a cenami..."
                  />
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Galerie
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(provider.gallery_urls || []).map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-md border border-gray-200">
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
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-all hover:bg-blue-50/50"
                  >
                    {uploading === 'gallery' ? (
                      <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-8 h-8" />
                        <span className="text-sm font-medium">Přidat fotku</span>
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

            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100" style={{ backgroundColor: SAGE.light }}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: SAGE.navy }} />
                  Kontakt
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Město"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Ulice a číslo"
                  />
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="+420 777 123 456"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="email@example.cz"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="https://vaš-web.cz"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Kategorie</h3>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        formData.categories.includes(cat.id)
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flash Offer */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Flash nabídka</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={sectionVisibility.flash_offer}
                        onChange={(e) => handleSectionVisibilityChange('flash_offer', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Zobrazit na veřejném profilu
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.flash_offer_active}
                      onChange={(e) => setFormData({ ...formData, flash_offer_active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mb-4">Stojí 2 Kč/den z kreditu</p>
                <input
                  type="text"
                  value={formData.flash_offer_text}
                  onChange={(e) => setFormData({ ...formData, flash_offer_text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="DNES VOLNÝ TERMÍN - SLEVA 10%"
                  disabled={!formData.flash_offer_active}
                />
              </div>

              {/* Certificates */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-600" />
                  Certifikáty
                </h3>
                <div className="space-y-3">
                  {(provider.certificates || []).map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-700 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200">
                      <Award className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      {cert}
                    </div>
                  ))}
                  {(!provider.certificates || provider.certificates.length === 0) && (
                    <p className="text-sm text-gray-400 bg-gray-100 px-4 py-3 rounded-xl">Zatím žádné certifikáty</p>
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