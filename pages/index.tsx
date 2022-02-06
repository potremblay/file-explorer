import Head from 'next/head'
import { useEffect, useState } from 'react';
import { serverUrl } from '../config/server';
import { FileExplorerContextProvider } from '../context/fileExplorerContext';
import styles from '../styles/Home.module.css'
import Three from '../ui/three/three';

export default function Home() {
  const [ providerIdList, setProviderIdList ] = useState([]);

  useEffect(() => {
    fetch(serverUrl + '/api/file-explorer', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
      setProviderIdList(response.providerIdList)
    })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>File explorer</title>
        <meta name="description" content="File explorer from the Web !" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          File explorer Project
        </h1>

        { providerIdList && providerIdList.map(id => {
          return <FileExplorerContextProvider key={id} providerId={ id }>
            <Three className={ styles.fileExplorer }></Three>
          </FileExplorerContextProvider>
        })}

        
      </main>
    </div>
  )
}
