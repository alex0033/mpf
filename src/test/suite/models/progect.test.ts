import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { Progect, ProgectData } from '../../../models/project';

// requireでいい？？importで統一？？
const mockfs = require('mock-fs');

const existProgectId = 0;
const existProgectPath = "/root/exist";
const existProgectData: ProgectData = {
    title: "exist progect",
    path: existProgectPath
}
const existProgect = Progect.deserialize(existProgectData);

const testData = [existProgectData];
const testDataString = JSON.stringify(testData, null, "\t");

describe('ProgectData Test Suite', () => {
    beforeEach(() => {
        mockfs({
            mpf_server_data: {
                "progect.json": testDataString
            }
        });
        // これによりデータがProgectのクラス変数（Data）に反映される！！
        Progect.loadData();
    });

    afterEach(() => {
        mockfs.restore();
    });

    it('check mock', () => {
        const progect = Progect.findByPath(existProgectPath);
        assert.deepStrictEqual(progect, existProgect, "It should save data");
     });

    // CREATE Progect
	it('cretate', () => {
        const title = "new progect";
        const path = '/root/new';
        const progectData: ProgectData = {
            title: title,
            path: path
        }
        const expectedProgect = Progect.deserialize(progectData);
        const progect = Progect.create(progectData);
        assert.deepStrictEqual(progect, expectedProgect);

        const progectDataForConfirm = Progect.findByPath(path);
        assert.deepStrictEqual(progectDataForConfirm, expectedProgect);
    });

    // unique path???
    it('cannot cretate existProgect', () => {
        const existProgect = Progect.create(existProgectData);
        assert.strictEqual(existProgect, undefined);
    });

    // READ
    it('findById', () => {
        const progect = Progect.findById(existProgectId);
        assert.deepStrictEqual(progect, existProgect);
    });

    it('cannot findById', () => {
        const notExistProgectId = 33;
        const progect = Progect.findById(notExistProgectId);
        assert.deepStrictEqual(progect, undefined);
    });

    it('findByPath', () => {
        const progect = Progect.findByPath(existProgectPath);
        assert.deepStrictEqual(progect, existProgect);
    });

    it('cannot findByPath', () => {
        const notExistProgectPath = "/not/exist";
        const progect = Progect.findByPath(notExistProgectPath);
        assert.deepStrictEqual(progect, undefined);
    });

    // // DELETE ProgectData
    // it('delete ProgectData', () => {
    //     ProgectData.deleteProgectData(existProgectPath);
    //     const ProgectData = ProgectData.fetchProgectData(existProgectPath);
    //     assert.strictEqual(ProgectData, undefined);
    // });

    // it('delete ProgectDataWithFile', () => {
    //     ProgectData.deleteProgectData(existProgectPathWithFile);
    //     const ProgectData = ProgectData.fetchProgectData(existProgectPathWithFile);
    //     const fileData = ProgectData.fetchFileData(existProgectPathWithFile, existFilePath);
    //     assert.strictEqual(ProgectData, undefined);
    //     assert.strictEqual(fileData, undefined);
    // });

});
