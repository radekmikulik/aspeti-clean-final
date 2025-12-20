import { useState, useRef, useEffect } from 'react'
import { 
  Plus, Trash2, Edit3, Check, X, Upload, Camera, User, Save
} from '../components/icons'
import { uploadProviderImage } from '../lib/supabase'

interface TeamMember {
  id: string
  name: string
  role: string
  photo?: string
  photoAlt?: string
}

interface TeamEditorProps {
  sectionTitle: string
  onSectionTitleChange: (title: string) => void
  teamMembers: TeamMember[]
  onTeamMembersChange: (members: TeamMember[]) => void
  onSave?: () => void
  visible?: boolean
  onVisibilityChange?: (visible: boolean) => void
}

export function TeamEditor({ 
  sectionTitle, 
  onSectionTitleChange, 
  teamMembers, 
  onTeamMembersChange, 
  onSave,
  visible = true,
  onVisibilityChange
}: TeamEditorProps) {
  const [editingSectionTitle, setEditingSectionTitle] = useState(false)
  const [currentSectionTitle, setCurrentSectionTitle] = useState(sectionTitle)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    photo: '',
    photoAlt: ''
  })

  // Sync section title with props
  useEffect(() => {
    setCurrentSectionTitle(sectionTitle)
  }, [sectionTitle])

  const handleSectionTitleSave = () => {
    onSectionTitleChange(currentSectionTitle)
    setEditingSectionTitle(false)
  }

  const handleAddMember = () => {
    if (!newMember.name.trim()) return
    
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name.trim(),
      role: newMember.role.trim(),
      photo: newMember.photo || undefined,
      photoAlt: newMember.photoAlt.trim() || undefined
    }
    
    onTeamMembersChange([...teamMembers, member])
    setNewMember({ name: '', role: '', photo: '', photoAlt: '' })
    setShowAddForm(false)
  }

  const handleEditMember = (id: string, updates: Partial<TeamMember>) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === id ? { ...member, ...updates } : member
    )
    onTeamMembersChange(updatedMembers)
    setEditingMember(null)
  }

  const handleDeleteMember = (id: string) => {
    onTeamMembersChange(teamMembers.filter(member => member.id !== id))
  }

  const handlePhotoUpload = async (memberId: string | 'new', file: File) => {
    setUploading(memberId)
    try {
      const imageUrl = await uploadProviderImage(file, 'team-members')
      if (imageUrl) {
        if (memberId === 'new') {
          setNewMember(prev => ({ ...prev, photo: imageUrl }))
        } else {
          handleEditMember(memberId, { photo: imageUrl })
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Chyba při nahrávání obrázku. Zkuste to znovu.')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold" style={{ color: '#0F2A43' }}>
            {editingSectionTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentSectionTitle}
                  onChange={(e) => setCurrentSectionTitle(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-lg font-semibold"
                  onKeyPress={(e) => e.key === 'Enter' && handleSectionTitleSave()}
                  autoFocus
                />
                <button
                  onClick={handleSectionTitleSave}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentSectionTitle(sectionTitle)
                    setEditingSectionTitle(false)
                  }}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{currentSectionTitle}</span>
                <button
                  onClick={() => setEditingSectionTitle(true)}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Upravit název sekce"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </h3>
        </div>
        
        {/* Visibility Toggle */}
        {onVisibilityChange && (
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => onVisibilityChange(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Zobrazit na veřejném profilu
            </label>
          </div>
        )}
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-2"
          style={{ backgroundColor: '#CAD8D0' }}
        >
          <Plus className="w-4 h-4" />
          Přidat člena
        </button>
      </div>

      {/* Add New Member Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Přidat nového člena týmu</h4>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jméno *
              </label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Zadejte jméno člena týmu"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pozice/Role
              </label>
              <input
                type="text"
                value={newMember.role}
                onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Např. Manažer, Specialistka..."
              />
            </div>
          </div>

          {/* Photo Upload for New Member */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotka člena
            </label>
            <div className="flex items-center gap-4">
              {newMember.photo ? (
                <div className="relative">
                  <img 
                    src={newMember.photo} 
                    alt="Náhled fotky" 
                    className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                  />
                  <button
                    onClick={() => setNewMember(prev => ({ ...prev, photo: '' }))}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handlePhotoUpload('new', file)
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading === 'new'}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading === 'new' ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  {uploading === 'new' ? 'Nahrávám...' : 'Nahrát fotku'}
                </button>
                
                <input
                  type="text"
                  value={newMember.photoAlt}
                  onChange={(e) => setNewMember(prev => ({ ...prev, photoAlt: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Popis fotky (alt text)"
                />
              </div>
            </div>
          </div>

          {/* Add/Cancel Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddMember}
              disabled={!newMember.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: '#0F2A43' }}
            >
              <Check className="w-4 h-4" />
              Přidat člena
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewMember({ name: '', role: '', photo: '', photoAlt: '' })
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            {editingMember === member.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jméno</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleEditMember(member.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pozice/Role</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleEditMember(member.id, { role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fotka</label>
                  <div className="flex items-center gap-4">
                    {member.photo ? (
                      <div className="relative">
                        <img 
                          src={member.photo} 
                          alt={member.photoAlt || member.name} 
                          className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handlePhotoUpload(member.id, file)
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading === member.id}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {uploading === member.id ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                      {uploading === member.id ? 'Nahrávám...' : 'Změnit fotku'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingMember(null)}
                    className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-1"
                    style={{ backgroundColor: '#0F2A43' }}
                  >
                    <Check className="w-4 h-4" />
                    Hotovo
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Member Photo */}
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.photoAlt || member.name} 
                      className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Member Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                    {member.role && (
                      <p className="text-sm text-gray-600">{member.role}</p>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingMember(member.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Upravit člena"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Smazat člena"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {teamMembers.length === 0 && !showAddForm && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">Zatím žádní členové týmu</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
            style={{ backgroundColor: '#CAD8D0' }}
          >
            <Plus className="w-4 h-4" />
            Přidat prvního člena
          </button>
        </div>
      )}

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onSave}
            className="px-6 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-2"
            style={{ backgroundColor: '#CAD8D0' }}
          >
            <Save className="w-4 h-4" />
            Uložit členy týmu
          </button>
        </div>
      )}
    </div>
  )
}