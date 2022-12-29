import 'reflect-metadata';

import {Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {NgxFormBuilder} from './core/ngx-form.builder';
import {AsyncValidatorResolver} from './core/async-validator.resolver';
import {DisableOnHandler} from './core/handler/disable-on.handler';
import {ValidatorResolver} from './core/validator.resolver';
import {OnValueChangesHandler} from './core/handler/on-value-changes.handler';

@NgModule()
export class NgxFormModule {

  private static injector: Injector = null;

  public constructor(injector: Injector) {
    NgxFormModule.injector = injector;
  }

  public static getNgxFormBuilder(): NgxFormBuilder {
    return NgxFormModule.injector.get(NgxFormBuilder);
  }

  public static getInjector(): Injector {
    return NgxFormModule.injector;
  }

  public static forRoot(): ModuleWithProviders<NgxFormModule> {
    return {
      ngModule: NgxFormModule,
      providers: [
        NgxFormBuilder,
        ValidatorResolver,
        AsyncValidatorResolver,
        DisableOnHandler,
        OnValueChangesHandler
      ]
    };
  }
}
