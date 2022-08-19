import 'reflect-metadata';

import {Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {NgxFormBuilder} from './ngx-form.builder';
import {AsyncValidatorResolver} from './resolver/async-validator.resolver';

@NgModule()
export class NgxFormModule {

  public static injector: Injector = null;

  public constructor(injector: Injector) {
    NgxFormModule.injector = injector;
  }

  public static getNgxFormBuilder(): NgxFormBuilder {
    return NgxFormModule.injector.get(NgxFormBuilder);
  }

  public static forRoot(): ModuleWithProviders<NgxFormModule> {
    return {
      ngModule: NgxFormModule,
      providers: [
        NgxFormBuilder,
        AsyncValidatorResolver
      ]
    };
  }
}
