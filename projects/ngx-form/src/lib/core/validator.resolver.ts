import { inject, Injectable, Injector, Type } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { AsyncValidatorConfig } from '../decorator/async-validator.decorator';
import { ValidatorConfig } from '../decorator/validator.decorator';

@Injectable()
export class ValidatorResolver {

  private readonly injector: Injector = inject(Injector);

  public resolve(config: ValidatorConfig | ValidatorConfig[]): ValidatorFn | ValidatorFn[] {
    if (!config) {
      return;
    } else if (Array.isArray(config)) {
      return config.map((c: AsyncValidatorConfig) => this.validatorConfigToValidatorFn(c));
    } else {
      return this.validatorConfigToValidatorFn(config);
    }
  }

  private validatorConfigToValidatorFn(config: ValidatorConfig): ValidatorFn {
    if (typeof config === 'function') {
      return config;
    } else if (typeof config === 'object') {
      return config.factory(...config.providers.map((provider: Type<any>) => this.injector.get(provider)));
    } else {
      throw new Error('Invalid @Validator argument');
    }
  }
}
