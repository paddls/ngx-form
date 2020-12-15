import {AsyncValidatorFn} from '@angular/forms';

export const ASYNC_VALIDATORS_METADATA_KEY: string = 'ngx-form:async-validators';

export function AsyncValidator(asyncValidators: AsyncValidatorFn|AsyncValidatorFn[]): any {
  return (target: any, propertyKey: string = null): void => {
    let key: string = ASYNC_VALIDATORS_METADATA_KEY;
    if (propertyKey) {
      key += `:${propertyKey}`;
    }
    Reflect.defineMetadata(key, asyncValidators, target);
  }
}
