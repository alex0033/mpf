import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { File, FileData } from '../../../models/file';
import { destroyedId } from '../../../consts/number';
import { Progect } from '../../../models/project';
import { anotherExistProgectId, existProgectData, existProgectId } from './test_data/progect';
import { existFileId, existFileData, existFile2Id, existFile2Data, fileMock } from './test_data/file';

// requireでいい？？importで統一？？
const mockfs = require('mock-fs');

describe('FileData Test Suite', () => {
    beforeEach(() => {
        mockfs(fileMock);
        Progect.loadData();
        File.loadData();
    });

    afterEach(() => {
        mockfs.restore();
    });

    // CREATE
	it('cretate', () => {
        const path = "newText.txt";
        const fileData: FileData = {
            path: path,
            progectId: existProgectId
        }
        const expectedFile = File.deserialize(fileData, File.size());
        const file = File.create(fileData);

        assert.deepStrictEqual(file, expectedFile);

        const fileDataForConfirm = File.findByPathAndProgectId(path, existProgectId);
        assert.deepStrictEqual(fileDataForConfirm, expectedFile);
    });

    // unique path???
    it('can create existPath(unique: progectId, duplicate: filePath)', ()=> {
        const id = File.size();
        const fileData = {
            path: existProgectData.path,
            progectId: anotherExistProgectId
        }
        const file = File.create(fileData);
        const expectedFile = File.deserialize(fileData, id);

        assert.deepStrictEqual(file, expectedFile);

        const fileDataForConfirm = File.findById(id);
        assert.deepStrictEqual(fileDataForConfirm, expectedFile);
    });

    it('cannot cretate existFile(duplicate: filePath and progectId)', () => {
        const file = File.create(existFileData);
        assert.strictEqual(file, undefined);
    });

    // READ
    it('findById', () => {
        const existFile = File.deserialize(existFileData, existFileId);

        const file = File.findById(existFileId);
        assert.deepStrictEqual(file, existFile);
    });

    it('cannot findById', () => {
        const notExistFileId = 33;
        const file = File.findById(notExistFileId);
        assert.deepStrictEqual(file, undefined);
    });

    it('findByPath', () => {
        // 型エラーが・・
        const existFile = File.deserialize(existFileData, existFileId);

        const file = File.findByPath(existFile.relativePath);
        assert.deepStrictEqual(file, existFile);
    });

    it('cannot findByPath', () => {
        const notExistFilePath = "notExist.txt";
        const file = File.findByPath(notExistFilePath);
        assert.deepStrictEqual(file, undefined);
    });

    // UPDATE
    it('can update path to newPath', () => {
        const file = File.findById(existFileId);
        if (file == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existFileData with mock");
        }
        const nextFileData = {
            path: "nextExistText.txt",
            progectId: existFileId
        }
        const nextFile = File.deserialize(nextFileData, existFileId);
        file.update(nextFileData);
        assert.deepStrictEqual(file, nextFile);

        const fileForConfirm = File.findById(existFileId);
        assert.deepStrictEqual(fileForConfirm, nextFile);
    });

    it('cannot update existFilePath to anotherExistFilePath', () => {
        const file = File.findById(existFile2Id);
        if (file == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existFileData with mock");
        }
        const nextFileData = {
            path: existFileData.path,
            progectId: existFileData.progectId
        }
        const expectedFile = File.deserialize(existFile2Data, existFile2Id);

        file.update(nextFileData);
        assert.deepStrictEqual(file, expectedFile);

        const fileForConfirm = File.findById(existFile2Id);
        assert.deepStrictEqual(fileForConfirm, expectedFile);
    });

    // 後ほど、pogectIdを変えるパターンもありか？？

    // DELETE
    it('can delete existFile', () => {
        const file = File.findById(existFileId);
        if (file == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existFileData with mock");
        }
        
        // instance
        file.destroy();
        assert.deepStrictEqual(file.getId(), destroyedId);

        // data
        const fileForConfirm = File.findById(existFileId);
        assert.deepStrictEqual(fileForConfirm, undefined);
    });
});