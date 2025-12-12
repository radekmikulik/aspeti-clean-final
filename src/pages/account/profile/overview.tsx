// ASPETi PLUS - Provider Profile Overview Page (Public)
// KROK 8: FINÁLNÍ INTEGRACE DESIGNU A FUNKCIONALIT

import React from 'react'
import Head from 'next/head'
import { ProviderProfileOverview } from '@/components/Account/ProviderProfileOverview'

export default function ProviderProfileOverviewPage() {
  return (
    <>
      <Head>
        <title>Profil poskytovatele | ASPETi PLUS</title>
        <meta name="description" content="Prohlédněte si profil poskytovatele služeb" />
      </Head>
      <ProviderProfileOverview />
    </>
  )
}
