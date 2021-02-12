import * as fs from 'fs';
import { server } from '../consts/data_path';
import { BaseModel } from './base_model';

export class Progect extends BaseModel<ProgectData> {
    protected static dataPath = server.progectDataPath;
    protected static Data: [ProgectData | null] = JSON.parse(fs.readFileSync(Progect.dataPath, 'utf8'));
    readonly title: string;
    readonly path: string;

    constructor(progectData: ProgectData, id: number) {
        super(progectData, id)
        this.title = progectData.title
        this.path = progectData.path
    }

    // ココもユニークの確認メソッドとして抽象化の可能性あり
    protected static validate(progectData: ProgectData, id?: number): boolean {
        const index = this.Data.findIndex(d => d?.path == progectData.path);
        if (index == -1 || index == id) {
            return false;
        }
        return true;
    }

    static deserialize<ProgectData>(progectData: ProgectData, id: number): Progect {
        return super.deserialize(progectData, id) as Progect;
    }

    static create<ProgectData>(progectData: ProgectData): Progect | undefined {
        return super.create(progectData) as Progect | undefined
    }

    static findById(id: number): Progect | undefined {
        return super.findById(id) as Progect | undefined;
    }

    // 抽象化の余地あり
    static findByPath(path: string): Progect | undefined {
        const id = Progect.Data.findIndex(d => d?.path == path);
        return Progect.findById(id);
    }
}

export interface ProgectData {
    title: string,
    path: string
}