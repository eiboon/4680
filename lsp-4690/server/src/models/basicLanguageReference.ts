import jsonFunctions from './functions.json';
import jsonStatements from './statements.json';


export interface languageReference {
	name: string,
	syntax: string,
	description: string,
	color: string,
	snippets?: string[]
}

export class basicLanguageReference {
	readonly functions: languageReference[] = jsonFunctions.languageDefinitions;
	readonly statements: languageReference[] = jsonStatements.languageDefinitions
}
