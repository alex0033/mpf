import * as vscode from "vscode";
import { PathInfo } from "../consts/types";
import { Progect, ProgectData } from "../models/project";
import { File, FileData } from "../models/file";
import { Memo } from "../models/memo";
import ViewLoader from "./ViewLoader";
import { editorAction } from "../consts/editor_action";

const path = require('path');

export default class Editor {
    private webview: vscode.Webview | undefined;
    private activeProgectPath: string;
    // activeAbsoluteFilePath or activeRelativeFilePath???
    private activeFilePath: string | undefined;
    private pathInfoType: PathInfo.types;

    constructor(activeProgectPath: string, activeFilePath?: string) {
        this.activeProgectPath = activeProgectPath;
        this.activeFilePath = activeFilePath;

        // 下記で初期値代入
        this.pathInfoType = PathInfo.types.yyy;

        this.setState();
    }

    createWebview(context: vscode.ExtensionContext) {
        const viewLoader = new ViewLoader(context);
        this.webview = viewLoader.webview;

        // start communication with webview
        this.postMessage();
        this.listenMessage(context);
    }

    private setState() {
        const savedProgectPath = this.getProgectPath();

        if (savedProgectPath == undefined) {
            this.pathInfoType = PathInfo.types.nnn;
            return;
        } else if (this.activeFilePath == undefined) {
            this.pathInfoType = PathInfo.types.ynn;
            return;
        }

        const savedFilePath = this.getFileAbsolutePath();
        if (savedFilePath == undefined) {
            this.pathInfoType = PathInfo.types.yyn;
        }
    }

    // vscode => now(viewLoader) => webview
    updateState(activeProgectPath: string, activeFilePath?: string) {
        this.activeProgectPath = activeProgectPath;
        this.activeFilePath = activeFilePath;
        this.setState();
        this.postMessage();
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

    // 適切に送れなかったとき再度送信やエラー表示しよう！！（再帰的？？）
    private postMessage() {
        this.webview?.postMessage({
            pathInfoType: this.pathInfoType
            // progectMemos: this.progectMemos(),
            // fileMemos: this.fileMemos()
        });
    }

    // webview => now(viewLoader)
    // communication
    private listenMessage(context: vscode.ExtensionContext) {
        this.webview?.onDidReceiveMessage(
            message => {
                switch(message.action) {
                    case editorAction.progectCreation:
                        const progect = this.createProgect(message.title);
                        if (progect) {
                            vscode.window.showInformationMessage(editorAction.message.successProgectCreation);
                            this.updateState(this.activeProgectPath, this.activeFilePath);
                            break;
                        }
                        vscode.window.showInformationMessage(editorAction.message.failuerProgectCreation);
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
    createProgect(title: string): Progect | undefined {
        const progectData: ProgectData = {
            title: title,
            path: this.activeProgectPath
        }
        return Progect.create(progectData);
    }

    // webview => now(viewLoader) => progect model
    createFile(fileData: FileData) {
        File.create(fileData);
    }

    private progectMemos(): Memo[] {
        if (this.pathInfoType != PathInfo.types.nnn) {
            return Memo.selectByPath(this.activeProgectPath);
        }
        return [];
    }

    private fileMemos(): Memo[] {
        if (this.pathInfoType == PathInfo.types.yyy) {
            return Memo.selectByPath(this.activeProgectPath, this.activeFilePath);
        }
        return [];
    }
}