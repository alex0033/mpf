import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { File } from '../../../models/file';
import { destroyedId } from '../../../consts/number';
import { Progect } from '../../../models/project';
import { Memo, MemoData } from '../../../models/memo';
import { existMemoId, existMemoData, anotherExistMemoId, memoMock } from './test_data/memo';
import { existFileId } from './test_data/file';
import { existProgectId } from './test_data/progect';

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
        const expectedMemo = Memo.deserialize(memoData, anotherExistMemoId + 1);
        const memo = Memo.create(memoData);

        assert.deepStrictEqual(memo, expectedMemo);

        const memoDataForConfirm = Memo.findById(anotherExistMemoId + 1);
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
