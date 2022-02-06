import { NextApiRequest, NextApiResponse } from 'next'
import AppProviders from '../../../config/providerLaucher';
import { FileExplorerAbstractProvider } from '../../../core/fileThreeProvider.abstract';

export default async function FileHandler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.body.id || req.query.id;
    const providerResponse = x => res.status(200).json(x);
    const provider = AppProviders.getProvider(id) as FileExplorerAbstractProvider;

    if (provider) {
        switch(req.method) {
            case 'POST':
                const { fileName, parent, content } = req.body;
                return provider.createFile(fileName, parent, content).then(providerResponse);
            case 'PUT':
                const { file, newName } = req.body;
                return provider.renameFile(file, newName).then(providerResponse);
            case 'DELETE':
                return provider.deleteFile(req.body.file).then(providerResponse);
            default:
        }
    }

    return res.status(400).send('Bad Request')
}