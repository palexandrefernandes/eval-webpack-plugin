const evalReference = eval;
const l = { eval: () => {}};
l.eval();
const test = true ? eval : null;
const functionTrick = true ? (() => eval)() : null;
const ev = global['ev' + 'al'];
ev('console.log(\'test\')');
let i = 'somehting';
i = 'asdas';
evalReference();


global.eval = console.log;
eval('lol');