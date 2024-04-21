/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	CompletionList,
	DidChangeTextDocumentParams,
	DocumentColorRequest
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import {log} from './components/log';
import { LanguageCompletion } from './providers/completion';
import { didChange } from './providers/didChange';


const logfile = '/log/server.log';
const logger = new log(logfile);
// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
export const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true
			},
			hoverProvider: true,
			declarationProvider: true,
			definitionProvider: true,
			typeDefinitionProvider: true,
			implementationProvider: true,
			documentHighlightProvider: true,
			documentSymbolProvider: true,
			codeActionProvider: true,
			//colorProvider: true,
			documentFormattingProvider: true,
			renameProvider: true,
			foldingRangeProvider: true,

		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

connection.onCompletion((params:any):CompletionList|CompletionItem[]|null => {
	console.log("Completion Request 1");
	console.log(JSON.stringify(params));

	const completion: LanguageCompletion = new LanguageCompletion(logger);
	console.log("Completion Request 2");
	const completionItems: CompletionList | null = completion.GetCompletionItems(params);
	console.log({"completionItems":completionItems});
	return completionItems;
});
connection.onDidChangeTextDocument((event)  => {
	//Document has changed so call our providers
	console.log("onDidChangeEvent");
	logger.write({"onDidChangeTextDocument":event});
	//didChange(event);
	
});
documents.onDidChangeContent((e) => {
	console.log("onDidChangeContentEvent");
	console.log(JSON.stringify(e));
	didChange(e);
});
connection.onCodeAction((e)=> {
	console.log("onCodeAction");
	console.log(JSON.stringify(e));
	return null;
});

connection.onHover((e) => {
	console.log("onHover");
	console.log(JSON.stringify(e));
	return null;
});

connection.onDeclaration((e)=>{
	console.log("onDeclaration");
	console.log(e);
	return null;
});
connection.onTypeDefinition((e)=>{
	console.log("onTypeDefinition");
	console.log(JSON.stringify(e));
	return null;
});
connection.onImplementation((e) => {
	console.log("onImplementation");
	console.log(JSON.stringify(e));
	return null;
});
connection.onDocumentHighlight((e) => {
	console.log("onDocumentHighlight");
	console.log(JSON.stringify(e));
	return null;
});

connection.onDocumentSymbol((e) => {
	console.log("onDocumentSymbol");
	console.log(JSON.stringify(e));
	return null;
});
connection.onColorPresentation((e,a,b,c)=> {
	console.log("onColorPresentation");
	console.log(JSON.stringify(e));
	return null;
});
connection.onDocumentFormatting((e)=> {
	console.log("onDocumentFormatting");
	console.log(JSON.stringify(e));
	return null;
});
connection.onRenameRequest((e)=> {
	console.log("onRenameRequest");
	console.log(JSON.stringify(e));
	return null;
});
connection.onFoldingRanges((e) => {
	console.log("onFoldingRanges");
	console.log(JSON.stringify(e));
	return null;
});


// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
