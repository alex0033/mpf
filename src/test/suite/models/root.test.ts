import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { ProgectData } from '../../../models/project';
import { Root, RootData } from '../../../models/root';

// requireでいい？？importで統一？？
const mockfs = require('mock-fs');

const existRootPath = "/root/exist"
const existRootData: RootData = {
    rootPath: existRootPath,
    files: []
}
const testData = [existRootData]
const testDataString = JSON.stringify(testData, null, "\t")

describe('Root Test Suite', () => {
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
        ProgectData.loadData();
    });

    afterEach(() => {
        mockfs.restore();
    });

    // CREATE
    // データの保存確認はProgectDataクラステストの役割！！
	it('cretate newRoot', () => {
        const rootPath = "/root/new"
        const root = Root.create(rootPath);
        assert.strictEqual(root?.rootPath, rootPath);

        const rootForConfirm = Root.findBy(rootPath);
        assert.deepStrictEqual(rootForConfirm?.rootPath, rootPath);
    });

    it('cannot cretate existRoot', () => {
        const root = Root.create(existRootPath);
        assert.strictEqual(root, undefined);
    });

    // READ
    it('find existRoot', () => {
        const root = Root.findBy(existRootPath);
        assert.strictEqual(root?.rootPath, existRootPath);
    });

    it('cannot find notExistRoot', () => {
        const root = Root.findBy("/not/exist/path");
        assert.strictEqual(root, undefined);
    });

    // UPDATE
    it('updatate exisRoot', () => {
        const updatePath = "/root/update/path";
        let root = Root.findBy(existRootPath);
        root?.update(updatePath);
        assert.strictEqual(root?.rootPath, updatePath);

        const previousRoot = Root.findBy(existRootPath);
        const nextRoot = Root.findBy(updatePath);
        assert.strictEqual(previousRoot, undefined);
        assert.notStrictEqual(nextRoot, undefined);
    });

    // DELETE
    it('delete root', () => {
        let root = Root.findBy(existRootPath);
        root?.destroy();
        const DestroyedRoot = Root.findBy(existRootPath);
        // 本当はこの仕様にしたい！！
        // assert.strictEqual(root, undefined);
        assert.strictEqual(DestroyedRoot, undefined);
    });
});
