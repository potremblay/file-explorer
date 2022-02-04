import Head from 'next/head'
import { useState } from 'react';
import { SecureFsScopingFactory } from '../provider/secureFsScopingProvider/SecureFsScopingFactoryProvider'
import styles from '../styles/Home.module.css'
import DirectoryItem from '../ui/directoryItem/directoryItem'


export async function getServerSideProps() {
  const fsProvider = await SecureFsScopingFactory.createScope(process.env.DIRECTORIES);

  const data = await fsProvider.getScope();

  // Pass data to the page via props
  return { props: { data } }
}

export default function Home(props) {

  return (
    <div className={styles.container}>
      <Head>
        <title>File explorer</title>
        <meta name="description" content="File explorer from the Web !" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          File explorer
        </h1>

        { !props.data ? 'loading' : <DirectoryItem directory={props.data}></DirectoryItem> }
        
      </main>
    </div>
  )
}
