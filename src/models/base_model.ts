// validateメソッド名が分かりにくい
// 無理やり感のある型変換：typescriptの特性を活かしていない

import * as fs from 'fs';
import { destroyedId } from '../consts/number';

// 自己参照があるため、abstractではない
export class BaseModel<SubClassData> {
    // should override
    protected static dataPath: string;
    protected static Data: any[];

    protected id: number;

    constructor(subClassData: SubClassData, id: number) {
        this.id = id;
        // プロパティ名が一致したものは代入する
    }

    getId(): number {
        return this.id;
    }

    // この関数はテスト用（ライブラリーの関係でthis.Dataに値が入らないため）
    static loadData() {
        this.Data = this.dataPath && JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
    }

    // should overrride
    // 関数を引数にする？？
    protected static validate(any: any, id?: number): boolean {
        return false;
    }

    static deserialize<SubClassData, SubClass extends BaseModel<SubClassData>
    >(subClassData: SubClassData, id: number): SubClass {
        const subClass = new this(subClassData, id) as SubClass;
        return subClass;
    }

    // CREATE
    static create<SubClassData, SubClass extends BaseModel<SubClassData>
    >(subClassData: SubClassData): SubClass | undefined {
        if (this.validate(subClassData)) {
            return undefined;
        }
        this.Data.push(subClassData);
        this.save();
        const subClass = this.deserialize(subClassData, this.Data.length - 1) as SubClass;
        return subClass;
    }

    // READ
    static findById<
        SubClassData, SubClass extends BaseModel<SubClassData>
        >(id: number): SubClass | undefined {
        const subClassData = this.Data[id];
        if (id >= this.Data.length || id < 0, subClassData == null ) {
            return undefined;
        }

        const subClass = this.deserialize(subClassData, id) as SubClass;
        return subClass;
    }

    // 抽象化の余地あり
    // static findByPath(path: string): BaseModel | undefined { 
    //     const id = BaseModel.Data.findIndex(d => d?.path == path);
    //     return BaseModel.findById(id);
    // }

    // UPDATE
    update(nextSubClassData: SubClassData) {
        if (this.constructor.validate(nextSubClassData, this.id)) {
            return;
        }
        // この関数内でも抽象化による・・
        // 不完全な型のnextSubClassDataでも変更したい・・・

        // update data
        this.constructor.Data[this.id] = nextSubClassData;
        this.constructor.save();

        // update instance
        Object.assign(this, this.constructor.deserialize(nextSubClassData, this.id));
    }

    // DESTROY
    destroy() {
        this.constructor.Data[this.id] = null;
        this.constructor.save();
        // こうしたいけど、できない
        // Object.assign(this, null);
        // 代わりに・・
        this.id = destroyedId;
    }

    protected static save(){
        // 例外処理する？？
        this.dataPath && fs.writeFileSync(this.dataPath, JSON.stringify(this.Data, null, "\t"));
    }
}
