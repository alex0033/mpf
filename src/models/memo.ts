import * as fs from 'fs';
import { client } from '../consts/data_path';
import { BaseModel } from './base_model';
import { File } from './file';
import { Progect } from './project';

export class Memo extends BaseModel<MemoData> {
    protected static dataPath = client.memoDataPath;
    protected static Data: (MemoData | null)[] = Memo.dataPath && JSON.parse(fs.readFileSync(Memo.dataPath, 'utf8'));
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

    static selectByPath(progectPath: string, filePath?: string): Memo[] {
        const progect = Memo.findProgectByPath(progectPath);
        if (progect == undefined) {
            return [];
        }
        if (progect && filePath == undefined) {
            const memoDataIds = Memo.selectMemoDataIdsById(progect.getId());
            const memos = memoDataIds.map(id => Memo.findById(id) as Memo);
            return memos;
        }
        // この書き方は分かりにくいかな？？
        const file = (filePath && Memo.findFileByPath(filePath, progect.getId())) as File | undefined;
        // 下記コードがないと、該当しないファイルパスのとき、filePathが参照されない
        if (file == undefined) {
            return [];
        }

        const memoDataIds = Memo.selectMemoDataIdsById(progect.getId(), file.getId());
        const memos = memoDataIds.map(id => Memo.findById(id) as Memo);
        return memos;
    }

    private static findProgectByPath(progectPath: string): Progect | undefined {
        return Progect.findByPath(progectPath)
    }

    private static findFileByPath(filePath: string, progectId: number): File | undefined {
        return File.findByPathAndProgectId(filePath, progectId);
    }

    private static selectMemoDataIdsById(progectId: number, fileId?: number): number[] {
        let memoDataIds = [];
        // 以下まとめて処理できると良き
        // データへの同時アクセス問題へ・・
        const memoSize = Memo.Data.length;
        for (let id = 0; id < memoSize; id ++) {
            const data = Memo.Data[id];
            if (data?.progectId == progectId && (data?.fileId == fileId || fileId == undefined)) {
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