// React Hook pro správu auth stavu
import { useState, useEffect } from 'react'
import { AuthService } from './auth-service'
import { User } from './auth'
import { AuthState } from './auth'

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'client' | 'provider' | null>(null)

  useEffect(() => {
    // Inicializace auth stavu
    const initAuth = async () => {
      try {
        setLoading(true)
        
        // Získání aktuálního uživatele
        const currentUser = await AuthService.getCurrentUser()
        
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
          
          // Získání role uživatele
          const role = await AuthService.getUserRole(currentUser)
          setUserRole(role)
        } else {
          setUser(null)
          setIsAuthenticated(false)
          setUserRole(null)
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        setUser(null)
        setIsAuthenticated(false)
        setUserRole(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Naslouchání změn auth stavu
    const { data: { subscription } } = AuthService.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user as User)
        setIsAuthenticated(true)
        AuthService.getUserRole(session.user as User).then(setUserRole)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAuthenticated(false)
        setUserRole(null)
      }
      
      setLoading(false)
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    loading,
    isAuthenticated,
    userRole
  }
}