import { ProgectData } from "../../../../models/project";

export const existProgectId = 1;
export const existProgectData: ProgectData = {
    title: "exist progect",
    path: "/root/exist"
}

export const anotherExistProgectId = 2;
export const anotherExistProgectData: ProgectData = {
    title: "another exist progect",
    path: "/root/another_exist"
}

const testProgectData = [null, existProgectData, anotherExistProgectData];
export const testProgectDataString = JSON.stringify(testProgectData, null, "\t");

export const progectMock = {
    mpf_server_data: {
        "progect.json": testProgectDataString
    }
};
