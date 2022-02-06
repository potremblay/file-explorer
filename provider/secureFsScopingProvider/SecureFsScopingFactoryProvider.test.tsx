import { SecureFsScopingFactory } from "./SecureFsScopingFactoryProvider";
import { join } from 'path';

const baseDirPath = join(__dirname, '../../playground/testingPlayground/scopeSecurity');

describe('Secure File System Scoping Factory', () => {
    test('Access to create method to generate a Secure File System access', () => {
        expect(SecureFsScopingFactory.createScope).toBeDefined()
        expect(typeof SecureFsScopingFactory.createScope).toBe('function')
    });

    test('Should generate a Secure Scope Provider Object', async () => {
        const fsProvider = await SecureFsScopingFactory.createScope(baseDirPath);

        expect(fsProvider).toBeDefined();
    });
});