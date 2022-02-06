import { NextApiRequest, NextApiResponse } from 'next'
import AppProviders from '../../../config/providerLaucher';
import { FileExplorerAbstractProvider } from '../../../core/fileThreeProvider.abstract';


export default async function FileExplorerRefreshHandler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.id as string;
    const provider = AppProviders.getProvider(id) as FileExplorerAbstractProvider;

    if (provider && req.method === 'GET') {
        return provider.refresh().then(value => {
            res.status(200).json(value);
        });
    }

    res.status(400).send('bad request');
}