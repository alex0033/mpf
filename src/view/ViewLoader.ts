import * as vscode from "vscode";
import * as path from "path";
import { Memo } from "../models/memo";
import { Progect, ProgectData } from "../models/project";
import { File, FileData } from "../models/file";
import { PathInfo } from "../consts/types";

export default class ViewLoader {
    readonly _panel: vscode.WebviewPanel | undefined;
    private savedProgectPath: string | undefined;
    private savedFilePath: string | undefined;
    private activeProgectPath: string;
    private activeFilePath: string | undefined;
    private pathInfoType: PathInfo.types;
    private readonly _extensionPath: string;

    // ViewStateクラスを作るべきなのか？？？

    constructor(context: vscode.ExtensionContext, activeProgectPath: string, activeFilePath?: string) {
        this._extensionPath = context.extensionPath;

        this.activeProgectPath = activeProgectPath;
        this.activeFilePath = activeFilePath;

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
        this.pathInfoType = PathInfo.types.yyy;

        this.setState();
        this.listenMessage(context);
    }

    private setState() {
        this.savedProgectPath = this.getProgectPath();

        if (this.savedProgectPath == undefined) {
            this.savedFilePath = undefined;
            this.pathInfoType = PathInfo.types.nnn;
            return;
        } else if (this.activeFilePath == undefined) {
            this.savedFilePath = undefined;
            this.pathInfoType = PathInfo.types.ynn;
            return;
        }

        this.savedFilePath = this.getFileAbsolutePath();
        if (this.savedFilePath == undefined) {
            this.pathInfoType = PathInfo.types.yyn;
        }
    }

    private getProgectPath(): string | undefined {
        return this.activeProgectPath && Progect.findByPath(this.activeProgectPath)?.path;
    }

    private getFileAbsolutePath(): string | undefined {
        if (this.activeFilePath == undefined) {
            return undefined;
        }
        const fileRelativePath = path.relative(this.activeProgectPath, this.activeFilePath);
        return File.findByPaths(this.activeProgectPath, fileRelativePath)?.absolutePath;
    }

    // vscode => now(viewLoader) => webView
    updateState(activeProgectPath: string, activeFilePath?: string) {
        this.activeProgectPath = activeProgectPath;
        this.activeFilePath = activeFilePath;
        this.setState();
        this.postMessage();
    }

    // webView => now(viewLoader) => progect model
    createProgect(title: string): Progect | undefined {
        if (this.activeProgectPath == undefined) {
            console.log("activeProgectPath is undefined");
            
            return undefined;
        }
        const progectData: ProgectData = {
            title: title,
            path: this.activeProgectPath
        }
        return Progect.create(progectData);
    }

    // webView => now(viewLoader) => progect model
    createFile(fileData: FileData) {
        File.create(fileData);
    }

    // 適切に送れなかったとき再度送信やエラー表示しよう！！（再帰的？？）
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
                switch(message.action) {
                    case "createProgect":
                        const progect = this.createProgect(message.title);
                        if (progect) {
                            vscode.window.showInformationMessage("プロジェクト作成に成功しました。");
                            this.updateState(this.activeProgectPath, this.activeFilePath);
                            break;
                        }
                        vscode.window.showInformationMessage("プロジェクト作成に失敗しました。");
                        break;
                    case "postInfo":
                        this.postMessage();
                        break;
                    default:
                        break;
                }
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

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        if (this.savedProgectPath) {
            return Memo.selectByPath(this.savedProgectPath);
        }
        return [];
    }

    private fileMemos(): Memo[] {
        if (this.savedProgectPath && this.savedFilePath) {
            return Memo.selectByPath(this.savedProgectPath, this.savedFilePath);
        }
        return [];
    }
}
