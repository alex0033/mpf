import * as fs from 'fs';
import * as path from 'path';
import { client } from '../consts/data_path';
import { destroyedId } from '../consts/number';
import { Progect } from './project';

export class File {
    private static dataPath = client.fileDataPath;
    private static Data: [FileData | null] = File.dataPath && JSON.parse(fs.readFileSync(File.dataPath, 'utf8'));
    private id: number;
    readonly relativePath: string;
    readonly absolutePath: string;
    readonly progectId: number;

    constructor(fileData: FileData, id: number) {
        this.id = id;
        this.progectId = fileData.progectId
        this.relativePath = fileData.path
        this.absolutePath = this.joinPath();
    }

    joinPath(): string {
        const progect = Progect.findById(this.progectId);
        if (progect) {
            return path.join(progect.path, this.relativePath);
        }
        this.id = destroyedId;
        return "";
    }

    getId(): number {
        return this.id;
    }

    // この関数はテスト用（ライブラリーの関係でFile.Dataに値が入らないため）
    static loadData() {
        File.Data = File.dataPath && JSON.parse(fs.readFileSync(File.dataPath, 'utf8'));
    }

    private static pathIsDuplicated(path: string): boolean {
        return Boolean(File.findByPath(path));
    }

    static deserialize(fileData: FileData, id: number): File {
        const file = new File(fileData, id);
        return file;
    }

    // CREATE
    static create(fileData: FileData): File | undefined {
        if (File.pathIsDuplicated(fileData.path)) {
            return undefined;
        }
        File.Data.push(fileData);
        File.save();
        const file = File.deserialize(fileData, File.Data.length - 1);
        return file;
    }

    // READ
    static findById(id: number): File | undefined {
        const fileData = File.Data[id];
        if (id >= File.Data.length || id < 0, fileData == null ) {
            return undefined;
        }

        const file = File.deserialize(fileData, id);
        return file;
    }

    // 抽象化の余地あり
    static findByPath(path: string): File | undefined { 
        const id = File.Data.findIndex(d => d?.path == path);
        return File.findById(id);
    }

    // UPDATE
    update(nextFileData: FileData) {
        const path = nextFileData.path;
        if (this.relativePath != path && File.pathIsDuplicated(path) || this.id == destroyedId) {
            return;
        }

        // update data
        File.Data[this.id] = nextFileData;
        File.save();

        // update instance
        Object.assign(this, File.deserialize(nextFileData, this.id));
    }

    // DESTROY
    destroy() {
        File.Data[this.id] = null;
        File.save();
        // こうしたいけど、できない
        // Object.assign(this, null);
        // 代わりに・・
        this.id = destroyedId;
    }

    private static save(){
        // 例外処理する？？
        File.dataPath && fs.writeFileSync(File.dataPath, JSON.stringify(File.Data, null, "\t"));
    }
}

export interface FileData {
    path: string;
    progectId: number;
}