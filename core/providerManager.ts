import { v4 as uuid } from 'uuid';
import { DirectoryAbstractProvider, FileAbstractProvider, FileExplorerAbstractProvider } from "./fileThreeProvider.abstract";

type AcceptedProvider = FileAbstractProvider | DirectoryAbstractProvider | FileExplorerAbstractProvider;
type ID = string;

export default class ProviderManager {
    private providerRegistry: { ID: AcceptedProvider }|{} = {};

    registerProvider(provider: AcceptedProvider): ID {
        const id = uuid() as string;
        this.providerRegistry[id] = provider;

        return id;
    }

    getProvider(id: ID): AcceptedProvider {
        return this.providerRegistry[id];
    }

    deleteProvider(id: ID) {
        delete this.providerRegistry[id];
    }

    getList() {
        return this.providerRegistry;
    }
}