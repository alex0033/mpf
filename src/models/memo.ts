import * as fs from 'fs';
import { client } from '../consts/data_path';
import { BaseModel } from './base_model';
import { File } from './file';
import { Progect } from './project';

export class Memo extends BaseModel<MemoData> {
    protected static dataPath = client.memoDataPath;
    protected static Data: [MemoData | null] = Memo.dataPath && JSON.parse(fs.readFileSync(Memo.dataPath, 'utf8'));
    readonly progectId: number;
    readonly fileId: number;
    readonly message: string;

    constructor(memoData: MemoData, id: number) {
        super(memoData, id);
        this.progectId = memoData.progectId;
        this.fileId = memoData.fileId;
        this.message = memoData.message;
    }
    
    static deserialize<MemoData>(memoData: MemoData, id: number): Memo {
        return super.deserialize(memoData, id);
    }

    static create<MemoData>(memoData: MemoData): Memo | undefined {
        return super.create(memoData);
    }

    static findById(id: number): Memo | undefined {
        return super.findById(id);
    }

    static selectByProgectPath(progectPath: string): Memo[] {
        const progect = Memo.findProgectByPath(progectPath);
        if (progect == undefined) {
            return [];
        }
        const memoDataIds = Memo.selectMemoDataIdsByProgectId(progect.getId());
        let memos = memoDataIds.map(id => Memo.findById(id) as Memo);
        return memos;
    }

    // filePath is not unique
    // should unique with filePath and progectId
    static selectByFilePath(filePath: string): Memo[] {
        const file = Memo.findFileByPath(filePath);
        if (file == undefined) {
            return [];
        }
        const memoDataIds = Memo.selectMemoDataIdsByFileId(file.getId());
        let memos = memoDataIds.map(id => Memo.findById(id) as Memo);
        return memos;
    }

    private static findProgectByPath(progectPath: string): Progect | undefined {
        return Progect.findByPath(progectPath)
    }

    private static selectMemoDataIdsByProgectId(progectId: number): number[] {
        let memoDataIds = [];
        const memoSize = Memo.Data.length;
        for (let id = 0; id < memoSize; id ++) {
            if (Memo.Data[id]?.progectId == progectId) {
                memoDataIds.push(id);
            }
        }
        return memoDataIds;
    }

    private static findFileByPath(filePath: string): File | undefined {
        return File.findByPath(filePath);
    }

    private static selectMemoDataIdsByFileId(fileId: number): number[] {
        let memoDataIds = [];
        const memoSize = Memo.Data.length;
        for (let id = 0; id < memoSize; id ++) {
            if (Memo.Data[id]?.fileId == fileId) {
                memoDataIds.push(id);
            }
        }
        return memoDataIds;
    }
}

export interface MemoData {
    progectId: number,
    fileId: number,
    message: string
}