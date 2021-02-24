export module editorAction {
    export type types = "progectCreation" | "fileCreation" | "editorStateTransmission";

    export const progectCreation = "progectCreation";
    export const fileCreation = "fileCreation";

    export const editorStateTransmission = "editorStateTransmission";
    
    export module message {
        export const successProgectCreation = "プロジェクト作成に成功しました。";
        export const failuerProgectCreation = "プロジェクト作成に失敗しました。";

        export const successFileCreation = "ファイル作成に成功しました。";
        export const failuerFileCreation = "ファイル作成に失敗しました。";
    } 
}