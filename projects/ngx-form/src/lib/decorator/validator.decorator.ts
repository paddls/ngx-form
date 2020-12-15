import {ValidatorFn} from '@angular/forms';

export const VALIDATORS_METADATA_KEY: string = 'ngx-form:validators';

export function Validator(validators: ValidatorFn | ValidatorFn[]): any {
  return (target: any, propertyKey: string = null): void => {
    let key: string = VALIDATORS_METADATA_KEY;
    if (propertyKey) {
      key += `:${propertyKey}`;
    }
    Reflect.defineMetadata(key, validators, target);
  }
}
