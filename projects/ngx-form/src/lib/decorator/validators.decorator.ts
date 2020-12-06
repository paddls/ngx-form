import { ValidatorFn } from '@angular/forms';

export const VALIDATORS_METADATA_KEY: string = 'ngx-form:validators';

export interface ValidatorsConfiguration {

  validators: ValidatorFn[];

  propertyKey: string;
}

export function Validate(...validators: ValidatorFn[]): any {
  return (target: any, propertyKey: string): void => {
    const validatorsConfiguration: ValidatorsConfiguration = {
      propertyKey,
      validators
    }

    let metas: ValidatorsConfiguration[] = [];
    if (Reflect.hasMetadata(VALIDATORS_METADATA_KEY, target)) {
      metas = Reflect.getMetadata(VALIDATORS_METADATA_KEY, target);
    }

    Reflect.defineMetadata(VALIDATORS_METADATA_KEY, metas.concat(validatorsConfiguration), target);
  }
}
