import * as assert from 'assert';
import { beforeEach, afterEach, describe, it } from 'mocha';
import { Progect, ProgectData } from '../../../models/project';
import { destroyedId } from '../../../consts/number';

// requireでいい？？importで統一？？
const mockfs = require('mock-fs');

const existProgectId = 1;
const existProgectData: ProgectData = {
    title: "exist progect",
    path: "/root/exist"
}
const existProgect = Progect.deserialize(existProgectData, existProgectId);

const anotherExistProgectId = 2;
const anotherExistProgectData: ProgectData = {
    title: "another exist progect",
    path: "/root/another_exist"
}
const anotherExistProgect = Progect.deserialize(anotherExistProgectData, anotherExistProgectId);

const testData = [null, existProgectData, anotherExistProgectData];
const testDataString = JSON.stringify(testData, null, "\t");

describe('Progect Test Suite', () => {
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
        const progect = Progect.findByPath(existProgect.path);
        assert.deepStrictEqual(progect, existProgect, "It should save data");
     });

    // CREATE
	it('cretate', () => {
        const title = "new progect";
        const path = '/root/new';
        const progectData: ProgectData = {
            title: title,
            path: path
        }
        const expectedProgect = Progect.deserialize(progectData, anotherExistProgectId + 1);
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
        const progect = Progect.findByPath(existProgect.path);
        assert.deepStrictEqual(progect, existProgect);
    });

    it('cannot findByPath', () => {
        const notExistProgectPath = "/not/exist";
        const progect = Progect.findByPath(notExistProgectPath);
        assert.deepStrictEqual(progect, undefined);
    });

    // UPDATE
    it('can update title', () => {
        const progect = Progect.findById(existProgectId);
        if (progect == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existProgectData with mock");
        }
        const nextProgectData = {
            title: "change title",
            path: progect.path
        }
        const nextProgect = Progect.deserialize(nextProgectData, existProgectId);
        progect.update(nextProgectData);
        assert.deepStrictEqual(progect, nextProgect);

        const progectForConfirm = Progect.findById(existProgectId);
        assert.deepStrictEqual(progectForConfirm, nextProgect);
    });

    it('can update path to newPath', () => {
        const progect = Progect.findById(existProgectId);
        if (progect == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existProgectData with mock");
        }
        const nextProgectData = {
            title: progect.title,
            path: "/root/new"
        }
        const nextProgect = Progect.deserialize(nextProgectData, existProgectId);
        progect.update(nextProgectData);
        assert.deepStrictEqual(progect, nextProgect);

        const progectForConfirm = Progect.findById(existProgectId);
        assert.deepStrictEqual(progectForConfirm, nextProgect);
    });

    it('cannot update existProgectPath to anotherExistProgectPath', () => {
        const progect = Progect.findById(existProgectId);
        if (progect == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existProgectData with mock");
        }
        const nextProgectData = {
            title: progect.title,
            path: anotherExistProgect.path
        }
        const nextProgect = Progect.deserialize(nextProgectData, existProgectId);

        progect.update(nextProgectData);
        assert.deepStrictEqual(progect, existProgect);

        const progectForConfirm = Progect.findById(existProgectId);
        assert.deepStrictEqual(progectForConfirm, existProgect);
    });

    // DELETE
    it('can delete existProgect', () => {
        const progect = Progect.findById(existProgectId);
        if (progect == undefined) {
            assert.ok(false, "Unexpected error. Cannot save existProgectData with mock");
        }
        
        // instance
        progect.destroy();
        assert.deepStrictEqual(progect.getId(), destroyedId);

        // data
        const progectForConfirm = Progect.findById(existProgectId);
        assert.deepStrictEqual(progectForConfirm, undefined);
    });
});
