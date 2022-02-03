export enum EThreeItemType {
    FILE = 'file',
    DIRECTORY = 'directory'
}

export interface IFile {
    name: string,
    path: string,
    type: EThreeItemType.FILE
}

export interface IDirectory {
    name: string,
    path: string,
    children: Array<IDirectory|IFile>,
    type: EThreeItemType.DIRECTORY
}
