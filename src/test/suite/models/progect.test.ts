import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { FileData } from '../../../models/file';
import { ProgectData } from '../../../models/project';
import { RootData } from '../../../models/root';

// requireでいい？？importで統一？？
const mockfs = require('mock-fs');

const existRootPath = "/root/exist";
const existRootData: RootData = {
    rootPath: existRootPath,
    files: []
}

const existRootPathWithFile = "/root/exist2";
const existFilePath = `${existRootPathWithFile}/file.txt`;
const existFileData = {
    filePath: existFilePath,
    messages: ["message1", "message2", "message3"] 
}
const existRootDataWithFile = {
    rootPath: existRootPathWithFile,
    files: [existFileData]
}

const testData = [existRootData, existRootDataWithFile];
const testDataString = JSON.stringify(testData, null, "\t")

describe('ProgectData Test Suite', () => {
    beforeEach(() => {
        // この書き方はスマートではない
        // "data"ってやだな！！
        // 入っている関数使えるのではdirectoryごと作るてきな！
        // リファクタリング対象として進めましょう
        mockfs({
            data: {
                "progect_data.json": testDataString
            }
        });
        // これによりデータがProgectDataのクラス変数（Data）に反映される！！
        ProgectData.loadData();
    });

    afterEach(() => {
        mockfs.restore();
    });

    it('check mock', () => {
        const rootData = ProgectData.fetchRootData(existRootPath);
        assert.deepStrictEqual(rootData, existRootData, "It should save data");
     });

    // CREATE RootData
	it('cretate newRootData', () => {
        const rootPath = '/root/new';
        const rootData = ProgectData.createRootData(rootPath);
        const expectedRootData: RootData = {
            rootPath: rootPath,
            files: []
        }
        assert.deepStrictEqual(rootData, expectedRootData);

        const rootDataForConfirm = ProgectData.fetchRootData(rootPath);
        assert.deepStrictEqual(rootDataForConfirm, expectedRootData);
    });

    it('cannot cretate existRootData', () => {
        const rootData = ProgectData.createRootData(existRootPath);
        assert.strictEqual(rootData, undefined);
    });

    // CREATE FileData 
    it('cretate newFileData', () => {
        const filePath = `${existRootPath}/new.txt`;
        const fileData = ProgectData.createFileData(existRootPath, filePath);
        const expectedFileData: FileData = {
            filePath: filePath,
            messages: []
        }
        assert.deepStrictEqual(fileData, expectedFileData);

        const fileDataForConfirm = ProgectData.fetchFileData(existRootPath, filePath);
        assert.deepStrictEqual(fileDataForConfirm, expectedFileData);
    });

    it('cannot cretate existFileData', () => {
        const fileData = ProgectData.createFileData(existRootPathWithFile, existFilePath);
        assert.strictEqual(fileData, undefined);
    });

    // READ RootData
    it('fetch existRootData', () => {
        const rootData = ProgectData.fetchRootData(existRootPath);
        assert.deepStrictEqual(rootData, existRootData);
    });

    it('cannot fetch notExistRootData', () => {
        const rootData = ProgectData.fetchRootData(`${existRootPath}not_exist`);
        assert.strictEqual(rootData, undefined);
    });

    // READ FileData
    it('fetch existFileData', () => {
        const fileData = ProgectData.fetchFileData(existRootPathWithFile, existFilePath);
        assert.deepStrictEqual(fileData, existFileData);
    });

    it('cannot fetch notExistFileData with notExistRootPath', () => {
        const fileData = ProgectData.fetchFileData("not/exist/path", existFilePath);
        assert.strictEqual(fileData, undefined);
    });

    it('cannot fetch notExistFileData with notExistFilePath', () => {
        const fileData = ProgectData.fetchFileData(existRootPathWithFile, `${existRootPathWithFile}/not_exist.txt`);
        assert.strictEqual(fileData, undefined);
    });

    // DELETE RootData
    it('delete rootData', () => {
        ProgectData.deleteRootData(existRootPath);
        const rootData = ProgectData.fetchRootData(existRootPath);
        assert.strictEqual(rootData, undefined);
    });

    it('delete rootDataWithFile', () => {
        ProgectData.deleteRootData(existRootPathWithFile);
        const rootData = ProgectData.fetchRootData(existRootPathWithFile);
        const fileData = ProgectData.fetchFileData(existRootPathWithFile, existFilePath);
        assert.strictEqual(rootData, undefined);
        assert.strictEqual(fileData, undefined);
    });

    // // DELETE FileData
    it('delete fileData', () => {
        ProgectData.deleteFileData(existRootPathWithFile, existFilePath);
        const rootData = ProgectData.fetchRootData(existRootPathWithFile);
        const fileData = ProgectData.fetchFileData(existRootPathWithFile, existFilePath);
        assert.notStrictEqual(rootData, undefined);
        assert.strictEqual(fileData, undefined);
    });
});
