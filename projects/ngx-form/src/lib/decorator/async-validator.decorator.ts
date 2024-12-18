import { AsyncValidatorFn } from '@angular/forms';
import { AsyncValidatorFactoryWithProviders } from '../factory/async-validator.factory';

export const ASYNC_VALIDATORS_METADATA_KEY: string = 'ngx-form:async-validators';

export type AsyncValidatorConfig = AsyncValidatorFn | AsyncValidatorFactoryWithProviders;

export function AsyncValidator(asyncValidators: AsyncValidatorConfig | AsyncValidatorConfig[]): any {
  return (target: any, propertyKey: string = null): void => {
    let key: string = ASYNC_VALIDATORS_METADATA_KEY;
    if (propertyKey) {
      key += `:${propertyKey}`;
    }
    Reflect.defineMetadata(key, asyncValidators, target);
  }
}
