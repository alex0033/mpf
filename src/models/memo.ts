import * as fs from 'fs';
import { client } from '../consts/data_path';
import { BaseModel } from './base_model';

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
        return super.deserialize(memoData, id) as Memo;
    }

    static create<MemoData>(memoData: MemoData): Memo | undefined {
        return super.create(memoData) as Memo | undefined
    }

    static findById(id: number): Memo | undefined {
        return super.findById(id) as Memo | undefined;
    }   
}

export interface MemoData {
    progectId: number,
    fileId: number,
    message: string
}