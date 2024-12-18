import { ValidatorFn } from '@angular/forms';
import { ValidatorFactoryWithProviders } from '../factory/validator.factory';

export const VALIDATORS_METADATA_KEY: string = 'ngx-form:validators';

export type ValidatorConfig = ValidatorFn | ValidatorFactoryWithProviders;

export function Validator(validators: ValidatorConfig | ValidatorConfig[]): any {
  return (target: any, propertyKey: string = null): void => {
    let key: string = VALIDATORS_METADATA_KEY;
    if (propertyKey) {
      key += `:${propertyKey}`;
    }
    Reflect.defineMetadata(key, validators, target);
  }
}
