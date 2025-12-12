// Protected Route komponenta pro zabezpečení dashboardu
import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { AuthModal } from './AuthModal'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'client' | 'provider'
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, userRole } = useAuth()
  const [showAuthModal, setShowAuthModal] = React.useState(false)

  // Zobraz loading během inicializace
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontSize: '16px',
        color: '#6B7280'
      }}>
        🔄 Načítání...
      </div>
    )
  }

  // Zobraz auth modal pokud uživatel není přihlášen
  if (!isAuthenticated) {
    return (
      <>
        <div style={{
          backgroundColor: '#F3F4F6',
          padding: '32px',
          borderRadius: '12px',
          textAlign: 'center',
          margin: '24px 0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            Přihlášení je vyžadováno
          </h3>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>
            Pro přístup k této sekci se musíte přihlásit ke svému účtu.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#16A34A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Přihlásit se / Registrovat
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            console.log('✅ User authenticated successfully')
          }}
        />
      </>
    )
  }

  // Kontrola role pokud je požadována
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div style={{
        backgroundColor: '#FEE2E2',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center',
        margin: '24px 0'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#DC2626' }}>
          Nedostatečná oprávnění
        </h3>
        <p style={{ color: '#6B7280' }}>
          Tuto sekci mohou používat pouze uživatelé s rolí: <strong>{requiredRole}</strong>
        </p>
        <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>
          Vaše aktuální role: <strong>{userRole}</strong>
        </p>
      </div>
    )
  }

  // Render children pokud jsou všechny podmínky splněny
  return <>{children}</>
}