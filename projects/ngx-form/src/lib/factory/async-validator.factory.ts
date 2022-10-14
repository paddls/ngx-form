import {AsyncValidatorFn} from '@angular/forms';
import {Type} from '@angular/core';

export type AsyncValidatorFactoryFn = (...providers: any[]) => AsyncValidatorFn;

export interface AsyncValidatorFactoryWithProviders {

  factory: AsyncValidatorFactoryFn;

  providers: Type<any>[];

}

export class AsyncValidatorFactory {

  public static of(factory: AsyncValidatorFactoryFn, providers: Type<any>[]): AsyncValidatorFactoryWithProviders {
    return {factory, providers};
  }

}
