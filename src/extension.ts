// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { File } from './models/file';
import ViewLoader from "./view/ViewLoader";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mpf" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mpf.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from memo_per_file!');

		// viewLoaderという変数名やクラス設計が？？
		const viewLoader = new ViewLoader(context);
		postFileMessags(viewLoader);
	});

	context.subscriptions.push(disposable);
}

function postFileMessags(viewLoader: ViewLoader) {
	const filePath = vscode.window.activeTextEditor?.document.fileName
	const rootPath = vscode.workspace.rootPath;
	if (rootPath && filePath) {
		const file = File.findBy(rootPath, filePath);
		console.log(rootPath);
		console.log(filePath);
		console.log(file?.messages);
		viewLoader._panel?.webview.postMessage(file?.messages);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
