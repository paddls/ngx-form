import {ConstructorFunction} from '../common';

export const FORM_GROUPS_METADATA_KEY: string = 'ngx-form:form-groups';

export interface FormGroupContext<T> {

  name?: string;

  type: () => ConstructorFunction<T>;
}

export interface FormGroupContextConfiguration<T> extends FormGroupContext<T> {

  propertyKey: string;
}

export function FormGroup<T>(formGroupContext: FormGroupContext<T>): any {
  return (target: any, propertyKey: string): void => {
    const formGroupContextConfiguration: FormGroupContextConfiguration<T> = {
      propertyKey,
      name: propertyKey,
      ...formGroupContext
    }

    let metas: FormGroupContextConfiguration<T>[] = [];
    if (Reflect.hasMetadata(FORM_GROUPS_METADATA_KEY, target)) {
      metas = Reflect.getMetadata(FORM_GROUPS_METADATA_KEY, target);
    }

    Reflect.defineMetadata(FORM_GROUPS_METADATA_KEY, metas.concat(formGroupContextConfiguration), target);
  }
}
