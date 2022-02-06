import { DirectoryAbstractProvider } from "../../../core/fileThreeProvider.abstract";
import { EThreeItemType, IDirectory, IFile } from "../../../core/fileProvider.interface";
import fs from 'fs';
import path from 'path';
import rimraf from "rimraf";

export class FSDirectoryProvider implements DirectoryAbstractProvider {

    async getDirectory(directoryPath: string): Promise<IDirectory> {
        const resolvedPath = path.resolve(directoryPath);
        const name = path.basename(directoryPath);
        let children = [];
        
        try {
            const directoryItemList = fs.readdirSync(directoryPath);

            for (let i = 0; i < directoryItemList.length; i++) {
                const itemName = directoryItemList[i];
                const itemPath = path.join(resolvedPath, itemName);
                const stats = fs.statSync(itemPath);
    
                if (stats.isFile()) {
                    children.push({
                        name: itemName,
                        path: itemPath,
                        type: EThreeItemType.FILE
                    } as IFile);
                } else if (stats.isDirectory()) {
                    children.push(await this.getDirectory(itemPath));
                }
            }
        } catch (error) {
            return Promise.reject(error);
        }

        return {
            name,
            path: resolvedPath,
            children,
            type: EThreeItemType.DIRECTORY
        };
    }

    async createDirectory(dirName: string, parentDir: IDirectory): Promise<IDirectory> {
        const newDirPath = path.join(parentDir.path, dirName);

        if (fs.existsSync(newDirPath)){
            return Promise.reject(new Error('Directory already exist with same name'));
        }

        fs.mkdirSync(newDirPath);

        return this.getDirectory(newDirPath);
    }

    async renameDirectory(dir: IDirectory, newName: string): Promise<IDirectory> {
        const newPathName = path.join(dir.path, '..', newName);

        return new Promise((resolve, reject) => {
            fs.rename(dir.path, newPathName, (err) => {
                if(err) {
                    reject(err);
                }

                resolve(this.getDirectory(newPathName));
            });
        });
    }

    async deleteDirectory(dir: IDirectory): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            rimraf(dir.path, err => {
                if (err) {
                    reject(err);
                }

                resolve(true);
            });
        });
    }

}