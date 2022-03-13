import { Compilation, Compiler, WebpackError } from "webpack";
import type { BaseNode, ConditionalExpression, Expression, Identifier, Node, Statement, VariableDeclarator } from 'estree';
import { variableDeclarationCrawler } from "./crawlers";

export default class EvalWebpackPlugin {
    private logger = null;
    private name = 'EvalWebpackPlugin';
    private errors: WebpackError[] = [];

    apply(compiler: Compiler) {
        //this.logger = compiler.infrastructureLogger(this.name);
        compiler.hooks.beforeRun.tap(this.name, () => {
            this.errors = [];
        });

        compiler.hooks.afterCompile.tap(this.name, (compilation: Compilation) => {
            compilation.errors.push(...this.errors);
        });

        compiler.hooks.normalModuleFactory.tap(this.name, (factory) => {
            factory.hooks.parser.for('javascript/auto').tap(this.name, (parser) => {
                parser.hooks.call.for('eval').tap(this.name, (expression: any) => {
                    this.createError(parser.state.module.rawRequest, expression.loc);
                });

                parser.hooks.statement.tap(this.name, (expression: Statement) => {
                    const currentFile = parser.state.module.rawRequest;
                    if (expression.type === 'VariableDeclaration') {
                        expression.declarations.forEach(declaration => {
                            variableDeclarationCrawler(declaration).forEach(loc => {
                                this.createError(currentFile, loc);
                            })
                        });
                    }
                });
            });
        });
    }

    createError(file: string, loc: any): void {
        const error = new WebpackError('Eval expression found');
        error.file = file;
        error.loc = loc;
        error.hideStack = true;
        this.errors.push(error);
    }
}