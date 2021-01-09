import { ProgectData } from './project';
import { FileData } from './file';

export class Root {
    rootPath: string;
    files: FileData[];
    private Data: RootData;

    constructor (rootPath: string, rootData: RootData) {
        this.rootPath = rootPath;
        this.files = rootData.files;
        this.Data = rootData;
    }

    // constructor, update で使用！！
    private connectData() {
        this.rootPath = this.Data.rootPath;
        this.files = this.Data.files;
        ProgectData.save();
    }

    // CREATE
    static create(rootPath: string): Root | undefined {
        const rootData = ProgectData.createRootData(rootPath);
        if (rootData) {
            const newRoot = new Root(rootPath, rootData);
            return newRoot;
        }
        return undefined;
    }

    // READ
    static findBy(rootPath: string): Root | undefined {
        const rootData = ProgectData.fetchRootData(rootPath);
        if (rootData) {
            const root = new Root(rootPath, rootData);
            return root;
        }
        return undefined;
    }

    // UPDATE
    update(rootPath: string) {
        if (ProgectData.rootDataIsDuplicated(rootPath)) {
            return;
        }
        if (this.Data) {
            this.Data.rootPath = rootPath;
            this.connectData();   
        }
    }

    destroy() {
        ProgectData.deleteRootData(this.rootPath);
        // 例外処理？？もしDataがのっこていた場合削除の失敗！！
        // インスタンスをundefinedにする
        Object.assign(this, undefined);
    }
}

export interface RootData {
    rootPath: string;
    files: FileData[];
}
