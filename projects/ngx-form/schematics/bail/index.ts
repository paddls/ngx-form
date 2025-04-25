import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { formDecoratorsToBuildFunction } from './form-decorators-to-build-function';

// noinspection JSUnusedGlobalSymbols
export function bail(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    formDecoratorsToBuildFunction(tree);

    return tree;
  };
}

