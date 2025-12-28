import fs from "node:fs";
import { parse } from "acorn";
import { walk } from "zimmerframe";

export function check(filePath) {
  const errors = [];

  const src = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const ast = parse(src, {
    ecmaVersion: 'latest',
    allowAwaitOutsideFunction: true,
  });
  
  walk(ast, { errors, mapFnNameToAsync: {} }, {
    FunctionDeclaration(node, { state }) {
      state.mapFnNameToAsync[node.id.name] = node.async;
    },
    IfStatement(node, { state }) {
      if (
        node.test.type === 'CallExpression' &&
        state.mapFnNameToAsync[node.test.callee.name]
      ) {
        state.errors.push({ start: node.test.start, end: node.test.end });
      }
    },
  });

  return errors;
}
