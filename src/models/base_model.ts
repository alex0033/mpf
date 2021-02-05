import * as fs from 'fs';
import { destroyedId } from '../consts/number';

export class BaseModel<SubClass, SubClassData> {
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
    protected static validate(): boolean {
        return false;
    }

    // static deserialize<SubClassData, SubClass extends BaseModel<SubClass, SubClassData>>(
    //     this: {new(subClassData :SubClassData, id: number): SubClass},
    //     subClassData: SubClassData, id: number
    //     ): SubClass {
    //     const subClass = new this(subClassData, id);
    //     return subClass;
    // }

    static deserialize<SubClassData, SubClass extends BaseModel<SubClass, SubClassData>>(subClassData: SubClassData, id: number): SubClass {
        const subClass = new this(subClassData, id) as SubClass;
        return subClass;
    }

    // CREATE
    // static create<SubClassData, SubClass extends BaseModel<SubClass, SubClassData>>(
    //     this: {
    //         new(subClassData :SubClassData, id: number): SubClass,
    //         save(): void,
    //         validate(): boolean,
    //         deserialize(
    //             subClassData: SubClassData, id: number
    //             ): SubClass,
    //         Data: SubClassData[]
    //     },
    //     subClassData: SubClassData
    //     ): SubClass | undefined {
    //     if (this.validate()) {
    //         return undefined;
    //     }
    //     this.Data.push(subClassData);
    //     this.save();
    //     const subClass = this.deserialize(subClassData, this.Data.length - 1);
    //     return subClass;
    // }
    static create<SubClassData, SubClass extends BaseModel<SubClass, SubClassData>
    >(subClassData: SubClassData): SubClass | undefined {
        if (this.validate()) {
            return undefined;
        }
        this.Data.push(subClassData);
        this.save();
        const subClass = this.deserialize(subClassData, this.Data.length - 1) as SubClass;
        return subClass;
    }

    // READ
    // static findById<SubClassData, SubClass extends BaseModel<SubClass, SubClassData>>(
    //     this: {
    //         new(subClassData :SubClassData, id: number): SubClass,
    //         deserialize(subClassData: SubClassData, id: number): SubClass,
    //         Data: SubClassData[]
    //     },
    //     id: number
    //     ): SubClass | undefined {
    //     const subClassData = this.Data[id];
    //     if (id >= this.Data.length || id < 0, subClassData == null ) {
    //         return undefined;
    //     }

    //     const file = this.deserialize(subClassData, id) as SubClass;
    //     return file;
    // }

    static findById<
        SubClassData, SubClass extends BaseModel<SubClass, SubClassData>
        >(id: number): SubClass | undefined {
        const subClassData = this.Data[id];
        if (id >= this.Data.length || id < 0, subClassData == null ) {
            return undefined;
        }

        const file = this.deserialize(subClassData, id) as SubClass;
        return file;
    }

    // 抽象化の余地あり
    // static findByPath(path: string): BaseModel | undefined { 
    //     const id = BaseModel.Data.findIndex(d => d?.path == path);
    //     return BaseModel.findById(id);
    // }

    // UPDATE
    update(nextSubClassData: SubClassData) {
        if (BaseModel.validate()) {
            return;
        }
        // この関数内でも抽象化による・・
        // 不完全な型のnextSubClassDataでも変更したい・・・

        // update data
        BaseModel.Data[this.id] = nextSubClassData;
        BaseModel.save();

        // update instance
        Object.assign(this, BaseModel.deserialize(nextSubClassData, this.id));
    }

    // DESTROY
    destroy() {
        BaseModel.Data[this.id] = null;
        BaseModel.save();
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
