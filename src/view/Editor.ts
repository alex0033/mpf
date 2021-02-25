import * as vscode from "vscode";
import { PathInfo } from "../consts/types";
import { Progect, ProgectData } from "../models/project";
import { File, FileData } from "../models/file";
import { Memo, MemoData } from "../models/memo";
import ViewLoader from "./ViewLoader";
import { editorAction } from "../consts/editor_action";
import { destroyedId } from "../consts/number";

const path = require('path');

// FileData ProgectDataをどのように管理するか
// idで扱うことにより、早くアクセスできる？？

export default class Editor {
    private webview: vscode.Webview | undefined;
    // this.setPaths内で代入される
    private activeAbsoluteProgectPath!: string;
    private activeAbsoluteFilePath: string | undefined;
    private activeRelativeFilePath: string | undefined;
    private savedProgectId: number | undefined;
    private savedFileId: number | undefined;
    private pathInfoType: PathInfo.types;

    constructor(activeAbsoluteProgectPath: string, activeAbsoluteFilePath?: string) {
        this.setPaths(activeAbsoluteProgectPath, activeAbsoluteFilePath);

        // 下記で初期値代入
        this.pathInfoType = PathInfo.types.yyy;

        this.setState();
    }

    setPaths(activeAbsoluteProgectPath: string, activeAbsoluteFilePath?: string) {
        this.activeAbsoluteProgectPath = activeAbsoluteProgectPath;
        this.activeAbsoluteFilePath = activeAbsoluteFilePath;
        this.activeRelativeFilePath = path.relative(activeAbsoluteProgectPath, activeAbsoluteFilePath);
    }

    createWebview(context: vscode.ExtensionContext) {
        const viewLoader = new ViewLoader(context);
        this.webview = viewLoader.webview;

        // start communication with webview
        this.postMessage();
        this.listenMessage(context);
    }

    private setState() {
        this.savedProgectId = this.getProgectId();
        if (this.savedProgectId == undefined) {
            this.pathInfoType = PathInfo.types.nnn;
            return;
        } else if (this.activeRelativeFilePath == undefined) {
            this.pathInfoType = PathInfo.types.ynn;
            return;
        }

        this.savedFileId = this.getFileId();
        if (this.savedFileId == undefined) {
            this.pathInfoType = PathInfo.types.yyn;
            return;
        }
        // yyyのとき反映されない問題
        this.pathInfoType = PathInfo.types.yyy;
    }

    // vscode => now(viewLoader) => webview
    updateState(activeAbsoluteProgectPath: string, activeAbsoluteFilePath?: string) {
        this.setPaths(activeAbsoluteProgectPath, activeAbsoluteFilePath);
        this.setState();
        this.postMessage();
    }

    private getProgectId(): number | undefined {
        return Progect.findByPath(this.activeAbsoluteProgectPath)?.getId();
    }

    private getFileId(): number | undefined {
        if (this.activeRelativeFilePath == undefined) {
            return undefined;
        }
        return this.savedProgectId && File.findByPathAndProgectId(this.activeRelativeFilePath, this.savedProgectId)?.getId();
    }

    // 適切に送れなかったとき再度送信やエラー表示しよう！！（再帰的？？）
    private postMessage() {
        this.webview?.postMessage({
            pathInfoType: this.pathInfoType,
            progectMemos: this.progectMemos(),
            fileMemos: this.fileMemos()
        });
    }

    // webview => now(viewLoader)
    // communication
    private listenMessage(context: vscode.ExtensionContext) {
        this.webview?.onDidReceiveMessage(
            message => {
                // このように分岐する複合メソッドはどう定義するか
                // 命名規則にたいしての疑問？？
                switch(message.action) {
                    case editorAction.progectCreation:
                        // 下記をcreateProgectというメソッド名にしたいがかぶる
                        // [隔離]するためのメソッドをどうするか問題
                        const progect = this.createProgect(message.title);
                        if (progect) {
                            vscode.window.showInformationMessage(editorAction.message.successProgectCreation);
                            this.updateState(this.activeAbsoluteProgectPath, this.activeAbsoluteFilePath);
                            break;
                        }
                        vscode.window.showInformationMessage(editorAction.message.failuerProgectCreation);
                        break;
                    case editorAction.fileCreation:
                        const file = this.createFile();
                        if (file) {
                            vscode.window.showInformationMessage(editorAction.message.successFileCreation);
                            this.updateState(this.activeAbsoluteProgectPath, this.activeAbsoluteFilePath);
                            break;
                        }
                        vscode.window.showInformationMessage(editorAction.message.failuerFileCreation);
                        break;
                    case editorAction.progectMemoCreation:
                        const progectMemo = this.createProgectMemo(message.message);
                        if (progectMemo) {
                            vscode.window.showInformationMessage(editorAction.message.successMemoCreation);
                            this.updateState(this.activeAbsoluteProgectPath, this.activeAbsoluteFilePath);
                            break;
                        }
                        vscode.window.showInformationMessage(editorAction.message.failuerMemoCreation);
                        break;
                    case editorAction.fileMemoCreation:
                        const fileMemo = this.createFileMemo(message.message);
                        if (fileMemo) {
                            vscode.window.showInformationMessage(editorAction.message.successMemoCreation);
                            this.updateState(this.activeAbsoluteProgectPath, this.activeAbsoluteFilePath);
                            break;
                        }
                        vscode.window.showInformationMessage(editorAction.message.failuerMemoCreation);
                        break;
                    case editorAction.editorStateTransmission:
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

    // webview => now(viewLoader) => progect model
    private createProgect(title: string): Progect | undefined {
        const progectData: ProgectData = {
            title: title,
            path: this.activeAbsoluteProgectPath
        }
        return Progect.create(progectData);
    }

    // webview => now(viewLoader) => progect model
    private createFile(): File | undefined {
        if (this.savedProgectId == undefined || this.activeRelativeFilePath == undefined) {
            return;
        }
        const fileData: FileData = {
            progectId: this.savedProgectId,
            path: this.activeRelativeFilePath
        };
        return File.create(fileData);
    }

    private createProgectMemo(message: string): Memo | undefined {
        if (this.savedProgectId == undefined) {
            return undefined;
        }
        const memoData: MemoData = {
            progectId: this.savedProgectId,
            fileId: destroyedId,
            message: message
        }
        return Memo.create(memoData);
    }

    private createFileMemo(message: string): Memo | undefined {
        if (this.savedProgectId == undefined || this.savedFileId == undefined) {
            return undefined;
        }
        const memoData: MemoData = {
            progectId: this.savedProgectId,
            fileId: this.savedFileId,
            message: message
        }
        return Memo.create(memoData);
    }

    private progectMemos(): Memo[] {
        if (this.pathInfoType != PathInfo.types.nnn) {
            return Memo.selectByPaths(this.activeAbsoluteProgectPath);
        }
        return [];
    }

    private fileMemos(): Memo[] {
        if (this.pathInfoType == PathInfo.types.yyy) {
            return Memo.selectByPaths(this.activeAbsoluteProgectPath, this.activeRelativeFilePath);
        }
        return [];
    }
}
