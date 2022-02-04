import path from "path";
import { IDirectory, IFile } from "../../core/fileProvider.interface";
import { FSDirectoryProvider } from "../fsProvider/fsDirectoryProvider/fsDirectoryProvider";
import { FSFileProvider } from "../fsProvider/fsFileProvider/fsFileProvider";

export class SecureFsScopingProvider {

    private scope: IDirectory;
    private fileProvider: FSFileProvider;
    private directoryProvider: FSDirectoryProvider;

    constructor(scope: IDirectory) {
        this.scope = scope;
        this.fileProvider = new FSFileProvider();
        this.directoryProvider = new FSDirectoryProvider();
    }

    private isInScope(path: string): boolean {
        const pathInScope = path.startsWith(this.scope.path);
        const isNotScopeDirectory = path !== this.scope.path;

        return pathInScope && isNotScopeDirectory;
    }

    private validateRequest(path: string): Promise<void> {
        if (this.isInScope(path)) {
            return Promise.resolve();
        }

        return Promise.reject(new Error('Action forbidden'));
    }

    async getScope(): Promise<IDirectory> {
        return this.directoryProvider.getDirectory(this.scope.path);
    }

    async createFile(fileName: string, parent: IDirectory, content: string): Promise<IFile> {
        return this.validateRequest(parent.path).then(() => {
            return this.fileProvider.createFile(fileName, parent, content);
        });
    }

    async renameFile(file: IFile, newName: string): Promise<IFile> {
        return this.validateRequest(file.path).then(() => {
            return this.fileProvider.renameFile(file, newName);
        });
    }

    async deleteFile(file: IFile): Promise<boolean> {
        return this.validateRequest(file.path).then(() => {
            return this.fileProvider.deleteFile(file);
        });
    }


    async getDirectory(directoryPath: string): Promise<IDirectory> {
        return this.validateRequest(directoryPath).then(() => {
            return this.directoryProvider.getDirectory(directoryPath);
        })
    }

    async createDirectory(directoryName: string, parentDirectory: IDirectory): Promise<IDirectory> {
        const newDirPath = path.join(parentDirectory.path, directoryName);

        return this.validateRequest(newDirPath).then(() => {
            return this.directoryProvider.createDirectory(directoryName, parentDirectory);
        });
    }

    async renameDirectory(directory: IDirectory, newName: string): Promise<IDirectory> {
        return this.validateRequest(directory.path).then(() => {
            return this.directoryProvider.renameDirectory(directory, newName);
        });
    }

    async deleteDirectory(directory: IDirectory): Promise<boolean> {
        return this.validateRequest(directory.path).then(() => {
            return this.directoryProvider.deleteDirectory(directory);
        });
    }

}