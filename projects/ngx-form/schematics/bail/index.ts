import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { findFormFiles } from './find-form-files';
import { Project } from 'ts-morph';

// noinspection JSUnusedGlobalSymbols
export function bail(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const project = new Project();

    console.log('Starting visit...');
    const formFiles = findFormFiles('projects/ngx-form-app', tree);
    project.addSourceFilesAtPaths(formFiles);
    console.log('Found form files:', formFiles);

    project.getSourceFiles().forEach((sourceFile) => {
      sourceFile.getImportDeclarations().forEach((importDeclaration) => {
        importDeclaration.getNamedImports().forEach((namedImports) => {
          console.log(namedImports.getName());
        })
      });
    })

    return tree;
  };
}

