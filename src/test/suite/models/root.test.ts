import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { ProgectData } from '../../../models/project';
import { Root } from '../../../models/root';
import { PROGECT_DATA_PATH } from '../../../tools/const';

// requireでいい？？importで統一？？
const mockfs = require('mock-fs');

const testData = [
    {
        rootPath: "/root/path",
        files: []
    }
]
const testDataString = JSON.stringify(testData, null, "\t")

describe('Root Test Suite', () => {
    beforeEach(() => {
        // この書き方はスマートではない
        // "data"ってやだな！！
        // 入っている関数使えるのではdirectoryごと作るてきな！
        // リファクタリング対象として進めましょう
        mockfs({
            "data": {},
            PROGECT_DATA_PATH: testDataString
        });
    });

    afterEach(() => {
        mockfs.restore();
    });

	it('cretate new root', () => {
        const rootPath = "root/new"
        const root = Root.create(rootPath);
        
        if (root) {
            // インスタンスが適切に作られているか
            assert.ok(root.rootPath === rootPath, "It should make instance");
            // データが保存されているか
            assert.ok(ProgectData.fetchRootData(rootPath) !== undefined, "It should save data");
        } else {
            assert.ok(false, "It should not show this message. It cannot make testEnvironment.");
        }
    });

    it('find root', () => {

    });

    it('updatate root', () => {
        
    });

    it('delete root', () => {
    
    });
});
