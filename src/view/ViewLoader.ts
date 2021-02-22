import * as vscode from "vscode";
import * as path from "path";
import { Memo } from "../models/memo";
import { Progect, ProgectData } from "../models/project";
import { File, FileData } from "../models/file";
import { PathInfo } from "../consts/types";

export default class ViewLoader {
    readonly _panel: vscode.WebviewPanel | undefined;
    private progectPath: string | undefined;
    private filePath: string | undefined;
    private pathInfoType: PathInfo.types;
    private readonly _extensionPath: string;

    // ViewStateクラスを作るべきなのか？？？

    constructor(context: vscode.ExtensionContext, progectPath: string, filePath?: string) {
        this._extensionPath = context.extensionPath;

        this._panel = vscode.window.createWebviewPanel(
            "configView",
            "Config View",
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,

                localResourceRoots: [
                    // changed
                    vscode.Uri.file(path.join(this._extensionPath, "configViewer"))
                ]
            }
        );
        this._panel.webview.html = this.getWebviewContent();

        // 下記で初期値代入
        this.pathInfoType = PathInfo.yyy;

        this.setState(progectPath, filePath);

        this.postMessage();

        this.listenMessage(context);
    }

    // activeProgectPath, activeFilePath
    private setState(progectPath: string, filePath?: string) {
        this.progectPath = this.getProgectPath(progectPath);

        if (this.progectPath == undefined) {
            this.filePath = undefined;
            this.pathInfoType = PathInfo.nnn;
            return;
        } else if (filePath == undefined) {
            this.filePath = undefined;
            this.pathInfoType = PathInfo.ynn;
            return;
        }

        const activeFileRelativePath = path.relative(progectPath, filePath);
        this.filePath = this.getFileAbsolutePath(progectPath, activeFileRelativePath);
        if (this.filePath == undefined) {
            this.pathInfoType = PathInfo.yyn;
        }
    }

    private getProgectPath(progectPath: string): string | undefined {
        return Progect.findByPath(progectPath)?.path;
    }

    private getFileAbsolutePath(progectPath: string, fileRelativePath: string): string | undefined {
        return File.findByPaths(progectPath, fileRelativePath)?.absolutePath;
    }

    // vscode => now(viewLoader) => webView
    updateState(progectPath: string, filePath?: string) {
        this.setState(progectPath, filePath);
        this.postMessage();
    }

    // webView => now(viewLoader) => progect model
    createProgect(progectData: ProgectData) {
        Progect.create(progectData);
    }

    // webView => now(viewLoader) => progect model
    createFile(fileData: FileData) {
        File.create(fileData);
    }

    private postMessage() {
        if (this._panel) {
            this._panel.webview.postMessage({
                pathInfoType: this.pathInfoType
                // progectMemos: this.progectMemos(),
                // fileMemos: this.fileMemos()
            });
        }
    }

    // webview => now(viewLoader)
    private listenMessage(context: vscode.ExtensionContext) {
        this._panel && this._panel.webview.onDidReceiveMessage(
            message => {
                vscode.window.showErrorMessage(message.message);
                console.log("come onDidReceive////");
                vscode.window.showInformationMessage(message.message);
                console.log(message);
            },
            undefined,
            context.subscriptions
        );
    }

    private getWebviewContent(): string {
        // Local path to main script run in the webview
        const reactAppPathOnDisk = vscode.Uri.file(
            path.join(this._extensionPath, "configViewer", "configViewer.js")
        );
        let reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

        // 下記CSSのリンクは要変更ですな
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/home/alex/desktop/vs_code_extentions/mpf/out/view/app/index.css">
            <title>Config View</title>
            <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                            img-src https:;
                            script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                            style-src vscode-resource: 'unsafe-inline';">
            <script>
                const vscode = acquireVsCodeApi();
            </script>
        </head>
        <body>
            <div id="root">
                <script src="${reactAppUri}"></script>
            </div>
        </body>
        </html>`;
    }

    private progectMemos(): Memo[] {
        if (this.progectPath) {
            return Memo.selectByPath(this.progectPath);
        }
        return [];
    }

    private fileMemos(): Memo[] {
        if (this.progectPath && this.filePath) {
            return Memo.selectByPath(this.progectPath, this.filePath);
        }
        return [];
    }
}
