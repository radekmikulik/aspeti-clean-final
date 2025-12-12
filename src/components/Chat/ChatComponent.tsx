// Komponenta pro chat/zprávy
import React, { useState, useEffect, useRef } from 'react'
import { CalendarAndMessagesService, Conversation, ChatMessage } from '@/lib/calendar-messages-service'
import { useAuth } from '@/hooks/useAuth'

interface ChatComponentProps {
  onClose: () => void
}

export function ChatComponent({ onClose }: ChatComponentProps) {
  const { user, userRole } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user?.id && userRole) {
      loadConversations()
    }
  }, [user?.id, userRole])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      // Mark messages as read
      if (user?.id) {
        CalendarAndMessagesService.markMessagesAsRead(selectedConversation.id, user.id)
      }
    }
  }, [selectedConversation, user?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    if (!user?.id || !userRole) return
    
    try {
      setLoading(true)
      const data = await CalendarAndMessagesService.getConversations(user.id, userRole)
      setConversations(data)
      
      // Auto-select first conversation
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0])
      }
    } catch (error) {
      console.error('❌ Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await CalendarAndMessagesService.getConversationMessages(conversationId)
      setMessages(data)
    } catch (error) {
      console.error('❌ Error loading messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id || sending) return
    
    try {
      setSending(true)
      
      await CalendarAndMessagesService.sendMessage(
        selectedConversation.id,
        user.id,
        userRole === 'provider' ? 'provider' : 'client',
        newMessage.trim()
      )
      
      // Reload messages
      await loadMessages(selectedConversation.id)
      setNewMessage('')
      
      // Reload conversations to update order
      await loadConversations()
    } catch (error) {
      console.error('❌ Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('cs-CZ', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: '2-digit' })
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
        <p style={{ color: '#6b7280' }}>Načítání zpráv...</p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxWidth: '1000px',
      width: '100%',
      height: '600px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>💬 Zprávy</h2>
        <button 
          onClick={onClose}
          style={{ color: '#9ca3af', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Seznam konverzací */}
        <div style={{
          width: '300px',
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Konverzace</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                <p style={{ fontSize: '14px' }}>Zatím nemáte žádné konverzace</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: selectedConversation?.id === conversation.id ? '#e5e7eb' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedConversation?.id !== conversation.id) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedConversation?.id !== conversation.id) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0', color: '#111827' }}>
                    {conversation.title || 'Konverzace'}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    {userRole === 'provider' ? 'Klient' : 'Poskytovatel'} • {formatDate(conversation.updated_at)}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    marginTop: '4px',
                    backgroundColor: conversation.status === 'active' ? '#d1fae5' : '#e5e7eb',
                    color: conversation.status === 'active' ? '#065f46' : '#374151'
                  }}>
                    {conversation.status === 'active' ? 'Aktivní' : 'Uzavřená'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Oblast zpráv */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              {/* Hlavička konverzace */}
              <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                  {selectedConversation.title || 'Konverzace'}
                </h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                  Vytvořeno: {formatDate(selectedConversation.created_at)}
                </p>
              </div>

              {/* Seznam zpráv */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    <p>Zatím nejsou žádné zprávy</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        style={{
                          display: 'flex',
                          justifyContent: message.sender_id === user?.id ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            backgroundColor: message.sender_id === user?.id ? '#2563eb' : '#f3f4f6',
                            color: message.sender_id === user?.id ? 'white' : '#111827'
                          }}
                        >
                          <p style={{ margin: 0, fontSize: '14px' }}>{message.content}</p>
                          <p style={{
                            margin: '4px 0 0 0',
                            fontSize: '11px',
                            opacity: 0.7
                          }}>
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input pro novou zprávu */}
              <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Napište zprávu..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    disabled={sending || selectedConversation.status !== 'active'}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending || selectedConversation.status !== 'active'}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: (!newMessage.trim() || sending || selectedConversation.status !== 'active') ? '#9CA3AF' : '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: (!newMessage.trim() || sending || selectedConversation.status !== 'active') ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {sending ? '...' : 'Odeslat'}
                  </button>
                </div>
                {selectedConversation.status !== 'active' && (
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    Tato konverzace je uzavřená
                  </p>
                )}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <p>Vyberte konverzaci pro zobrazení zpráv</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}