import { SourceFile } from 'ts-morph';

export function removeDoubleEmptyLines(sourceFile: SourceFile) {
  const text = sourceFile.getFullText();

  const cleanedText = text
    .split('\n')
    .reduce((acc: string[], line: string) => {
      const isEmpty = line.trim() === '';
      const lastWasEmpty = acc.length > 0 && acc[acc.length - 1].trim() === '';
      if (!(isEmpty && lastWasEmpty)) {
        acc.push(line);
      }
      return acc;
    }, [])
    .join('\n');

  sourceFile.replaceWithText(cleanedText);
}
