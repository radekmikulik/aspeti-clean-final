// Komponenta pro nastavení blackout termínů
import React, { useState, useEffect } from 'react'
import { CalendarAndMessagesService, ProviderBlackout } from '@/lib/calendar-messages-service'
import { useAuth } from '@/hooks/useAuth'

interface BlackoutSettingsProps {
  onClose: () => void
}

export function BlackoutSettings({ onClose }: BlackoutSettingsProps) {
  const { user } = useAuth()
  const [blackouts, setBlackouts] = useState<ProviderBlackout[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Form pro přidání nového blackout
  const [newBlackout, setNewBlackout] = useState({
    blackout_date: '',
    start_time: '',
    end_time: '',
    reason: ''
  })

  useEffect(() => {
    loadBlackouts()
  }, [user?.id])

  const loadBlackouts = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const data = await CalendarAndMessagesService.getProviderBlackouts(user.id)
      setBlackouts(data.sort((a, b) => new Date(b.blackout_date).getTime() - new Date(a.blackout_date).getTime()))
    } catch (error) {
      console.error('❌ Error loading blackouts:', error)
      setMessage('Chyba při načítání blackout termínů')
    } finally {
      setLoading(false)
    }
  }

  const addBlackout = async () => {
    if (!user?.id || !newBlackout.blackout_date) {
      setMessage('Vyplňte prosím datum')
      return
    }
    
    try {
      setSaving(true)
      setMessage('')
      
      const blackoutData = {
        blackout_date: newBlackout.blackout_date,
        start_time: newBlackout.start_time || undefined,
        end_time: newBlackout.end_time || undefined,
        reason: newBlackout.reason || undefined
      }
      
      await CalendarAndMessagesService.addProviderBlackout(user.id, blackoutData)
      setMessage('✅ Blackout termín byl přidán!')
      
      // Reset form
      setNewBlackout({
        blackout_date: '',
        start_time: '',
        end_time: '',
        reason: ''
      })
      setShowAddForm(false)
      
      // Reload data
      await loadBlackouts()
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error adding blackout:', error)
      setMessage('❌ Chyba při přidávání blackout termínu')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('cs-CZ', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return 'Celý den'
    return timeString.substring(0, 5) // HH:MM
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
        <p style={{ color: '#6b7280' }}>Načítání blackout termínů...</p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>🚫 Blackout termíny</h2>
        <button 
          onClick={onClose}
          style={{ color: '#9ca3af', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Nastavte termíny, kdy nebudete dostupní pro rezervace (dovolená, nemoc, jiné akce).
        </p>

        {message && (
          <div style={{
            backgroundColor: message.includes('✅') ? '#D1FAE5' : '#FEE2E2',
            color: message.includes('✅') ? '#065F46' : '#DC2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {showAddForm ? 'Zrušit' : '➕ Přidat blackout termín'}
          </button>
        </div>

        {showAddForm && (
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Nový blackout termín</h4>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Datum *
                </label>
                <input
                  type="date"
                  value={newBlackout.blackout_date}
                  onChange={(e) => setNewBlackout(prev => ({ ...prev, blackout_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Od (volitelné)
                  </label>
                  <input
                    type="time"
                    value={newBlackout.start_time}
                    onChange={(e) => setNewBlackout(prev => ({ ...prev, start_time: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Do (volitelné)
                  </label>
                  <input
                    type="time"
                    value={newBlackout.end_time}
                    onChange={(e) => setNewBlackout(prev => ({ ...prev, end_time: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Důvod (volitelné)
                </label>
                <input
                  type="text"
                  value={newBlackout.reason}
                  onChange={(e) => setNewBlackout(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Např. Dovolená, Nemoc, Jiná akce"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '8px 16px',
                  color: '#6b7280',
                  background: 'none',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Zrušit
              </button>
              <button
                onClick={addBlackout}
                disabled={saving || !newBlackout.blackout_date}
                style={{
                  padding: '8px 16px',
                  backgroundColor: (saving || !newBlackout.blackout_date) ? '#9CA3AF' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (saving || !newBlackout.blackout_date) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {saving ? 'Přidávám...' : 'Přidat termín'}
              </button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Stávající blackout termíny ({blackouts.length})
          </h4>
        </div>

        {blackouts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <p style={{ color: '#6b7280' }}>Zatím nemáte nastavené žádné blackout termíny</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {blackouts.map((blackout) => (
              <div key={blackout.id} style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', margin: '0 0 8px 0' }}>
                      {formatDate(blackout.blackout_date)}
                    </h5>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                      Čas: {formatTime(blackout.start_time)} - {formatTime(blackout.end_time)}
                    </p>
                    {blackout.reason && (
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0' }}>
                        Důvod: {blackout.reason}
                      </p>
                    )}
                  </div>
                  <div style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    BLOKOVÁN
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              color: '#6b7280',
              background: 'none',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  )
}