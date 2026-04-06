'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function CookieBanner() {
  const t = useTranslations('cookie')
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    necessari: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = (type: 'all' | 'selected' | 'necessary') => {
    const consent = {
      necessari: true,
      analytics: type === 'all' || (type === 'selected' && preferences.analytics),
      marketing: type === 'all' || (type === 'selected' && preferences.marketing),
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookie-consent', JSON.stringify(consent))
    setVisible(false)
    if (consent.analytics) document.dispatchEvent(new CustomEvent('cookie-consent-analytics'))
    if (consent.marketing) document.dispatchEvent(new CustomEvent('cookie-consent-marketing'))
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-border p-5 md:p-6">
        {!showDetails ? (
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-1">{t('titolo')}</h3>
              <p className="text-text-light text-sm leading-relaxed">
                {t('descrizione')}{' '}
                <Link href="/privacy" className="text-secondary underline">{t('privacyLink')}</Link> &{' '}
                <Link href="/cookie-policy" className="text-secondary underline">{t('cookieLink')}</Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-shrink-0">
              <button onClick={() => setShowDetails(true)} className="text-sm text-text-muted hover:text-primary transition-colors px-4 py-2">{t('personalizza')}</button>
              <button onClick={() => accept('necessary')} className="text-sm border border-border text-text-light hover:bg-background rounded-lg px-4 py-2 transition-colors">{t('soloNecessari')}</button>
              <button onClick={() => accept('all')} className="text-sm bg-primary text-white hover:bg-primary-dark rounded-lg px-6 py-2 transition-colors font-medium">{t('accettaTutti')}</button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">{t('gestisciTitolo')}</h3>
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="text-sm font-medium text-primary">{t('necessari')}</p>
                  <p className="text-xs text-text-muted">{t('necessariDesc')}</p>
                </div>
                <div className="w-10 h-5 bg-accent rounded-full relative cursor-not-allowed">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="text-sm font-medium text-primary">{t('analytics')}</p>
                  <p className="text-xs text-text-muted">{t('analyticsDesc')}</p>
                </div>
                <button onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))} className={`w-10 h-5 rounded-full relative transition-colors ${preferences.analytics ? 'bg-accent' : 'bg-border'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${preferences.analytics ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="text-sm font-medium text-primary">{t('marketing')}</p>
                  <p className="text-xs text-text-muted">{t('marketingDesc')}</p>
                </div>
                <button onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))} className={`w-10 h-5 rounded-full relative transition-colors ${preferences.marketing ? 'bg-accent' : 'bg-border'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${preferences.marketing ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowDetails(false)} className="text-sm text-text-muted hover:text-primary px-4 py-2">{t('indietro')}</button>
              <button onClick={() => accept('selected')} className="text-sm bg-primary text-white hover:bg-primary-dark rounded-lg px-6 py-2 transition-colors font-medium">{t('salvaPreferenze')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
