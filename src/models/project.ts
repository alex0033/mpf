import * as fs from 'fs';
import { FileData } from './file';
import { RootData } from "./root";
import { PROGECT_DATA_PATH } from '../tools/const';

export class ProgectData {
    private static dataPath = PROGECT_DATA_PATH;
    private static Data: RootData[] = JSON.parse(fs.readFileSync(ProgectData.dataPath, 'utf8'));

    // 引数が多いなこれ！！
    // オブジェクト指向かどうか怪しい・・・・・・・

    // この関数はテスト用（ライブラリーの関係でthis.Dataに値が入らないため）
    static loadData() {
        this.Data = JSON.parse(fs.readFileSync(ProgectData.dataPath, 'utf8'));
    }

    static rootDataIsDuplicated(rootPath: string): boolean {
        return Boolean(this.fetchRootData(rootPath));
    }

    static fileDataIsDuplicated(rootPath: string, filePath: string): boolean {
        return Boolean(this.fetchFileData(rootPath, filePath));
    }

    // CREATE
    static createRootData(rootPath: string): RootData | undefined {
        if (this.rootDataIsDuplicated(rootPath)) {
            return undefined;
        }
        const newRootData = {
            rootPath: rootPath,
            files: []
        }
        this.Data.push(newRootData);
        this.save();
        return newRootData;
    }

    static createFileData(rootPath: string, filePath: string): FileData | undefined {
        if (this.fileDataIsDuplicated(rootPath, filePath)) {
            return undefined;
        }
        const newFileData = {
            filePath: filePath,
            messages: []
        }
        // IsDuplicatedが何回も呼び出される
        // 無駄無駄！！！！
        const rootData = this.fetchRootData(rootPath);
        if (rootData) {
            rootData.files.push(newFileData);
            this.save();
            return newFileData;
        }
        return undefined;
    }

    // READ
    static fetchRootData(rootPath: string): RootData | undefined {
        return this.Data.find(d => d.rootPath === rootPath);
    }

    static fetchRootId(rootPath: string): number {
        return this.Data.findIndex(d => d.rootPath === rootPath);
    }

    static fetchFileData(rootPath: string, filePath: string): FileData | undefined {
        const rootData = this.fetchRootData(rootPath);
        if (rootData) { 
            return rootData.files.find(f => f.filePath == filePath);
        }
        return undefined;
    }

    static fetchFileDataId(rootPath: string, filePath: string): number {
        const rootData = this.fetchRootData(rootPath);
        if (rootData) {
            return rootData.files.findIndex(f => f.filePath == filePath);
        }
        return -1;
    }

    // DESTROY
    static deleteRootData(rootPath: string) {
        const rootId = this.fetchRootId(rootPath);
        this.Data.splice(rootId, 1);
        this.save();
    }

    static deleteFileData(rootPath: string, filePath: string) {
        let rootData = this.fetchRootData(rootPath);
        const fileId = this.fetchFileDataId(rootPath, filePath);
        if (fileId == -1) {
            return;
        }
        if (rootData) {
            rootData.files.splice(fileId, 1);
            this.save();
        }
    }

    static save(){
        console.dir(this.Data);
        fs.writeFileSync(this.dataPath, JSON.stringify(this.Data, null, "\t"));
    }
}