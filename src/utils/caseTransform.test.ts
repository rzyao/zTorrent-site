import { toCamelCase } from './caseTransform';

function expectEqual(a: any, b: any) {
  const ja = JSON.stringify(a);
  const jb = JSON.stringify(b);
  if (ja !== jb) {
    throw new Error(`Not equal:\n${ja}\n!==\n${jb}`);
  }
}

const input1 = { registration_enabled: true };
const output1 = { registrationEnabled: true };
expectEqual(toCamelCase(input1), output1);

const input2 = { a_b: { c_d: 1 }, arr: [{ e_f: 2 }, { g_h: 3 }] };
const output2 = { aB: { cD: 1 }, arr: [{ eF: 2 }, { gH: 3 }] };
expectEqual(toCamelCase(input2), output2);

const input3 = { alreadyCamel: { innerKey: 'x' } };
const output3 = { alreadyCamel: { innerKey: 'x' } };
expectEqual(toCamelCase(input3), output3);

