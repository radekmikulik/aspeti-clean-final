import type { NextPage } from 'next'
import Head from 'next/head'
import CleanApp from '@/components/Home/CleanApp'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ASPETi - Katalog nabídek</title>
        <meta name="description" content="ASPETi - Katalog nabídek pro poskytovatele služeb a zákazníky" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CleanApp />
    </>
  )
}

export default Home