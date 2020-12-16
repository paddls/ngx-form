import {addFormContextCommon, FormContextCommon} from './decorator.common';

export const FORM_CONTROL_SUFFIX_METADATA_KEY: string = 'form-control';

export function FormControl<T>(formControlContext?: FormContextCommon<T> | string): any {
  return (target: any, propertyKey: string): void => {
    let formControlContextConfiguration: FormContextCommon<T> = {
      name: propertyKey
    }

    if (typeof formControlContext === 'object') {
      formControlContextConfiguration = {
        ...formControlContextConfiguration,
        ...formControlContext
      };
    } else if (typeof formControlContext === 'string') {
      formControlContextConfiguration.name = formControlContext;
    }

    addFormContextCommon(target, formControlContextConfiguration, propertyKey, FORM_CONTROL_SUFFIX_METADATA_KEY);
  }
}
