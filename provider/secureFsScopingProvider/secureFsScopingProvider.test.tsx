import { SecureFsScopingFactory } from "./SecureFsScopingFactoryProvider";
import { join } from 'path';
import { SecureFsScopingProvider } from "./secureFsScopingProvider";
import { FSDirectoryProvider } from "../fsProvider/fsDirectoryProvider/fsDirectoryProvider";
import rimraf from "rimraf";

const baseDirPath = join(__dirname, '../../playground');

beforeAll(done => {
    rimraf(join(baseDirPath, './*'), done);
});

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
            let scope = await fsProvider.getScope()
            let firstDirectoryInScope = scope.children[0] as any;

            const newDirectory = await fsProvider.renameDirectory(firstDirectoryInScope, 'blue');

            expect(newDirectory).toBeDefined();
            expect(newDirectory.name).toEqual('blue');

            // Verify change from scope
            scope = await fsProvider.getScope()
            firstDirectoryInScope = scope.children[0] as any;
            expect(firstDirectoryInScope.name).toEqual('blue');
        });

        test('Should allow to delete directory in scope', async () => {
            let scope = await fsProvider.getScope()
            let firstDirectoryInScope = scope.children[0] as any;

            await expect(fsProvider.deleteDirectory(firstDirectoryInScope)).resolves.toEqual(true);

            // Test from scope
            scope = await fsProvider.getScope();
            expect(scope.children.length).toEqual(0);
        });

    });

    describe('Should not be allow to manipulate folder out of scope', () => {
        const scopeForForbiddenAction = 'secure';
        let fsProvider: SecureFsScopingProvider;

        beforeAll(async () => {
            const dirProvider = new FSDirectoryProvider();
            const playground = await dirProvider.getDirectory(baseDirPath);

            // Create a folder in playground as scope.
            // Will allow to play in the playground for forbidden action in case of error
            await dirProvider.createDirectory(scopeForForbiddenAction, playground);
            await dirProvider.createDirectory('directoryWhoShallNotBeRename', playground);
            await dirProvider.createDirectory('directoryWhoShallNotBeDeleted', playground);
        });

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