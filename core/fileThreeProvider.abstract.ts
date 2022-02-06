import { IDirectory, IFile } from "./fileProvider.interface";


export interface FileAbstractProvider {
    createFile(fileName: string, parent: IDirectory, content: string): Promise<IFile>
    renameFile(file: IFile, newName: string): Promise<IFile>
    deleteFile(file: IFile): Promise<boolean>
}

export interface DirectoryAbstractProvider {
    getDirectory(source: any): Promise<IDirectory>
    createDirectory(directoryName: string, source: any): Promise<IDirectory>
    renameDirectory(directory: IDirectory, newName: string): Promise<IDirectory>
    deleteDirectory(directory: IDirectory): Promise<boolean>
    // TODO: Add method moveDirectory(dir, path)
}

export interface FileExplorerAbstractProvider extends FileAbstractProvider, DirectoryAbstractProvider {
    refresh(): Promise<IDirectory>
}