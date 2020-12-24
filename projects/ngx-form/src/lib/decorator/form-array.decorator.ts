import {ConstructorFunction} from '../common';
import {addFormContextCommon, FormContextCommon, FormHooks} from './decorator.common';

export const FORM_ARRAY_SUFFIX_METADATA_KEY: string = 'form-array';
export const FORM_ARRAY_INSTANCE_METADATA_KEY: string = 'ngx-form:form-array-instance';

export interface FormArrayContext<T> extends FormContextCommon<T> {

  type?: () => ConstructorFunction<T>;

  updateOn?: FormHooks
}

export function FormArray<T>(formArrayContext?: FormContextCommon<T> | string | (() => ConstructorFunction<T>)): any {
  return (target: any, propertyKey: string): void => {
    let formArrayContextConfiguration: FormArrayContext<T> = {
      name: propertyKey
    }

    if (typeof formArrayContext === 'object') {
      formArrayContextConfiguration = {
        ...formArrayContextConfiguration,
        ...formArrayContext
      };
    } else if (typeof formArrayContext === 'string') {
      formArrayContextConfiguration.name = formArrayContext;
    } else if (typeof formArrayContext === 'function') {
      formArrayContextConfiguration.type = formArrayContext;
    }

    addFormContextCommon(target, formArrayContextConfiguration, propertyKey, FORM_ARRAY_SUFFIX_METADATA_KEY);
  }
}
