import { docs } from '../data/docs';
import { DidChangeTextDocumentParams } from 'vscode-languageserver';


export const didChange = (params: any): void => {

	const dctdp = params.document;
	docs.set(dctdp._uri, dctdp._content);
};