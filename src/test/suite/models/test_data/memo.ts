import { MemoData } from "../../../../models/memo";
import { existProgectId, anotherExistProgectId, testProgectDataString } from "./progect";
import { existFileId, anotherExistFileId, testFileDataString } from "./file";

export const existMemoId = 1;
export const existMemoData: MemoData = {
    progectId: existProgectId,
    fileId: existFileId,
    message: "first memo"
}

export const anotherExistMemoId = 2;
export const anotherExistMemoData: MemoData = {
    progectId: anotherExistProgectId,
    fileId: anotherExistFileId,
    message: "second memo"
}

export const existMemo2Id = 3;
export const existMemo2Data: MemoData = {
    progectId: existProgectId,
    fileId: existFileId,
    message: "third memo"
}

export const memoIdWithExistProgect = 4;
export const memoDataWithExistProgect: MemoData = {
    progectId: existProgectId,
    fileId: -1,
    message: "forth memo"
}

const testMemoData = [null, existMemoData, anotherExistMemoData, existMemo2Data, memoDataWithExistProgect];
const testMemoDataString = JSON.stringify(testMemoData, null, "\t");

export const memoMock = {
    mpf_server_data: {
        "progect.json": testProgectDataString
    },
    mpf_client_data: {
        "file.json": testFileDataString,
        "memo.json": testMemoDataString
    }
};
