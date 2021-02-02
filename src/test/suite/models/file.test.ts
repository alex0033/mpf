// import * as assert from 'assert';
// import { beforeEach, afterEach, describe, it } from 'mocha';
// import { File, FileData } from '../../../models/file';
// import { ProgectData } from '../../../models/project';
// import { RootData } from '../../../models/root';

// // requireでいい？？importで統一？？
// const mockfs = require('mock-fs');

// const existRootPath = "/root/exist";
// const existFilePath = `${existRootPath}/file.txt`;
// const existFileMessages = ["0", "1", "2"];
// const existFileMessagesLastIndex = existFileMessages.length - 1;
// const existFileData: FileData = {
//     filePath: existFilePath,
//     messages: existFileMessages
// }
// const existRootData: RootData = {
//     rootPath: existRootPath,
//     files: [existFileData]
// }

// const testData = [existRootData]
// const testDataString = JSON.stringify(testData, null, "\t")

// describe('File Test Suite', () => {
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
//         ProgectData.loadData();
//     });

//     afterEach(() => {
//         mockfs.restore();
//     });

//     // CREATE
//     // データの保存確認はProgectDataクラステストの役割！！
//     // ふと思った、
// 	it('cretate newFile', () => {
//         const filePath = `${existRootPath}/new_file.txt`
//         const file = File.create(existRootPath, filePath);
//         assert.strictEqual(file?.filePath, filePath);

//         const fileForConfirm = File.findBy(existRootPath, filePath);
//         assert.deepStrictEqual(fileForConfirm?.filePath, filePath);
//     });

//     it('cannot cretate existFile', () => {
//         const file = File.create(existRootPath, existFilePath);
//         assert.strictEqual(file, undefined);
//     });

//     it('cannot cretate existFile with newRoot', () => {
//         const file = File.create('/root/new', existFilePath);
//         assert.strictEqual(file, undefined);
//     });

//     // READ
//     it('find existFile', () => {
//         const file = File.findBy(existRootPath, existFilePath);
//         assert.strictEqual(file?.filePath, existFilePath);
//     });

//     it('cannot find notExistFile', () => {
//         const file = File.findBy(existRootPath, `${existRootPath}/not_exist_file.txt`);
//         assert.strictEqual(file, undefined);
//     });

//     it('cannot find existFile with notExistRootPath', () => {
//         const file = File.findBy("root/not_exist", existFilePath);
//         assert.strictEqual(file, undefined);
//     });

//     // UPDATE
//     it('updatate existFile', () => {
//         const updatePath = `${existRootPath}/update.txt`;
//         let file = File.findBy(existRootPath, existFilePath);
//         file?.update(updatePath);
//         assert.strictEqual(file?.filePath, updatePath);

//         const previousFile = File.findBy(existRootPath, existFilePath);
//         const nextFile = File.findBy(existRootPath, updatePath);
//         assert.strictEqual(previousFile, undefined);
//         assert.strictEqual(nextFile?.filePath, updatePath);
//     });

//     it('create Message', () => {
//         const message = "message"
//         let file = File.findBy(existRootPath, existFilePath);
//         file?.createMessage(message);
//         assert.strictEqual(file?.messages[existFileMessagesLastIndex + 1], message);

//         const updateFile = File.findBy(existRootPath, existFilePath);
//         assert.strictEqual(updateFile?.messages[existFileMessagesLastIndex + 1], message);
//     });

//     it('updatate message', () => {
//         const index = 2;
//         const message = "2 is updated";
//         let file = File.findBy(existRootPath, existFilePath);
//         file?.updateMessage(message, index);
//         assert.strictEqual(file?.messages[index], message);

//         const updateFile = File.findBy(existRootPath, existFilePath);
//         assert.strictEqual(updateFile?.messages[index], message);
//     });

//     it('delete message', () => {
//         const index = 1;
//         let file = File.findBy(existRootPath, existFilePath);
//         const message = file?.messages[index]
//         file?.deleteMessage(index);
//         if (message) {
//             assert.notStrictEqual(file?.messages.indexOf(message), message);

//             const updateFile = File.findBy(existRootPath, existFilePath);
//             assert.notStrictEqual(updateFile?.messages[index], message);
//         } else {
//             assert.ok(false, "It is unexpeced error. Message should not be undefined.")
//         }
//     });

//     // DELETE
//     it('delete file', () => {
//         let file = File.findBy(existRootPath, existFilePath);
//         file?.destroy();
//         const destroyedfile = File.findBy(existRootPath, existFilePath);
//         // 本当はこの仕様にしたい！！
//         // assert.strictEqual(file, undefined);
//         assert.strictEqual(destroyedfile, undefined);
//     });
// });
