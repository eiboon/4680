import { log } from '../components/log';
import { basicLanguageReference, languageReference } from '../models/basicLanguageReference';
import { CompletionItem, CompletionList, CompletionParams } from 'vscode-languageserver';
import { docs } from '../data/docs';


export class LanguageCompletion {

	private logger: log;
	private basicLanguageReferences: languageReference[];

	constructor(loggerModule: log) {

		this.logger = loggerModule;

		//build our list of languageReferences
		const blr = new basicLanguageReference();
		this.basicLanguageReferences = blr.functions;
		this.basicLanguageReferences.concat(blr.statements);

	}
	public GetCompletionItems = (params: CompletionParams): CompletionList | null => {

		const content = docs.get(params.textDocument.uri);
		if (!content) return null;

		const currentLine = content.split('\n')[params.position.line];
		const lineUntilCursor = currentLine.slice(0, params.position.character);
		const currentPrefix = lineUntilCursor.replace(/.*\W(.*?)/, "$1");

		const items = this.basicLanguageReferences
			.filter((word) => {
				return word.name.startsWith(currentPrefix);
			})
			.slice(0, 10)
			.map((word) => {
				const completionItem: CompletionItem = {
					label: word.name,
					detail: word.syntax,
					documentation: word.description
				};
				return completionItem;
			});

		return {
			isIncomplete: true,
			items: items
		};
	};
}