// import * as assert from 'assert';
// import { beforeEach, afterEach, describe, it } from 'mocha';
// import { ProgectData } from '../../../models/project';
// import { Root } from '../../../models/root';
// import { PROGECT_DATA_PATH } from '../../../tools/const';

// // requireでいい？？importで統一？？
// const mockfs = require('mock-fs');

// const existPath = "/root/exist"
// const existRootData = {
//     rootPath: existPath,
//     files: []
// }
// const testData = [existRootData]
// const testDataString = JSON.stringify(testData, null, "\t")

// describe('Root Test Suite', () => {
//     beforeEach(() => {
//         // この書き方はスマートではない
//         // "data"ってやだな！！
//         // 入っている関数使えるのではdirectoryごと作るてきな！
//         // リファクタリング対象として進めましょう
//         mockfs({
//             data: {
//                 "progect_data.json": testDataString
//             }
//         });
//     });

//     afterEach(() => {
//         mockfs.restore();
//     });

//     it('check mock', () => {
//         // ProgectData.egetData();
//         assert.ok(ProgectData.fetchRootData(existPath) === undefined, "It should save data");
//         // assert.ok(ProgectData.fetchRootData(existPath) !== undefined, "It should save data");
//         // console.log(ProgectData.fetchRootData(existPath));
//         // ProgectData.egetData();
//     }); 

// 	it('cretate new root', () => {
//         ProgectData.egetData();
//         const rootPath = "root/new"
//         const root = Root.create(rootPath);
//         ProgectData.egetData();
//         if (root) {
//             // インスタンスが適切に作られているか
//             assert.ok(root.rootPath === rootPath, "It should make instance");
//             // データが保存されているか
//             assert.ok(ProgectData.fetchRootData(rootPath) !== undefined, "It should save data");
//         } else {
//             assert.ok(false, "It should not show this message. It cannot make testEnvironment.");
//         }
//     });

//     // it('cretate exist root again', () => {
//     //     const root = Root.create(existPath);
//     //     assert.ok(root === undefined, "It should not make instance");
//     // });

//     // it('find exist root', () => {
//     //     const root = Root.create(existPath);
        
//     //     if (root) {
//     //         // インスタンスが適切に作られているか
//     //         assert.ok(root.rootPath === existPath, "It should make instance");
//     //         // データの存在確認
//     //         assert.ok(ProgectData.fetchRootData(existPath) !== undefined, "It should save data");
//     //     } else {
//     //         assert.ok(false, "It should not show this message. It cannot make testEnvironment.");
//     //     }
//     // });

//     // it('updatate root', () => {
        
//     // });

//     // it('delete root', () => {
    
//     // });
// });
