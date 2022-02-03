import { FSDirectoryProvider } from "../fsDirectoryProvider/fsDirectoryProvider";
import { FSFileProvider } from "./fsFileProvider";
import { join } from 'path';
import rimraf from 'rimraf';
import { IDirectory, IFile } from "../../../core/fileProvider.interface";

const baseDirPath = join(__dirname, '../../../playground');
let fileProvider: FSFileProvider;
let directoryProvider: FSDirectoryProvider;
let baseDir: IDirectory;

beforeAll(done => {
  rimraf(join(baseDirPath, './*'), done);
});

beforeEach(async () => {
  directoryProvider = new FSDirectoryProvider();
  fileProvider = new FSFileProvider();

  baseDir = await directoryProvider.getDirectory(baseDirPath);
});

test('should initialize', () => {
    expect(fileProvider).toBeDefined();
});

test('should create file', async () => {
    fileProvider.createFile('mytest.txt', baseDir, 'this is my first test');
});

test('should rename file', async () => {
    // File from last test
    const file = baseDir.children[0] as IFile;
    expect(file.name).toEqual('mytest.txt');

    const renamedFile = await fileProvider.renameFile(file, 'tikidou.txt')
    expect(renamedFile.name).toEqual('tikidou.txt');

    const renamedFileFromDirectory = await (await directoryProvider.getDirectory(baseDirPath)).children[0] as IFile;
    expect(renamedFileFromDirectory.name).toEqual('tikidou.txt');
});

test('should delete file', async () => {
    // File from last test
    const file = baseDir.children[0] as IFile;

    await expect(fileProvider.deleteFile(file)).resolves.toBeTruthy();
});
