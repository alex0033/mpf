import * as fs from 'fs';
import * as path from 'path';
import { client } from '../consts/data_path';
import { destroyedId } from '../consts/number';
import { BaseModel } from './base_model';
import { Progect } from './project';

export class File extends BaseModel<FileData> {
    protected static dataPath = client.fileDataPath;
    protected static Data: [FileData | null] = File.dataPath && JSON.parse(fs.readFileSync(File.dataPath, 'utf8'));
    readonly relativePath: string;
    readonly absolutePath: string;
    readonly progectId: number;

    constructor(fileData: FileData, id: number) {
        super(fileData, id);
        this.relativePath = fileData.path;
        this.progectId = fileData.progectId;
        this.absolutePath = this.joinPath();
    }

    private joinPath(): string {
        const progect = Progect.findById(this.progectId);
        if (progect) {
            return path.join(progect.path, this.relativePath);
        }
        this.id = destroyedId;
        return "";
    }

    protected static validate(fileData: FileData, id?: number): boolean {
        const index = this.Data.findIndex(d => d?.path == fileData.path);
        if (index == -1 || index == id) {
            return false;
        }
        return true;
    }

    static findByPath(path: string): File | undefined { 
        const id = File.Data.findIndex(d => d?.path == path);
        return File.findById(id);
    }
}

export interface FileData {
    path: string;
    progectId: number;
}