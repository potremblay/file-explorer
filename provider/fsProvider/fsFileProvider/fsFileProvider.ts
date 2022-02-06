import { EThreeItemType, IDirectory, IFile } from "../../../core/fileProvider.interface";
import { FileAbstractProvider } from "../../../core/fileThreeProvider.abstract";
import fs from 'fs';
import path from "path";

export class FSFileProvider implements FileAbstractProvider {
    async createFile(fileName: string, parent: IDirectory, content: string): Promise<IFile> {
        return new Promise((resolve, rejects) => {
            const filePath = path.join(parent.path, fileName);

            fs.appendFile(filePath, content, function (err) {
                if (err) return rejects(err);

                resolve({ 
                    name: fileName,
                    path: filePath,
                    type: EThreeItemType.FILE
                });
            });
        })
    }

    async renameFile(file: IFile, newName: string): Promise<IFile> {
        const newPath = path.join(file.path, '..', newName);

        try {
            fs.renameSync(file.path, newPath);
        } catch (error) {
            return Promise.reject(error);
        }

        return {
            name: newName,
            path: newPath,
            type: EThreeItemType.FILE
        }
    }


    async deleteFile(file: IFile): Promise<boolean> {
        try {
            fs.unlinkSync(file.path);
        } catch (error) {
            return Promise.reject(error);
        }

        return true;
    }
}