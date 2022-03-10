import webpack from 'webpack';
import EvalWebpackPlugin from '../index';
import * as path from 'path';
import { tmpdir } from 'os';

describe('Verify if eval is being used in our code', () => {
    test('js', (callback) => {
        const compiler = webpack([
            {
                entry: path.resolve(__dirname, './fixtures/index.js'),
                output: {
                    path: tmpdir()
                },
                mode: 'development',
                plugins: [
                    new EvalWebpackPlugin()
                ]
            }
        ]);

        compiler.run((_c, res) => {
            expect(res?.stats[0].compilation.errors).toHaveLength(2);
            callback();
        });
    });

    test('ts', (callback) => {
        const compiler = webpack([
            {
                entry: path.resolve(__dirname, './fixtures/index.ts'),
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

        compiler.run((_c, res) => {
            expect(res?.stats[0].compilation.errors).toHaveLength(2);
            callback();
        });
    });
});