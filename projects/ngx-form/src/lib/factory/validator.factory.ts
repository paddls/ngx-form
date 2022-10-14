import {ValidatorFn} from '@angular/forms';
import {Type} from '@angular/core';

export type ValidatorFactoryFn = (...providers: any[]) => ValidatorFn;

export interface ValidatorFactoryWithProviders {

  factory: ValidatorFactoryFn;

  providers: Type<any>[];

}

export class ValidatorFactory {

  public static of(factory: ValidatorFactoryFn, providers: Type<any>[]): ValidatorFactoryWithProviders {
    return {factory, providers};
  }

}
