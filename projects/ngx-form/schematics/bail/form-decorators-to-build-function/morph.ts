import { ClassDeclaration, CodeBlockWriter, ImportDeclaration, Scope, SourceFile, SyntaxKind } from 'ts-morph';
import { removeDoubleEmptyLines } from '../utils/remove-double-empty-lines';
import { FormControlProperties, getFormControlProperties } from './form-control-properties';
import { FormGroupProperties, getFormGroupProperties } from './form-group-properties';

export function morph(sourceFile: SourceFile): SourceFile {
  const classDeclarations: ClassDeclaration[] = sourceFile.getDescendantsOfKind(SyntaxKind.ClassDeclaration);

  classDeclarations.forEach((declaration: ClassDeclaration) => {
    const controls: string[] = getFormControlProperties(declaration).map((properties: FormControlProperties) => {
      const validators = properties.validators ? `, ${properties.validators}` : '';
      const asyncValidators = properties.asyncValidators ? `, ${properties.asyncValidators}` : '';

      return `${properties.name}: new FormControl<${properties.type}>(${properties.defaultValue}${validators}${asyncValidators})`;
    });

    const groups: string[] = getFormGroupProperties(declaration).map((properties: FormGroupProperties) => {
      return `${properties.name}: ${properties.type}.build()`;
    });

    const allControls = [...controls, ...groups];

    declaration.addMethod({
      name: 'build',
      isStatic: true,
      scope: Scope.Public,
      returnType: `FormGroup`,
      statements: (writer: CodeBlockWriter) => {
        writer.write('return new FormGroup({');
        writer.newLine();
        allControls.forEach((control, index) => {
          writer.indent();
          writer.write(control);
          if (index < allControls.length - 1) {
            writer.write(',');
            writer.newLine();
          }
        });
        writer.newLine();
        writer.write('});');
      }
    });
  });

  sourceFile.getImportDeclarations().forEach((importDeclaration: ImportDeclaration) => {
    if (importDeclaration.getModuleSpecifierValue() === '@paddls/ngx-form') {
      importDeclaration.remove();
    }
  });

  sourceFile.addImportDeclaration({
    namedImports: [{name: 'FormGroup'}, {name: 'FormControl'}],
    moduleSpecifier: '@angular/forms'
  });

  removeDoubleEmptyLines(sourceFile);

  return sourceFile;
}
