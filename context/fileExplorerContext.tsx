import { createContext, Context } from "react";
import { IDirectory, IFile } from "../core/fileProvider.interface";
import { FileExplorerAbstractProvider } from "../core/fileThreeProvider.abstract";
import * as serverConfig from '../config/server';

const FileExplorerContext: Context<FileExplorerAbstractProvider> = createContext({
    refresh(): Promise<IDirectory> { return Promise.resolve(null as IDirectory) },
    createFile(fileName: string, parent: IDirectory, content: string): Promise<IFile> { return Promise.resolve(null as IFile) },
    renameFile(file: IFile, newName: string): Promise<IFile> { return Promise.resolve(null as IFile) },
    deleteFile(file: IFile): Promise<boolean> { return Promise.resolve(false) },
    getDirectory(source: any): Promise<IDirectory> { return Promise.resolve(null as IDirectory) },
    createDirectory(directoryName: string, source: any): Promise<IDirectory> { return Promise.resolve(null as IDirectory) },
    renameDirectory(directory: IDirectory, newName: string): Promise<IDirectory> { return Promise.resolve(null as IDirectory) },
    deleteDirectory(directory: IDirectory): Promise<boolean> { return Promise.resolve(false) },
});

/*
    @TODO Need to implement a secure AUTH communication
*/

interface IFileExplorerContextProviderProps {
    providerId: string,
    children?: any
}

export function FileExplorerContextProvider(props: IFileExplorerContextProviderProps) {
    const { providerId } = props;

    const apiRoute = {
        ROOT: serverConfig.serverUrl + '/api/file-explorer/refresh',
        FILE: serverConfig.serverUrl + '/api/file-explorer/file',
        DIRECTORY: serverConfig.serverUrl + '/api/file-explorer/directory'
    };

    function refresh(): Promise<IDirectory> {
        return fetch(apiRoute.ROOT +'?'+ new URLSearchParams({ id: providerId }).toString(), {
            method: 'GET'
        }).then(r => r.json() as Promise<IDirectory>)
    }

    function createFile (fileName: string, parent: IDirectory, content: string): Promise<IFile> {
        return fetch(apiRoute.FILE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: providerId,
                fileName,
                parent,
                content
            })
        }).then(r => r.json() as Promise<IFile>)
    }

    function renameFile (file: IFile, newName: string): Promise<IFile> {
        return fetch(apiRoute.FILE, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: providerId,
                file,
                newName
            })
        }).then(r => r.json() as Promise<IFile>)
    }

    function deleteFile (file: IFile): Promise<boolean> {
        return fetch(apiRoute.FILE, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: providerId,
                file
            })
        }).then(r => r.json()).then(r => r.result as boolean)
    }

    function getDirectory (source: any): Promise<IDirectory> {
        return fetch(apiRoute.DIRECTORY, {
            method: 'GET',
            body: JSON.stringify({
                id: providerId,
                source
            })
        }).then(r => r.json() as Promise<IDirectory>)
    }

    function createDirectory (directoryName: string, source: any): Promise<IDirectory> {
        return fetch(apiRoute.DIRECTORY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: providerId,
                directoryName,
                source
            })
        }).then(r => r.json() as Promise<IDirectory>);
    }

    function renameDirectory (directory: IDirectory, newName: string): Promise<IDirectory> {
        return fetch(apiRoute.DIRECTORY, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: providerId,
                directory,
                newName
            })
        }).then(r => r.json() as Promise<IDirectory>)
    }

    function deleteDirectory (directory: IDirectory): Promise<boolean> {
        return fetch(apiRoute.DIRECTORY, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: providerId,
                directory
            })
        }).then(r => r.json()).then(r => r.result as boolean)
    }

    const context = {
        refresh,
        createFile,
        renameFile,
        deleteFile,
        getDirectory,
        createDirectory,
        renameDirectory,
        deleteDirectory
    }

    return (
        <FileExplorerContext.Provider value={context}>
            { props.children }
        </FileExplorerContext.Provider>
    )
}

export default FileExplorerContext;