import { IDirectory, IFile } from "./fileProvider.interface";


export abstract class FileAbstractProvider {
    abstract createFile(fileName: string, parent: IDirectory, content: string): Promise<IFile>
    abstract renameFile(file: IFile, newName: string): Promise<IFile>
    abstract deleteFile(file: IFile): Promise<boolean>
}

export abstract class DirectoryAbstractProvider {
    abstract getDirectory(source: any): Promise<IDirectory>
    abstract createDirectory(directoryName: string, source: any): Promise<IDirectory>
    abstract renameDirectory(directory: IDirectory, newName: string): Promise<IDirectory>
    abstract deleteDirectory(directory: IDirectory): Promise<boolean>
    // TODO: Add method moveDirectory(dir, path)
}
