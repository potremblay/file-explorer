import { FSDirectoryProvider } from './fsDirectoryProvider';
import { join } from 'path';
import rimraf from 'rimraf';

const baseDirPath = join(__dirname, '../../../playground/testingPlayground/directory');
let directoryProvider: FSDirectoryProvider;

beforeAll(done => {
  rimraf(join(baseDirPath, './*'), done);
});

beforeEach(() => {
  directoryProvider = new FSDirectoryProvider();
});

test('initialize correctly', () => {
  expect(directoryProvider).toBeDefined();
});

test('should get a directory', async () => {
  const baseDir = await directoryProvider.getDirectory(baseDirPath)

  expect(baseDir.name).toBe('directory');
});

test('should create a directory in directory', async () => {
  const baseDir = await directoryProvider.getDirectory(baseDirPath)
  const newDir = await directoryProvider.createDirectory('test', baseDir);

  expect(newDir.name).toBe('test')
});

test('should rename a directory', async () => {
  const lastCreatedDir = await directoryProvider.getDirectory(join(baseDirPath, 'test'));
  
  const result = await directoryProvider.renameDirectory(lastCreatedDir, 'testNumberTwo');
  expect(result.name).toBe('testNumberTwo');
});

test('should delete directory', async () => {
  const lastCreatedDir = await directoryProvider.getDirectory(join(baseDirPath, 'testNumberTwo'));

  await expect(directoryProvider.deleteDirectory(lastCreatedDir)).resolves.toBeTruthy();
});
