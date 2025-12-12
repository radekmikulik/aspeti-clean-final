import type { NextPage } from 'next'
import Head from 'next/head'
import AppInner from '@/components/Home/AppInner'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ASPETi - Katalog nabídek</title>
        <meta name="description" content="ASPETi - Katalog nabídek pro poskytovatele služeb a zákazníky" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppInner />
    </>
  )
}

export default Home