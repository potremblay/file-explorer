// server.js
import express from 'express';
import next from 'next';
import ProviderLauch from './config/providerLaucher';
import bodyParser from 'body-parser';

import FileExplorerHandler from './pages/api/file-exporer/index';
import FileHandler from './pages/api/file-exporer/file';
import DirectoryHandler from './pages/api/file-exporer/directory';
import FileExplorerRefreshHandler from './pages/api/file-exporer/refresh';

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(async () => {

  await ProviderLauch.generateProviders();

  const server = new express()
  
  server.use(bodyParser.json());

  server.all('/api/file-explorer', FileExplorerHandler)
  server.all('/api/file-explorer/file', FileHandler)
  server.all('/api/file-explorer/directory', DirectoryHandler)
  server.all('/api/file-explorer/refresh', FileExplorerRefreshHandler)

  server.get('*', (req, res) => {
    return handle(req, res)
  });

  server.listen(port, hostname, err => {
    if (err) throw err;

    console.log('Server ready')
  });
})