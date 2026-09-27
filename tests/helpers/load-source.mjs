import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

// Execute real TypeScript modules, replacing only external services/framework hooks.
export function loadSource(file, mocks = {}, globals = {}) {
  const filename = path.resolve(file);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const nativeRequire = createRequire(filename);
  const require = name => Object.hasOwn(mocks, name) ? mocks[name] : nativeRequire(name);
  const module = { exports: {} };
  new Function('require', 'module', 'exports', ...Object.keys(globals), code)(require, module, module.exports, ...Object.values(globals));
  return module.exports;
}
