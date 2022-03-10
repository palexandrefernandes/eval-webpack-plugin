import * as path from 'path';
import { tmpdir } from 'os';
import { MultiCompiler, MultiStats, webpack } from "webpack";
import EvalWebpackPlugin from "..";

export const asyncRun = (compiler: MultiCompiler) => new Promise<MultiStats | undefined>((resolve, reject) => {
    compiler.run((err, stats) => {
        if (err) {
            return reject(err);
        }
        return resolve(stats)
    });
});

export const simpleJSCompiler = (testFilePath: string) => {
    return webpack([
        {
            entry: path.resolve(__dirname, testFilePath),
            output: {
                path: tmpdir()
            },
            mode: 'development',
            plugins: [
                new EvalWebpackPlugin()
            ]
        }
    ]);
};

export const simpleTSCompiler = (testFilePath: string) => {
    return webpack([
        {
            entry: path.resolve(__dirname, testFilePath),
            output: {
                path: tmpdir()
            },
            module: {
                rules: [
                    {
                        loader: 'ts-loader',
                        test: /\.ts/
                    }
                ]
            },
            resolve: {
                extensions: ['.ts']
            },
            mode: 'development',
            plugins: [
                new EvalWebpackPlugin()
            ]
        }
    ]);
};
