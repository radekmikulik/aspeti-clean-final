// ASPETi PLUS - Provider Verification Component
// KROK 8: FINÁLNÍ INTEGRACE - ARES a manuální ověření

import React, { useState } from 'react'

interface VerificationData {
  verificationType: 'ares' | 'manual' | 'phone' | 'email'
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  aresIco?: string
  aresData?: any
  documentUrl?: string
  documentType?: string
  notes?: string
  verifiedAt?: string
}

interface ProviderVerificationProps {
  providerId: string
  currentVerification?: VerificationData
  onVerificationUpdate?: (verification: VerificationData) => void
}

export const ProviderVerification: React.FC<ProviderVerificationProps> = ({
  providerId,
  currentVerification,
  onVerificationUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'ares' | 'manual' | 'status'>('ares')
  const [aresIco, setAresIco] = useState(currentVerification?.aresIco || '')
  const [manualDocument, setManualDocument] = useState<File | null>(null)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [aresData, setAresData] = useState<any>(null)

  // ARES ověření pro české firmy
  const handleAresVerification = async () => {
    if (!aresIco.trim()) {
      alert('Zadejte platné IČO')
      return
    }

    setLoading(true)
    try {
      // Simulace ARES API volání
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock ARES data
      const mockAresData = {
        ico: aresIco,
        obchodni_jmeno: 'Test Company s.r.o.',
        sidlo: {
          nazev_ulice: 'Hlavní 123',
          nazev_obce: 'Praha',
          psc: '110 00'
        },
       stav_subjektu: 'Aktivní',
        datum_zapisu: '2020-01-15',
        typ: 's.r.o.'
      }
      
      setAresData(mockAresData)
      alert('✅ ARES ověření úspěšné! Data byla nalezena.')
    } catch (error) {
      alert('❌ Chyba při ověření v ARES. Zkontrolujte IČO.')
    } finally {
      setLoading(false)
    }
  }

  // Manuální ověření s nahráním dokumentu
  const handleManualVerification = async () => {
    if (!manualDocument) {
      alert('Vyberte dokument pro ověření')
      return
    }

    setLoading(true)
    try {
      // Simulace nahrávání dokumentu
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const verificationData: VerificationData = {
        verificationType: 'manual',
        status: 'pending',
        documentType: manualDocument.type,
        documentUrl: `/uploads/${manualDocument.name}`,
        notes: verificationNotes
      }
      
      if (onVerificationUpdate) {
        onVerificationUpdate(verificationData)
      }
      
      alert('✅ Dokument byl úspěšně nahrán a odeslán k ověření.')
      setManualDocument(null)
      setVerificationNotes('')
    } catch (error) {
      alert('❌ Chyba při nahrávání dokumentu.')
    } finally {
      setLoading(false)
    }
  }

  // Telefonní ověření
  const handlePhoneVerification = async () => {
    setLoading(true)
    try {
      // Simulace SMS kódu
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('✅ Ověřovací kód byl odeslán na váš telefon.')
    } catch (error) {
      alert('❌ Chyba při odesílání ověřovacího kódu.')
    } finally {
      setLoading(false)
    }
  }

  // E-mail ověření
  const handleEmailVerification = async () => {
    setLoading(true)
    try {
      // Simulace e-mailu
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('✅ Ověřovací e-mail byl odeslán.')
    } catch (error) {
      alert('❌ Chyba při odesílání ověřovacího e-mailu.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'expired': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Schváleno'
      case 'pending': return 'Čeká na schválení'
      case 'rejected': return 'Zamítnuto'
      case 'expired': return 'Vypršelo'
      default: return 'Nedefinováno'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ověření účtu</h2>
        <p className="text-gray-600">Ověřte svůj účet pro zvýšení důvěryhodnosti</p>
      </div>

      {/* Aktuální stav ověření */}
      {currentVerification && (
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(currentVerification.status)}`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {currentVerification.status === 'approved' ? '✅' : 
               currentVerification.status === 'pending' ? '⏳' : 
               currentVerification.status === 'rejected' ? '❌' : '⚠️'}
            </span>
            <div>
              <h3 className="font-semibold">Aktuální stav ověření</h3>
              <p>{getStatusText(currentVerification.status)}</p>
              {currentVerification.verifiedAt && (
                <p className="text-sm opacity-75">Ověřeno: {new Date(currentVerification.verifiedAt).toLocaleDateString('cs-CZ')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab navigace */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('ares')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ares'
                ? 'border-sage text-sage-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🏢 ARES ověření
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manual'
                ? 'border-sage text-sage-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📄 Manuální ověření
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'status'
                ? 'border-sage text-sage-dark'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Stav žádostí
          </button>
        </nav>
      </div>

      {/* Tab obsah */}
      <div className="p-6">
        {activeTab === 'ares' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">🏢 ARES ověření pro české firmy</h3>
              <p className="text-gray-600">
                Ověřte svou firmu pomocí IČO z obchodního rejstříku
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IČO firmy *
                </label>
                <input
                  type="text"
                  value={aresIco}
                  onChange={(e) => setAresIco(e.target.value.replace(/\D/g, ''))}
                  placeholder="12345678"
                  maxLength={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Zadejte 8místné IČO vaší firmy
                </p>
              </div>

              <button
                onClick={handleAresVerification}
                disabled={loading || aresIco.length !== 8}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  loading || aresIco.length !== 8
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-sage text-sage-dark hover:bg-sage-dark hover:text-white'
                }`}
              >
                {loading ? '🔍 Ověřuji...' : '🔍 Ověřit v ARES'}
              </button>

              {/* ARES výsledky */}
              {aresData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-green-800 mb-3">✅ Nalezené údaje:</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Obchodní jméno:</span> {aresData.obchodni_jmeno}</div>
                    <div><span className="font-medium">Sídlo:</span> {aresData.sidlo.nazev_ulice}, {aresData.sidlo.nazev_obce} {aresData.sidlo.psc}</div>
                    <div><span className="font-medium">Stav:</span> {aresData.stav_subjektu}</div>
                    <div><span className="font-medium">Typ:</span> {aresData.typ}</div>
                  </div>
                  <button
                    onClick={() => {
                      const verificationData: VerificationData = {
                        verificationType: 'ares',
                        status: 'pending',
                        aresIco: aresIco,
                        aresData: aresData
                      }
                      if (onVerificationUpdate) {
                        onVerificationUpdate(verificationData)
                      }
                      alert('✅ Údaje byly odeslány k ověření.')
                    }}
                    className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Odeslat k ověření
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">📄 Manuální ověření</h3>
              <p className="text-gray-600">
                Nahrajte doklad totožnosti nebo živnostenský list
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ dokumentu
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage">
                  <option value="">Vyberte typ dokumentu</option>
                  <option value="identity">Občanský průkaz</option>
                  <option value="passport">Cestovní pas</option>
                  <option value="business">Živnostenský list</option>
                  <option value="company">Výpis z obchodního rejstříku</option>
                  <option value="other">Jiný doklad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nahrát dokument *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-sage hover:text-sage-dark focus-within:outline-none">
                        <span>Nahrát soubor</span>
                        <input 
                          type="file" 
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setManualDocument(e.target.files?.[0] || null)}
                        />
                      </label>
                      <p className="pl-1">nebo přetáhněte sem</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG do 10MB
                    </p>
                  </div>
                </div>
                {manualDocument && (
                  <p className="mt-2 text-sm text-green-600">
                    ✅ {manualDocument.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poznámky
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={3}
                  placeholder="Doplňující informace k ověření..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sage focus:border-sage"
                />
              </div>

              <button
                onClick={handleManualVerification}
                disabled={loading || !manualDocument}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  loading || !manualDocument
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-sage text-sage-dark hover:bg-sage-dark hover:text-white'
                }`}
              >
                {loading ? '📤 Nahrávám...' : '📤 Odeslat k ověření'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">📋 Stav žádostí</h3>
              <p className="text-gray-600">
                Přehled všech vašich ověřovacích žádostí
              </p>
            </div>

            <div className="space-y-4">
              {/* Mock data - budoucí integrace s API */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">ARES ověření</h4>
                    <p className="text-sm text-gray-600">IČO: 12345678</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('pending')}`}>
                    Čeká na schválení
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Odesláno: 12.12.2025 14:30
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">E-mail ověření</h4>
                    <p className="text-sm text-gray-600">test@example.com</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('approved')}`}>
                    Schváleno
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ověřeno: 10.12.2025 09:15
                </p>
              </div>
            </div>

            {/* Další možnosti ověření */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Další možnosti ověření</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handlePhoneVerification}
                  disabled={loading}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="font-medium">📱 Telefonní ověření</div>
                  <div className="text-sm text-gray-600">Ověření pomocí SMS kódu</div>
                </button>
                
                <button
                  onClick={handleEmailVerification}
                  disabled={loading}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="font-medium">✉️ E-mail ověření</div>
                  <div className="text-sm text-gray-600">Ověření pomocí e-mailu</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}