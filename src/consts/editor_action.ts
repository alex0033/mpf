export module editorAction {
    export type types = "progectCreation" | "fileCreation" | "editorStateTransmission" | "progectMemoCreation" | "fileMemoCreation";

    export const progectCreation = "progectCreation";
    export const fileCreation = "fileCreation";

    export const progectMemoCreation = "progectMemoCreation";
    export const fileMemoCreation = "fileMemoCreation";

    export const editorStateTransmission = "editorStateTransmission";
    
    export module message {
        export const successProgectCreation = "プロジェクト作成に成功しました。";
        export const failuerProgectCreation = "プロジェクト作成に失敗しました。";

        export const successFileCreation = "ファイル作成に成功しました。";
        export const failuerFileCreation = "ファイル作成に失敗しました。";

        export const successMemoCreation = "メモ作成に成功しました。";
        export const failuerMemoCreation = "メモ作成に失敗しました。";
    } 
}