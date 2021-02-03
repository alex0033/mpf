import * as path from 'path';
import * as vscode from 'vscode';

const rootDirecrory = path.join(__dirname, "../..");

export module server {
    export const dataDirectory = path.join(rootDirecrory, "mpf_server_data");

    export const progectDataPath = path.join(dataDirectory, "progect.json");
}

export module client {
    const workspacePath = vscode.workspace.rootPath;

    const dataDirectory = workspacePath && path.join(workspacePath, "../../mpf_client_data") || path.join(rootDirecrory, "mpf_client_data");

    export const fileDataPath = dataDirectory && path.join(dataDirectory, "file.json");
    export const memoDataPath = dataDirectory && path.join(dataDirectory, "memo.json");
}