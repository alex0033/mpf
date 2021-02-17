import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { File } from '../../../models/file';
import { destroyedId } from '../../../consts/number';
import { Progect } from '../../../models/project';
import { Memo, MemoData } from '../../../models/memo';
import {
    existMemoId,
    existMemoData,
    anotherExistMemoId,
    existMemo2Id,
    existMemo2Data,
    memoIdWithExistProgect,
    memoDataWithExistProgect,
    memoMock
} from './test_data/memo';
import { existFileData, existFileId } from './test_data/file';
import { existProgectData, existProgectId } from './test_data/progect';

const mockfs = require('mock-fs');

describe('MemoData Test Suite', () => {
    beforeEach(() => {
        mockfs(memoMock);
        Progect.loadData();
        File.loadData();
        Memo.loadData();
    });

    afterEach(() => {
        mockfs.restore();
    });

    // CREATE
	it('cretate', () => {
        const memoData: MemoData = {
            progectId: existProgectId,
            fileId: existFileId,
            message: "create memo "
        }
        const id = Memo.size();

        const expectedMemo = Memo.deserialize(memoData, id);
        const memo = Memo.create(memoData);

        assert.deepStrictEqual(memo, expectedMemo);

        const memoDataForConfirm = Memo.findById(id);
        assert.deepStrictEqual(memoDataForConfirm, expectedMemo);
    });

    // READ
    it('findById', () => {
        const existMemo = Memo.deserialize(existMemoData, existMemoId);

        const memo = Memo.findById(existMemoId);
        assert.deepStrictEqual(memo, existMemo);
    });

    it('cannot findById', () => {
        const notExistMemoId = 33;
        const memo = Memo.findById(notExistMemoId);
        assert.deepStrictEqual(memo, undefined);
    });

    it('selectByPath (path = filePath and progectPath)', () => {
        const memos = Memo.selectByPath(existProgectData.path, existFileData.path);
        const existMemo = Memo.deserialize(existMemoData, existMemoId);
        const existMemo2 = Memo.deserialize(existMemo2Data, existMemo2Id);

        assert.deepStrictEqual(memos, [existMemo, existMemo2]);
    });

    it('selectByPath (path = only progectPath)', () => {
        const memos = Memo.selectByPath(existProgectData.path);
        const existMemo = Memo.deserialize(existMemoData, existMemoId);
        const existMemo2 = Memo.deserialize(existMemo2Data, existMemo2Id);
        const memoWithProgect = Memo.deserialize(memoDataWithExistProgect, memoIdWithExistProgect);

        assert.deepStrictEqual(memos, [existMemo, existMemo2, memoWithProgect]);
    });

    it('selectByPath (path = progectPath and notExistFilePath)', () => {
        const notExistFilePath = "not_exist.txt";
        const memos = Memo.selectByPath(existProgectData.path, notExistFilePath);

        assert.deepStrictEqual(memos, []);
    });

    it('selectByPath (path = notExistProgectPath)', () => {
        const notExistProgectPath = "/not/exist";
        const memos = Memo.selectByPath(notExistProgectPath);

        assert.deepStrictEqual(memos, []);
    });

    // UPDATE
    it('can update message', () => {
        const memo = Memo.findById(existMemoId);
        if (memo == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existMemoData with mock");
        }
        const nextMemoData: MemoData = {
            progectId: existProgectId,
            fileId: existFileId,
            message: "update memo "
        }
        const nextMemo = Memo.deserialize(nextMemoData, existMemoId);
        memo.update(nextMemoData);
        assert.deepStrictEqual(memo, nextMemo);

        const memoForConfirm = Memo.findById(existMemoId);
        assert.deepStrictEqual(memoForConfirm, nextMemo);
    });

    // 後ほど、pogectIdを変えるパターンもありか？？

    // DELETE
    it('can delete existMemo', () => {
        const memo = Memo.findById(existMemoId);
        if (memo == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existMemoData with mock");
        }
        
        // instance
        memo.destroy();
        assert.deepStrictEqual(memo.getId(), destroyedId);

        // data
        const memoForConfirm = Memo.findById(existMemoId);
        assert.deepStrictEqual(memoForConfirm, undefined);
    });
});
