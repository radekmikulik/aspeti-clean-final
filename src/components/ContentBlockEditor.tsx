import { useState, useRef, useEffect } from 'react'
import { 
  GripVertical, Plus, Trash2, Type, Image as ImageIcon, 
  Edit3, Check, X, Upload
} from '../components/icons'
import { uploadProviderImage } from '../lib/supabase'

interface ContentBlock {
  id: string
  type: 'text' | 'image'
  content?: string
  imageUrl?: string
  imageAlt?: string
  sortOrder: number
}

interface ContentBlockEditorProps {
  section: 'about' | 'space' | 'team' | 'certs'
  blocks: ContentBlock[]
  onBlocksChange: (blocks: ContentBlock[]) => void
  onSave?: () => void
  dragAndDropEnabled?: boolean // Nový prop pro kontrolu drag & drop
  sectionTitle?: string // Editovatelný název sekce
  onSectionTitleChange?: (title: string) => void
  visible?: boolean // Viditelnost sekce
  onVisibilityChange?: (visible: boolean) => void
}

// Mock data pro demo
const mockBlocks: ContentBlock[] = [
  {
    id: '1',
    type: 'text',
    content: 'Vítejte v našem moderním beauty studiu! Poskytujeme profesionální služby v oblasti kosmetiky, masáží a wellnes.',
    sortOrder: 1
  },
  {
    id: '2', 
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    imageAlt: 'Interiér studia',
    sortOrder: 2
  },
  {
    id: '3',
    type: 'text', 
    content: 'Náš tým zkušených specialistů se postará o vaši spokojenost. Používáme pouze kvalitní produkty a moderní techniky.',
    sortOrder: 3
  }
]

export function ContentBlockEditor({ 
  section, 
  blocks: propBlocks, 
  onBlocksChange, 
  onSave, 
  dragAndDropEnabled = false,
  sectionTitle,
  onSectionTitleChange,
  visible = true,
  onVisibilityChange
}: ContentBlockEditorProps) {
  const sectionLabels = {
    about: 'O mně',
    space: 'Prostory', 
    team: 'Tým',
    certs: 'Certifikace'
  }
  
  const [blocks, setBlocks] = useState<ContentBlock[]>(propBlocks || mockBlocks)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [editingSectionTitle, setEditingSectionTitle] = useState(false)
  const [currentSectionTitle, setCurrentSectionTitle] = useState(sectionTitle || sectionLabels[section])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Sync blocks with props
  useEffect(() => {
    setBlocks(propBlocks || mockBlocks)
  }, [propBlocks])

  // Sync section title with props
  useEffect(() => {
    if (sectionTitle) {
      setCurrentSectionTitle(sectionTitle)
    }
  }, [sectionTitle])

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedId(blockId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    
    if (!draggedId || draggedId === targetId) return

    const draggedIndex = blocks.findIndex(b => b.id === draggedId)
    const targetIndex = blocks.findIndex(b => b.id === targetId)
    
    const newBlocks = [...blocks]
    const draggedBlock = newBlocks[draggedIndex]
    
    // Remove dragged block
    newBlocks.splice(draggedIndex, 1)
    // Insert at target position
    newBlocks.splice(targetIndex, 0, draggedBlock)
    
    // Update sortOrder
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      sortOrder: index + 1
    }))
    
    setBlocks(updatedBlocks)
    onBlocksChange(updatedBlocks)
    setDraggedId(null)
  }

  const addBlock = (type: 'text' | 'image') => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? '' : undefined,
      imageUrl: type === 'image' ? undefined : undefined,
      imageAlt: type === 'image' ? '' : undefined,
      sortOrder: blocks.length + 1
    }
    
    const updatedBlocks = [...blocks, newBlock]
    setBlocks(updatedBlocks)
    onBlocksChange(updatedBlocks)
    setEditingBlock(newBlock.id)
  }

  const deleteBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(b => b.id !== blockId)
    // Reorder remaining blocks
    const reorderedBlocks = updatedBlocks.map((block, index) => ({
      ...block,
      sortOrder: index + 1
    }))
    
    setBlocks(reorderedBlocks)
    onBlocksChange(reorderedBlocks)
  }

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    )
    setBlocks(updatedBlocks)
    onBlocksChange(updatedBlocks)
  }

  const handleSectionTitleSave = () => {
    if (onSectionTitleChange) {
      onSectionTitleChange(currentSectionTitle)
    }
    setEditingSectionTitle(false)
  }

  const handleImageUpload = async (blockId: string, file: File) => {
    setUploading(blockId)
    try {
      const imageUrl = await uploadProviderImage(file, 'content-blocks')
      if (imageUrl) {
        updateBlock(blockId, { imageUrl })
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
                    setCurrentSectionTitle(sectionTitle || sectionLabels[section])
                    setEditingSectionTitle(false)
                  }}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{currentSectionTitle} - Obsahové bloky</span>
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
        
        <div className="flex gap-2">
          <button
            onClick={() => addBlock('text')}
            className="px-3 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-2"
            style={{ backgroundColor: '#CAD8D0' }}
          >
            <Type className="w-4 h-4" />
            Přidat text
          </button>
          <button
            onClick={() => addBlock('image')}
            className="px-3 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-2"
            style={{ backgroundColor: '#DDEBE3', color: '#0F2A43' }}
          >
            <ImageIcon className="w-4 h-4" />
            Přidat fotku
          </button>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            draggable={dragAndDropEnabled}
            onDragStart={dragAndDropEnabled ? (e) => handleDragStart(e, block.id) : undefined}
            onDragOver={dragAndDropEnabled ? handleDragOver : undefined}
            onDrop={dragAndDropEnabled ? (e) => handleDrop(e, block.id) : undefined}
            className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all ${
              dragAndDropEnabled && draggedId === block.id ? 'opacity-50' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Drag Handle */}
              {dragAndDropEnabled && (
                <div className="flex-shrink-0 mt-2">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                </div>
              )}

              {/* Block Content */}
              <div className="flex-1">
                {editingBlock === block.id ? (
                  <div className="space-y-4">
                    {block.type === 'text' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Text bloku
                        </label>
                        <textarea
                          value={block.content || ''}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          rows={4}
                          placeholder="Napište text bloku..."
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fotka bloku
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(block.id, file)
                            }}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading === block.id}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            {uploading === block.id ? (
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {uploading === block.id ? 'Nahrávám...' : 'Nahrát fotku'}
                          </button>
                          <input
                            type="text"
                            value={block.imageAlt || ''}
                            onChange={(e) => updateBlock(block.id, { imageAlt: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Alt text pro obrázek..."
                          />
                        </div>
                        {block.imageUrl && (
                          <div className="mt-3">
                            <img 
                              src={block.imageUrl} 
                              alt={block.imageAlt} 
                              className="w-1/3 h-auto object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBlock(null)}
                        className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all flex items-center gap-1"
                        style={{ backgroundColor: '#0F2A43' }}
                      >
                        <Check className="w-4 h-4" />
                        Hotovo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {block.type === 'text' ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Type className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Textový blok</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {block.content || 'Prázdný text...'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Obrázek</span>
                        </div>
                        {block.imageUrl ? (
                          <img 
                            src={block.imageUrl} 
                            alt={block.imageAlt} 
                            className="w-1/3 h-auto object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-1/3 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEditingBlock(block.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Upravit blok"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Smazat blok"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onSave}
          className="px-6 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-all"
          style={{ backgroundColor: '#CAD8D0' }}
        >
          Uložit obsahové bloky
        </button>
      </div>
    </div>
  )
}
