import * as path from 'path';
import * as vscode from 'vscode';

// serverRoootDirectory（<=>clientRootDirectory）の可能性
export module server {
    const dataDirectory = path.join(__dirname, "../../mpf_server_data");

    export const progetctDataPath = path.join(dataDirectory, "progect.json");
}

export module client {
    const workspacePath = vscode.workspace.rootPath;

    const dataDirectory = workspacePath && path.join(workspacePath, "../../mpf_client_data");

    const fileDataPath = dataDirectory && path.join(dataDirectory, "file.json");
    const memoDataPath = dataDirectory && path.join(dataDirectory, "memo.json");
}