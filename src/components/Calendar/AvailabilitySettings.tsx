// Komponenta pro nastavení dostupnosti poskytovatele
import React, { useState, useEffect } from 'react'
import { CalendarAndMessagesService, ProviderAvailability } from '@/lib/calendar-messages-service'
import { useAuth } from '@/hooks/useAuth'

interface AvailabilitySettingsProps {
  onClose: () => void
}

interface DaySchedule {
  day: number
  name: string
  is_available: boolean
  start_time: string
  end_time: string
}

const DAYS = [
  { day: 0, name: 'Neděle' },
  { day: 1, name: 'Pondělí' },
  { day: 2, name: 'Úterý' },
  { day: 3, name: 'Středa' },
  { day: 4, name: 'Čtvrtek' },
  { day: 5, name: 'Pátek' },
  { day: 6, name: 'Sobota' }
]

export function AvailabilitySettings({ onClose }: AvailabilitySettingsProps) {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAvailability()
  }, [user?.id])

  const loadAvailability = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const availability = await CalendarAndMessagesService.getProviderAvailability(user.id)
      
      // Převést na DaySchedule formát
      const daySchedule: DaySchedule[] = DAYS.map(dayInfo => {
        const existing = availability.find(a => a.day_of_week === dayInfo.day)
        return {
          day: dayInfo.day,
          name: dayInfo.name,
          is_available: existing?.is_available ?? true,
          start_time: existing?.start_time ?? '09:00',
          end_time: existing?.end_time ?? '17:00'
        }
      })
      
      setSchedule(daySchedule)
    } catch (error) {
      console.error('❌ Error loading availability:', error)
      setMessage('Chyba při načítání dostupnosti')
    } finally {
      setLoading(false)
    }
  }

  const saveAvailability = async () => {
    if (!user?.id) return
    
    try {
      setSaving(true)
      setMessage('')
      
      // Převést na ProviderAvailability formát
      const availabilityData = schedule.map(day => ({
        day_of_week: day.day,
        start_time: day.start_time,
        end_time: day.end_time,
        is_available: day.is_available
      }))
      
      await CalendarAndMessagesService.saveProviderAvailability(user.id, availabilityData)
      setMessage('✅ Dostupnost byla úspěšně uložena!')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('❌ Error saving availability:', error)
      setMessage('❌ Chyba při ukládání dostupnosti')
    } finally {
      setSaving(false)
    }
  }

  const updateDaySchedule = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, [field]: value } : day
    ))
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
        <p style={{ color: '#6b7280' }}>Načítání dostupnosti...</p>
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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>📅 Nastavení dostupnosti</h2>
        <button 
          onClick={onClose}
          style={{ color: '#9ca3af', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Nastavte svou dostupnost pro rezervace. Klienti budou moci rezervovat pouze v těchto časech.
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

        <div style={{ display: 'grid', gap: '16px' }}>
          {schedule.map((day, index) => (
            <div key={day.day} style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{day.name}</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={day.is_available}
                    onChange={(e) => updateDaySchedule(index, 'is_available', e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  Dostupný
                </label>
              </div>
              
              {day.is_available && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Od
                    </label>
                    <input
                      type="time"
                      value={day.start_time}
                      onChange={(e) => updateDaySchedule(index, 'start_time', e.target.value)}
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
                      Do
                    </label>
                    <input
                      type="time"
                      value={day.end_time}
                      onChange={(e) => updateDaySchedule(index, 'end_time', e.target.value)}
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
              )}
            </div>
          ))}
        </div>

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
            Zrušit
          </button>
          <button
            onClick={saveAvailability}
            disabled={saving}
            style={{
              padding: '8px 24px',
              backgroundColor: saving ? '#9CA3AF' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {saving ? 'Ukládám...' : 'Uložit dostupnost'}
          </button>
        </div>
      </div>
    </div>
  )
}