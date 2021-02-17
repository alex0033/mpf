import { FileData } from "../../../../models/file";
import { existProgectId, anotherExistProgectId, testProgectDataString } from "./progect";

const existFilePath = "existText.txt";
export const existFileId = 1;
export const existFileData: FileData = {
    path: existFilePath,
    progectId: existProgectId
}

export const anotherExistFileId = 2;
export const anotherExistFileData: FileData = {
    path: "anoterExistText.txt",
    progectId: anotherExistProgectId
}

export const existFile2Id = 3;
export const existFile2Data: FileData = {
    path: "existFile2.txt",
    progectId: existProgectId
}

const testFileData = [null, existFileData, anotherExistFileData, existFile2Data];
export const testFileDataString = JSON.stringify(testFileData, null, "\t");

export const fileMock = {
    mpf_server_data: {
        "progect.json": testProgectDataString
    },
    mpf_client_data: {
        "file.json": testFileDataString
    }
};
