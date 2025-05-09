import { inject, Injectable, Injector, Type } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { AsyncValidatorConfig } from '../decorator/async-validator.decorator';

@Injectable()
export class AsyncValidatorResolver {

  private readonly injector: Injector = inject(Injector);

  public resolve(config: AsyncValidatorConfig | AsyncValidatorConfig[]): AsyncValidatorFn | AsyncValidatorFn[] {
    if (!config) {
      return;
    } else if (Array.isArray(config)) {
      return config.map((c: AsyncValidatorConfig) => this.asyncValidatorConfigToAsyncValidatorFn(c));
    } else {
      return this.asyncValidatorConfigToAsyncValidatorFn(config);
    }
  }

  private asyncValidatorConfigToAsyncValidatorFn(config: AsyncValidatorConfig): AsyncValidatorFn {
    if (typeof config === 'function') {
      return config;
    } else if (typeof config === 'object') {
      return config.factory(...config.providers.map((provider: Type<any>) => this.injector.get(provider)));
    } else {
      throw new Error('Invalid @AsyncValidator argument');
    }
  }
}
