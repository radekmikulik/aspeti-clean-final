// ASPETi PLUS - Provider Profile Edit Page
// KROK 8: FINÁLNÍ INTEGRACE DESIGNU A FUNKCIONALIT

import React from 'react'
import Head from 'next/head'
import { ProviderProfileEdit } from '@/components/Account/ProviderProfileEdit'

export default function ProviderProfileEditPage() {
  return (
    <>
      <Head>
        <title>Upravit profil | ASPETi PLUS</title>
        <meta name="description" content="Upravte svůj profil poskytovatele služeb" />
      </Head>
      <ProviderProfileEdit />
    </>
  )
}
