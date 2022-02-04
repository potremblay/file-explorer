import { FSDirectoryProvider } from "../fsProvider/fsDirectoryProvider/fsDirectoryProvider";
import { SecureFsScopingProvider } from "./secureFsScopingProvider";

export class SecureFsScopingFactory {

    static async createScope(path: string): Promise<SecureFsScopingProvider> {
        const directoryProvider = new FSDirectoryProvider();
        const scope = await directoryProvider.getDirectory(path);

        return new SecureFsScopingProvider(scope);
    }

}