import * as assert from 'assert';
import { ProgectData } from '../../../models/project';
import { Root } from '../../../models/root';
import { PROGECT_DATA_PATH } from '../../../tools/const';

const mock = require('mock-fs');

const testData = [
    {
        rootPath: "/root/path",
        files: []
    }
]
const testDataString = JSON.stringify(testData, null, "\t")

suite('Root Test Suite', () => {
    // beforeEach(() => {
    //     // mock({
    //     //     PROGECT_DATA_PATH: testDataString
    //     // });
    // });

    // afterEach(() => {
    //     // mock.restore();
    // });

	test('cretate new root', () => {
        const rootPath = "root/new"
        let root = Root.create(rootPath);
        if (root) {
            // インスタンスが適切に作られているか
            assert.ok(root.rootPath === rootPath, "It should make instance");
            // データが保存されているか
            assert.ok(ProgectData.fetchRootData(rootPath) !== undefined, "It should save data");
        } else {
            assert.ok(false, "It should not show this message. It cannot make testEnvironment.");
        }
    });

    test('find root', () => {

    });

    test('updatate root', () => {
        
    });

    test('delete root', () => {
    
    });
});
