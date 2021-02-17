import { FileData } from "../../../../models/file";
import { existProgectId, testProgectDataString } from "./progect";

export const existFileId = 1;
export const existFileData: FileData = {
    path: "existText.txt",
    progectId: existProgectId
}

export const anotherExistFileId = 2;
export const anotherExistFileData: FileData = {
    path: "anoterExistText.txt",
    progectId: existProgectId
}

const testFileData = [null, existFileData, anotherExistFileData];
export const testFileDataString = JSON.stringify(testFileData, null, "\t");

export const fileMock = {
    mpf_server_data: {
        "progect.json": testProgectDataString
    },
    mpf_client_data: {
        "file.json": testFileDataString
    }
};
