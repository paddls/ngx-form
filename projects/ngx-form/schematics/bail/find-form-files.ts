import { Tree } from '@angular-devkit/schematics';

export function findFormFiles(dirPath: string, tree: Tree): string[] {
  const dir = tree.getDir(dirPath);
  let matches: string[] = [];

  for (const file of dir.subfiles) {
    if (file.endsWith('.form.ts')) {
      matches.push(`${dirPath}/${file}`);
    }
  }

  for (const subdir of dir.subdirs) {
    matches = matches.concat(findFormFiles(`${dirPath}/${subdir}`, tree));
  }

  return matches;
}
