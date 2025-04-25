import { ClassDeclaration, SyntaxKind } from 'ts-morph';

export interface FormGroupProperties {

  name: string;

  type: string;

}

export function getFormGroupProperties(declaration: ClassDeclaration): FormGroupProperties[] {
  const result: FormGroupProperties[] = [];

  declaration.getDescendantsOfKind(SyntaxKind.PropertyDeclaration).forEach((propertyDeclaration) => {
    if (!propertyDeclaration.getDecorator('FormGroup')) {
      return;
    }

    const properties: FormGroupProperties = {
      name: propertyDeclaration.getName(),
      type: propertyDeclaration.getType().getSymbol().getName(),
    }

    propertyDeclaration.getDecorator('FormGroup')?.remove();
    result.push(properties);
  });

  return result;
}
