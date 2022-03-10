import { simpleJSCompiler, simpleTSCompiler } from './helpers';

describe('Verify if eval is being used in our code', () => {
    test('js', (done) => {
        const compiler = simpleJSCompiler('./fixtures/index.js');
        compiler.run((_c, res) => {
            expect(res?.stats[0].compilation.errors).toHaveLength(2);
            done();
        });
    });

    test('ts', (done) => {
        const compiler = simpleTSCompiler('./fixtures/index.ts');
        compiler.run((_c, res) => {
            expect(res?.stats[0].compilation.errors).toHaveLength(2);
            done();
        });
    });
});