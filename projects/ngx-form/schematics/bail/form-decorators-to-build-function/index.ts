import { Project, SourceFile } from 'ts-morph';
import { Tree } from '@angular-devkit/schematics';
import { morph } from './morph';
import { findSourceFiles } from './find-source-files';
import * as path from 'path';

export function formDecoratorsToBuildFunction(tree: Tree) {
  console.log('Replacing form decorators by a build() function...');

  const project = new Project();
  const formFiles = findSourceFiles('projects/ngx-form-app', tree);
  project.addSourceFilesAtPaths(formFiles);

  project.getSourceFiles()
    .forEach((sourceFile: SourceFile) =>
      tree.overwrite(path.relative(process.cwd(), sourceFile.getFilePath()), morph(sourceFile).getFullText())
    );
}
