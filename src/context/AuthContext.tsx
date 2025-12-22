import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

// Mock User type
interface User {
  id: string
  email: string
  user_metadata?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    // Demo účty pro testování
    
    // Poskytovatel
    if (email === 'poskytovatel@aspeti.cz' && password === 'poskytovatel123') {
      const providerUser = {
        id: 'provider-user-id',
        email: 'poskytovatel@aspeti.cz',
        user_metadata: { 
          full_name: 'Jan Poskytovatel',
          role: 'provider'
        }
      } as unknown as User
      setUser(providerUser)
      return { error: null }
    }
    
    // Zákazník
    if (email === 'zakaznik@aspeti.cz' && password === 'zakaznik123') {
      const customerUser = {
        id: 'customer-user-id',
        email: 'zakaznik@aspeti.cz',
        user_metadata: { 
          full_name: 'Marie Zákazníková',
          role: 'customer'
        }
      } as unknown as User
      setUser(customerUser)
      return { error: null }
    }
    
    // Původní demo účet
    if (email === 'demo@aspeti.cz' && password === 'demo123') {
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@aspeti.cz',
        user_metadata: { 
          full_name: 'Demo Uživatel',
          role: 'provider'
        }
      } as unknown as User
      setUser(demoUser)
      return { error: null }
    }
    
    // Pro ostatní emaily se pokusí o Supabase
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (err) {
      return { error: { message: 'Demo účty:\nPoskytovatel: poskytovatel@aspeti.cz / poskytovatel123\nZákazník: zakaznik@aspeti.cz / zakaznik123\nDemo: demo@aspeti.cz / demo123' } }
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    // Demo registrace
    if (email && password && fullName) {
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: { full_name: fullName }
      } as unknown as User
      setUser(demoUser)
      return { error: null }
    }
    
    // Pro ostatní případy se pokusí o Supabase
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: fullName }
        }
      })
    
      if (!error && data.user) {
        // Create profile
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          credits: 0
        })
      }
      
      return { error }
    } catch (err) {
      return { error: { message: 'Chyba registrace' } }
    }
  }

  async function signOut() {
    // Demo logout
    setUser(null)
    // Pro Supabase: await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}