// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Editor from './view/Editor';

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

		// pathの性格な値チェック??
		const workspaceFolders = vscode.workspace.workspaceFolders;
		const activeProgectPath = workspaceFolders && workspaceFolders[0].uri.path;
		const activeFilePath = vscode.window.activeTextEditor?.document.fileName;

		if (activeProgectPath) {
			console.log("come for viewLoader");
			
			// const viewLoader = new ViewLoader(context, activeProgectPath, activeFilePath);
			const editor = new Editor(activeProgectPath, activeFilePath);
			editor.createWebview(context);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
