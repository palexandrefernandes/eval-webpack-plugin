import type { ConditionalExpression, Expression, Identifier, SourceLocation, VariableDeclarator } from "estree";

type crawler<T> = (expression: T) => SourceLocation[];

export const variableDeclarationCrawler: crawler<VariableDeclarator> = (variableDeclaration) => {
    const locs = [];
    switch (variableDeclaration.init?.type) {
        case 'ConditionalExpression':
            locs.push(...conditionalCrawler(variableDeclaration.init));
            break;
        case 'Identifier':
            locs.push(...identifierCrawler(variableDeclaration.init))
            break;
        default:     
    }

    return locs;
};

export const conditionalCrawler: crawler<ConditionalExpression> = (conditionalExpression) => {
    const crawl = (node: Expression, locs: SourceLocation[] = []): SourceLocation[] => {
        if ((node as ConditionalExpression).consequent.type === 'Identifier' && node.loc) {
            locs.push(node.loc);
        }
    
        if ((node as ConditionalExpression).alternate.type === 'ConditionalExpression') {
            return crawl((node as ConditionalExpression).alternate, locs);
        }

        return locs;
    }

    return crawl(conditionalExpression); 
};

export const identifierCrawler: crawler<Identifier> = (identifier) => {
    if (identifier.name === 'eval' && identifier.loc) {
        return [ identifier.loc ];
    }
    return [];
};
