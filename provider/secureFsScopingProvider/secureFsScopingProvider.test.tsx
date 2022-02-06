import { SecureFsScopingFactory } from "./SecureFsScopingFactoryProvider";
import { join } from 'path';
import { SecureFsScopingProvider } from "./secureFsScopingProvider";
import { FSDirectoryProvider } from "../fsProvider/fsDirectoryProvider/fsDirectoryProvider";

const baseDirPath = join(__dirname, '../../playground/testingPlayground/scopeSecurity');

describe('Secure File System Scoping Provider', () => {
    test('Should be able to instantiate', async () => {
        const scope = await (new FSDirectoryProvider()).getDirectory(baseDirPath);

        expect(new SecureFsScopingProvider(scope)).toBeDefined()
    });

    describe('Should be able to manipulate folder', () => {
        let fsProvider: SecureFsScopingProvider;

        beforeEach(async () => {
            fsProvider = await SecureFsScopingFactory.createScope(baseDirPath);
        });

        test('Should give the content of the scope', async () => {
            const scope = await fsProvider.getScope();
            
            expect(scope).toBeDefined();
            expect(scope.path).toEqual(baseDirPath);
        });

        test('Should allow to create directory in scope', async () => {
            const scope = await fsProvider.getScope();
            const newDir = await fsProvider.createDirectory('test', scope);

            expect(newDir.path).toEqual(join(baseDirPath, 'test'))
        });

        test('Should allow to rename directory in scope', async () => {
            let dir = await fsProvider.getDirectory(join(baseDirPath, 'test'));

            const renamedDirectory = await fsProvider.renameDirectory(dir, 'blue');

            expect(renamedDirectory).toBeDefined();
            expect(renamedDirectory.name).toEqual('blue');
        });

        test('Should allow to delete directory in scope', async () => {
            let dir = await fsProvider.getDirectory(join(baseDirPath, 'blue'));

            await expect(fsProvider.deleteDirectory(dir)).resolves.toEqual(true);
        });

    });

    describe('Should not be allow to manipulate folder out of scope', () => {
        const scopeForForbiddenAction = 'haveAccess';
        let fsProvider: SecureFsScopingProvider;

        beforeEach(async () => {
            // Take playground/test as scope
            fsProvider = await SecureFsScopingFactory.createScope(join(baseDirPath, scopeForForbiddenAction));
        });

        test('Should not be able to create a folder out of the scope', async () => {
            const scope = await fsProvider.getScope();
            const dishonestAccess = Object.assign({}, scope, {
                path: join(scope.path, '..') // Try to go outside of the scope.
            });

            await expect(fsProvider.createDirectory('illegalFolder', dishonestAccess)).rejects.toThrow();
        });

        test('Should not be able to rename a folder out of the scope', async () => {
            const scope = await fsProvider.getScope();
            const dishonestAccess = Object.assign({}, scope, {
                path: join(scope.path, '..', 'directoryWhoShallNotBeRename') // Try to go outside of the scope.
            });

            await expect(fsProvider.renameDirectory(dishonestAccess, 'newNameForFolder')).rejects.toThrow();
        });

        test('Should not be able to delete a folder out of the scope', async () => {
            const scope = await fsProvider.getScope();
            const directoryOutOfScope = Object.assign({}, scope, {
                path: join(scope.path, '..', 'directoryWhoShallNotBeDeleted') // Try to go outside of the scope.
            });

            await expect(fsProvider.deleteDirectory(directoryOutOfScope)).rejects.toThrow();
        });
    });

    // @TODO Add test for files manipulation also
});