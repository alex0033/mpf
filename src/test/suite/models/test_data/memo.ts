import { MemoData } from "../../../../models/memo";
import { existProgectId, testProgectDataString } from "./progect";
import { existFileId, testFileDataString } from "./file";

export const existMemoId = 1;
export const existMemoData: MemoData = {
    progectId: existProgectId,
    fileId: existFileId,
    message: "first memo"
}

export const anotherExistMemoId = 2;
export const anotherExistMemoData: MemoData = {
    progectId: existProgectId,
    fileId: -1,
    message: "second memo"
}
const testMemoData = [null, existMemoData, anotherExistMemoData];
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
