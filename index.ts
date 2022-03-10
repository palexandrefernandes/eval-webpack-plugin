import { Compilation, Compiler, WebpackError } from "webpack";

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
                    const error = new WebpackError('Eval expression found');
                    error.file = parser.state.module.rawRequest;
                    error.loc = expression.loc;
                    error.hideStack = true;
                    this.errors.push(error);
                });
            });
        });
    }
}