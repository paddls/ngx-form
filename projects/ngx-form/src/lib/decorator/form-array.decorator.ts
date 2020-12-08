import {ConstructorFunction} from '../common';

export const FORM_ARRAYS_METADATA_KEY: string = 'ngx-form:form-arrays';

export interface FormArrayContext<T> {

  name?: string;

  value?: any;

  type?: () => ConstructorFunction<T>;
}

export interface FormArrayContextConfiguration<T> extends FormArrayContext<T> {

  propertyKey: string;
}

export function FormArray<T>(formArrayContext?: FormArrayContext<T>|string): any {
  return (target: any, propertyKey: string): void => {
    let formArrayContextConfiguration: FormArrayContextConfiguration<T> = {
      propertyKey,
      name: propertyKey
    }

    if (typeof formArrayContext === 'object') {
      formArrayContextConfiguration = {
        ...formArrayContextConfiguration,
        ...formArrayContext
      };
    } else if (typeof formArrayContext === 'string') {
      formArrayContextConfiguration.name = formArrayContext;
    }

    let metas: FormArrayContextConfiguration<T>[] = [];
    if (Reflect.hasMetadata(FORM_ARRAYS_METADATA_KEY, target)) {
      metas = Reflect.getMetadata(FORM_ARRAYS_METADATA_KEY, target);
    }

    Reflect.defineMetadata(FORM_ARRAYS_METADATA_KEY, metas.concat(formArrayContextConfiguration), target);
  }
}
