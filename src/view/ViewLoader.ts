import * as vscode from "vscode";
import * as path from "path";

export default class ViewLoader {
    readonly _panel: vscode.WebviewPanel | undefined;
    private readonly _extensionPath: string;

    // constructor(extensionPath: string) {
    constructor(context: vscode.ExtensionContext) {
        this._extensionPath = context.extensionPath;

        this._panel = vscode.window.createWebviewPanel(
        "configView",
            "Config View",
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,

                localResourceRoots: [
                    // changed
                    vscode.Uri.file(path.join(this._extensionPath, "configViewer"))
                ]
            }
        );
        this._panel.webview.html = this.getWebviewContent();
        this._panel.webview.postMessage({ messages: ["1", "2"] });

        // this._panel.webview.onDidReceiveMessage(
        //     message => {
        //         vscode.window.showErrorMessage(message);
        //         console.log("come onDidReceive////");
        //     },
        //     undefined,
        //     context.subscriptions
        //   );
    }

    private getWebviewContent(): string {
        // Local path to main script run in the webview
        const reactAppPathOnDisk = vscode.Uri.file(
            path.join(this._extensionPath, "configViewer", "configViewer.js")
        );
        let reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/home/alex/desktop/vs_code_extentions/mpf/out/view/app/index.css">
            <title>Config View</title>
            <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                            img-src https:;
                            script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                            style-src vscode-resource: 'unsafe-inline';">
            <script>
                window.acquireVsCodeApi = acquireVsCodeApi;
            </script>
        </head>
        <body>
            <div id="root">
                <script src="${reactAppUri}"></script>
            </div>
        </body>
        </html>`;
    }
}
