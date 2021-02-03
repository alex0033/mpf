import * as fs from 'fs';
import { server } from '../consts/data_path';
import { destroyedId } from '../consts/number';

export class Progect {
    private static dataPath = server.progectDataPath;
    private static Data: [ProgectData | null] = JSON.parse(fs.readFileSync(Progect.dataPath, 'utf8'));
    private id: number;
    readonly title: string;
    readonly path: string;

    constructor(progectData: ProgectData, id: number) {
        this.id = id;
        this.title = progectData.title
        this.path = progectData.path
    }

    getId(): number {
        return this.id;
    }

    // この関数はテスト用（ライブラリーの関係でthis.Dataに値が入らないため）
    static loadData() {
        this.Data = JSON.parse(fs.readFileSync(Progect.dataPath, 'utf8'));
    }

    private static pathIsDuplicated(path: string): boolean {
        return Boolean(Progect.findByPath(path));
    }

    static deserialize(progectData: ProgectData, id: number): Progect {
        const progect = new Progect(progectData, id);
        return progect;
    }

    // CREATE
    static create(progectData: ProgectData): Progect | undefined {
        if (Progect.pathIsDuplicated(progectData.path)) {
            return undefined;
        }
        Progect.Data.push(progectData);
        Progect.save();
        const progect = Progect.deserialize(progectData, Progect.Data.length - 1);
        return progect;
    }

    // READ
    static findById(id: number): Progect | undefined {
        const progectData = Progect.Data[id];
        if (id >= Progect.Data.length || id < 0, progectData == null ) {
            return undefined;
        }
        
        const progect = Progect.deserialize(progectData, id);
        return progect;
    }

    // 抽象化の余地あり
    static findByPath(path: string): Progect | undefined {
        const id = Progect.Data.findIndex(d => d?.path == path);
        return Progect.findById(id);
    }

    // UPDATE
    update(nextProgectData: ProgectData) {
        const path = nextProgectData.path;
        if (this.path != path && Progect.pathIsDuplicated(path) || this.id == destroyedId) {
            return;
        }

        // update data
        Progect.Data[this.id] = nextProgectData;
        Progect.save();

        // update instance
        Object.assign(this, Progect.deserialize(nextProgectData, this.id));
    }

    // DESTROY
    destroy() {
        Progect.Data[this.id] = null;
        Progect.save();
        // こうしたいけど、できない
        // Object.assign(this, null);
        // 代わりに・・
        this.id = destroyedId;
    }

    private static save(){
        // 例外処理する？？
        fs.writeFileSync(Progect.dataPath, JSON.stringify(Progect.Data, null, "\t"));
    }
}

export interface ProgectData {
    title: string,
    path: string
}