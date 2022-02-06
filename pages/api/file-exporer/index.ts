import { NextApiRequest, NextApiResponse } from 'next'
import AppProviders from '../../../config/providerLaucher';

export default async function FileExplorerHandler(req: NextApiRequest, res: NextApiResponse) {
    const idList = Object.keys(AppProviders.getProviderList());

    const response = {
        providerIdList: idList
    };

    res.status(200).json(response);
}