import { ClassDeclaration, SyntaxKind } from 'ts-morph';

export interface FormControlProperties {

  name: string;

  type: string;

  defaultValue?: any;

  validators?: string;

  asyncValidators?: string;

}

export function getFormControlProperties(declaration: ClassDeclaration): FormControlProperties[] {
  const result: FormControlProperties[] = [];

  declaration.getDescendantsOfKind(SyntaxKind.PropertyDeclaration).forEach((propertyDeclaration) => {
    if (!propertyDeclaration.getDecorator('FormControl')) {
      return;
    }

    const properties: FormControlProperties = {
      name: propertyDeclaration.getName(),
      type: propertyDeclaration.getType().getText(),
    }

    propertyDeclaration.getDecorator('FormControl')?.getCallExpression()?.getArguments().forEach(arg => {
      if (arg.getType().isObject()) {
        const text = arg.asKind(SyntaxKind.ObjectLiteralExpression).getText()
          .replace(/([a-zA-Z0-9_]+)(?=\s*:)/g, '"$1"')
          .replace(/'([^']+)'/g, '"$1"');
        const obj = JSON.parse(text);
        properties.defaultValue = typeof obj.defaultValue === 'string' ? `'${obj.defaultValue}'` : obj.defaultValue;
      }
    });
    propertyDeclaration.getDecorator('FormControl')?.remove();

    propertyDeclaration.getDecorator('Validator')?.getCallExpression()?.getArguments().forEach(arg => {
      properties.validators = arg.getText();
    });
    propertyDeclaration.getDecorator('Validator')?.remove();

    propertyDeclaration.getDecorator('AsyncValidator')?.getCallExpression()?.getArguments().forEach(arg => {
      properties.asyncValidators = arg.getText();
    });
    propertyDeclaration.getDecorator('AsyncValidator')?.remove();

    result.push(properties);
  });

  return result;
}
