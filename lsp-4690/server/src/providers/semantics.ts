import {
    SemanticTokensLegend,
    DocumentSemanticTokensProvider,
    TextDocument,
    ProviderResult,
    SemanticTokens,
    SemanticTokensBuilder,
    Range,
    Position,
    languages
} from 'vscode';



const tokenTypes = ['class', 'interface', 'enum', 'function', 'variable'];
const tokenModifiers = ['declaration', 'documentation'];
export const legend = new SemanticTokensLegend(tokenTypes, tokenModifiers);

const semanticProvider: DocumentSemanticTokensProvider = {
    provideDocumentSemanticTokens(
        document: TextDocument
    ): ProviderResult<SemanticTokens> {
        // analyze the document and return semantic tokens

        const tokensBuilder = new SemanticTokensBuilder(legend);
        // on line 1, characters 1-5 are a class declaration
        tokensBuilder.push(
            new Range(new Position(1, 1), new Position(1, 5)),
            'class',
            ['declaration']
        );
        return tokensBuilder.build();
    }
};

const selector = { language: 'java', scheme: 'file' }; // register for all Java documents from the local file system
export function RegisterSemanticToken(): void {
    languages.registerDocumentSemanticTokensProvider(selector, semanticProvider, legend);
}
