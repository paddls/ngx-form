import {ConstructorFunction} from '../common';
import {addFormContextCommon, FormContextCommon} from './decorator.common';

export const FORM_GROUP_SUFFIX_METADATA_KEY: string = 'form-group';

export interface FormGroupContext<T> extends FormContextCommon<T> {

  type: () => ConstructorFunction<T>;
}

export function FormGroup<T>(formGroupContext: FormGroupContext<T> | (() => ConstructorFunction<T>)): any {
  return (target: any, propertyKey: string): void => {
    let formGroupContextConfiguration: FormGroupContext<T> = {
      name: propertyKey,
    } as FormGroupContext<T>;

    if (typeof formGroupContext === 'object') {
      formGroupContextConfiguration = {
        ...formGroupContextConfiguration,
        ...formGroupContext
      };
    } else if (typeof formGroupContext === 'function') {
      formGroupContextConfiguration.type = formGroupContext;
    }

    addFormContextCommon(target, formGroupContextConfiguration, propertyKey, FORM_GROUP_SUFFIX_METADATA_KEY);
  }
}
