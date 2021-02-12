import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { File, FileData } from '../../../models/file';
import { destroyedId } from '../../../consts/number';
import { Progect, ProgectData } from '../../../models/project';
import { Memo, MemoData } from '../../../models/memo';

// requireでいい？？importで統一？？
const mockfs = require('mock-fs');

// 下記の変数たちの代入をmock作成後に行いたいで御座んす
const existProgectId = 1;
const existProgectData: ProgectData = {
    title: "exist progect",
    path: "/root/exist"
}
const testProgectData = [null, existProgectData]
const testProgectDataString = JSON.stringify(testProgectData, null, "\t");

const existFileId = 1;
const existFileData: FileData = {
    path: "existText.txt",
    progectId: existProgectId
}
const testFileData = [null, existFileData];
const testFileDataString = JSON.stringify(testFileData, null, "\t");

const existMemoId = 1;
const existMemoData: MemoData = {
    progectId: existProgectId,
    fileId: existFileId,
    message: "first memo"
}
const anotherExistMemoId = 2;
const anotherExistMemoData: MemoData = {
    progectId: existProgectId,
    fileId: -1,
    message: "second memo"
}
const testMemoData = [null, existMemoData, anotherExistMemoData];
const testMemoDataString = JSON.stringify(testMemoData, null, "\t");

describe('MemoData Test Suite', () => {
    beforeEach(() => {
        mockfs({
            mpf_server_data: {
                "progect.json": testProgectDataString
            },
            mpf_client_data: {
                "file.json": testFileDataString,
                "memo.json": testMemoDataString
            }
        });
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
