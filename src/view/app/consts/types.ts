export module PathInfo {
    export type types = "nnn" | "ynn" | "yyn" | "yyy";

    export const nnn = "nnn";
    export const ynn = "ynn";
    export const yyn = "yyn";
    export const yyy = "yyy";
}

export module View {
    export type types = "CreateProgectField" | "CreateFileField" | "ProgectMemos" | "FileMemos" | "ErrorField";

    export module types {
        export const CreateProgectField = "CreateProgectField";
        export const CreateFileField = "CreateFileField";
        export const ProgectMemos = "ProgectMemos";
        export const FileMemos = "FileMemos";
        export const ErrorField = "ErrorField";
    }
}
