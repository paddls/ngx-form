import { Scope, SourceFile, SyntaxKind } from 'ts-morph';

export function morph(sourceFile: SourceFile): SourceFile {
  const classDeclarations = sourceFile.getDescendantsOfKind(SyntaxKind.ClassDeclaration);
  const controls: string[] = [];

  classDeclarations.forEach((declaration) => {
    declaration.getDescendantsOfKind(SyntaxKind.PropertyDeclaration).forEach((propertyDeclaration) => {
      propertyDeclaration.getDecorator('FormControl')?.getCallExpression()?.getArguments().forEach(arg => {
        if (arg.getType().isObject()) {
          const text = arg.asKind(SyntaxKind.ObjectLiteralExpression).getText()
            .replace(/([a-zA-Z0-9_]+)(?=\s*:)/g, '"$1"')
            .replace(/'([^']+)'/g, '"$1"');
          const obj = JSON.parse(text);
          const defaultValue = typeof obj.defaultValue === 'string' ? `'${obj.defaultValue}'` : obj.defaultValue;

          controls.push(`${propertyDeclaration.getName()}: new FormControl(${defaultValue})`);
        }
      });

    });

    declaration.addMethod({
      name: 'build',
      isStatic: true,
      scope: Scope.Public,
      returnType: `FormGroup<${declaration.getName()}>`, // TODO
      statements: (writer) => {
        writer.write('return new FormGroup({');
        writer.newLine();
        controls.forEach((control, index) => {
          writer.indent();
          writer.write(control);
          if (index < controls.length - 1) {
            writer.write(',');
            writer.newLine();
          }
        });
        writer.newLine();
        writer.write('});');
      }
    });
  });

  sourceFile.getImportDeclarations().forEach((importDeclaration) => {
    if (importDeclaration.getModuleSpecifierValue() === '@paddls/ngx-form') {
      importDeclaration.remove();
    }
  });

  sourceFile.addImportDeclaration({
    namedImports: [{name: 'FormGroup'}, {name: 'FormControl'}],
    moduleSpecifier: '@angular/forms'
  })

  return sourceFile;
}
