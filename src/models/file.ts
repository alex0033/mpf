import { ProgectData } from './project';

export class File {
    private filePath: string;
    private rootPath: string;
    private Data: FileData;
    messages: string[];

    constructor(rootPath: string, filePath: string, fileData: FileData) {
        this.rootPath = rootPath;
        this.filePath = filePath;
        this.messages = [...fileData.messages];
        this.Data = fileData;
    }

    // 下記 3 functionsは・・extends候補
    // connectData名かぶり&意味が異なり分かりにくい
    private connectData() {
        this.filePath = this.Data.filePath;
        this.messages = [...this.Data.messages];
        ProgectData.save();
    }

    // CREATE
    static create(rootPath: string, filePath: string): File | undefined {
        const fileData = ProgectData.createFileData(rootPath, filePath);
        if (fileData) {
            const file = new File(rootPath, filePath, fileData);
            return file;
        }
        return undefined;
    }

    // READ
    static findBy(rootPath: string, filePath: string): File | undefined {
        const fileData = ProgectData.fetchFileData(rootPath, filePath);
        if (fileData) {
            const file = new File(rootPath, filePath, fileData);
            return file;
        }
        return undefined;
    }

    // UPDATE
    update(filePath: string) {
        if (ProgectData.fileDataIsDuplicated(this.rootPath, filePath)) {      
            return;
        }
        this.filePath = filePath;
        this.connectData();
    }

    createMessage(message: string) {
        this.Data.messages.push(message);
        this.connectData();
    }

    updateMessage(newMessage: string, index: number) {
        this.Data.messages[index] = newMessage;
        this.connectData();
    }

    deleteMessage(index: number){
        // 1 is magic_number??
        this.Data.messages.splice(index, 1);
        this.connectData();
    }

    // DELETE
    destroy() {
        ProgectData.deleteFileData(this.rootPath, this.filePath);
        // thisがundefinedにならないなー
        Object.assign(this, undefined);
    }
}

export interface FileData {
    filePath: string;
    messages: string[];
}