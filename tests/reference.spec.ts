import { asyncRun, simpleJSCompiler } from './helpers';

describe('Verify if eval reference is caught', () => {
    test('js', async () => {
        const compiler = simpleJSCompiler('./fixtures/reference.js');
        const res = await asyncRun(compiler);
        const errors = res?.stats[0].compilation.errors;
        expect(errors?.length).toBe(3);
    });
});