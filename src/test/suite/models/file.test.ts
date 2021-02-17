import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { File, FileData } from '../../../models/file';
import { destroyedId } from '../../../consts/number';
import { Progect } from '../../../models/project';
import { existProgectId } from './test_data/progect';
import { existFileId, existFileData, anotherExistFileId, anotherExistFileData, fileMock } from './test_data/file';

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
        const expectedFile = File.deserialize(fileData, anotherExistFileId + 1);
        const file = File.create(fileData);
        
        assert.deepStrictEqual(file, expectedFile);

        const fileDataForConfirm = File.findByPath(path);
        assert.deepStrictEqual(fileDataForConfirm, expectedFile);
    });

    // unique path???
    it('cannot cretate existFile', () => {
        const existFile = File.create(existFileData);
        assert.strictEqual(existFile, undefined);
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
        const file = File.findById(existFileId);
        if (file == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existFileData with mock");
        }
        const nextFileData = {
            path: anotherExistFileData.path,
            progectId: existProgectId
        }        
        const existFile = File.deserialize(existFileData, existFileId);

        file.update(nextFileData);
        assert.deepStrictEqual(file, existFile);

        const fileForConfirm = File.findById(existFileId);
        assert.deepStrictEqual(fileForConfirm, existFile);
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