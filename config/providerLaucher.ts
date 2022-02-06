import ProviderManager from "../core/providerManager";
import { SecureFsScopingFactory } from "../provider/secureFsScopingProvider/SecureFsScopingFactoryProvider";

class AppProvidersGenerator {
    private isGenerated: boolean = false;
    private generationProcess: Promise<void> = null;
    private manager = new ProviderManager();

    private generateProviderForFileSystem() {
        const directoryList = process.env.DIRECTORIES.split(process.env.DIRECTORY_LIST_SEPARATOR);
        const providerGenerationList = [];
    
        for (let i = 0; i < directoryList.length; i++) {
            providerGenerationList.push(
                SecureFsScopingFactory.createScope(directoryList[i]).then(provider => {
                    this.manager.registerProvider(provider);
                })
            );
        }
    
        return Promise.all(providerGenerationList);
    }

    generateProviders() {
        if (this.isGenerated) {
            return Promise.resolve();
        }

        if (this.generationProcess === null) {
            this.generationProcess = Promise.all([
                this.generateProviderForFileSystem()
            ]).then(() => {
                this.isGenerated = true;
            });
        }

        return this.generationProcess;
    }

    getProviderList() {
        return this.manager.getList();
    }

    getProvider(id: string) {
        return this.manager.getProvider(id);
    }
}

const AppProviders = new AppProvidersGenerator();

export default AppProviders;
