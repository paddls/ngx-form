import 'reflect-metadata';

import {Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {NgxFormBuilder} from './core/ngx-form.builder';
import {AsyncValidatorResolver} from './core/async-validator.resolver';
import {DisableOnHandler} from './core/disable-on.handler';

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
        AsyncValidatorResolver,
        DisableOnHandler
      ]
    };
  }
}
