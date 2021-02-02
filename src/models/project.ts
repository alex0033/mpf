import * as fs from 'fs';
import { server } from '../consts/data_path';

export class Progect {
    private static dataPath = server.progetctDataPath;
    private static Data: ProgectData[] = JSON.parse(fs.readFileSync(Progect.dataPath, 'utf8'));
    title: string;
    path: string;

    constructor(progectData: ProgectData) {
        this.title = progectData.title
        this.path = progectData.path
    }

    // 引数が多いなこれ！！
    // オブジェクト指向かどうか怪しい・・・・・・・

    // この関数はテスト用（ライブラリーの関係でthis.Dataに値が入らないため）
    static loadData() {
        this.Data = JSON.parse(fs.readFileSync(Progect.dataPath, 'utf8'));
    }

    private static pathIsDuplicated(path: string): boolean {
        return Boolean(Progect.findByPath(path));
    }

    private static serialize(progect: Progect): ProgectData {
        return progect;
    }

    static deserialize(progectData: ProgectData): Progect {
        const progect = new Progect(progectData);
        return progect;
    }

    // CREATE
    static create(progectData: ProgectData): Progect | undefined {
        if (Progect.pathIsDuplicated(progectData.path)) {
            return undefined;
        }
        Progect.Data.push(progectData);
        Progect.save();
        const progect = Progect.deserialize(progectData);
        return progect;
    }

    // READ
    static findById(id: number): Progect | undefined {
        if (id >= Progect.Data.length || id < 0) {
            return undefined;
        }
        const progectData = Progect.Data[id];
        const progect = Progect.deserialize(progectData);
        return progect;
    }

    // 抽象化の余地あり
    static findByPath(path: string): Progect | undefined {
        const progectData = this.Data.find(d => d.path == path);
        const progect = progectData && Progect.deserialize(progectData);
        return progect;
    }

    // UPDATE
    // update(progectData: ProgectData) {

    // }

    // DESTROY
    // static deleteRootData(progectPath: string) {
    //     const rootId = this.fetchRootDataId(progectPath);
    //     this.Data.splice(rootId, 1);
    //     this.save();
    // }

    static save(){
        fs.writeFileSync(Progect.dataPath, JSON.stringify(Progect.Data, null, "\t"));
    }
}

export interface ProgectData {
    title: string,
    path: string
}