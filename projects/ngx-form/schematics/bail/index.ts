import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { findFormFiles } from './find-form-files';
import { Project } from 'ts-morph';
import { morph } from './morph';
import * as path from 'path';

// noinspection JSUnusedGlobalSymbols
export function bail(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const project = new Project();

    console.log('Starting visit...');
    const formFiles = findFormFiles('projects/ngx-form-app', tree);
    // project.addSourceFilesAtPaths(formFiles);
    project.addSourceFilesAtPaths(['projects/ngx-form-app/src/app/form/address.form.ts']);
    console.log('Found form files:', formFiles);

    project.getSourceFiles().forEach((sourceFile) => {
      const morphed = morph(sourceFile);
      tree.overwrite(path.relative(process.cwd(), sourceFile.getFilePath()), morphed.getFullText());
    });

    return tree;
  };
}

