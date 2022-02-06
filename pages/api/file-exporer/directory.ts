import { NextApiRequest, NextApiResponse } from 'next'
import AppProviders from '../../../config/providerLaucher';
import { FileExplorerAbstractProvider } from '../../../core/fileThreeProvider.abstract';

export default async function DirectoryHandler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.body.id || req.query.id;
    const providerResponse = x => res.status(200).json(x);
    const provider = AppProviders.getProvider(id) as FileExplorerAbstractProvider;

    if (provider) {
        switch(req.method) {
            case 'GET':
                return provider.getDirectory(req.body.source).then(providerResponse);
            case 'POST':
                return provider.createDirectory(req.body.directoryName, req.body.source).then(providerResponse);
            case 'PUT':
                return provider.renameDirectory(req.body.directory, req.body.newName).then(providerResponse);
            case 'DELETE':
                return provider.deleteDirectory(req.body.directory).then(providerResponse);
            default:
        }
    }

    res.status(400).send('Bad request');
}