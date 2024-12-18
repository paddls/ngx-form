import 'reflect-metadata';

import {APP_INITIALIZER, EnvironmentProviders, Injector, makeEnvironmentProviders, ModuleWithProviders, NgModule} from '@angular/core';
import {NgxFormBuilder} from './core/ngx-form.builder';
import {AsyncValidatorResolver} from './core/async-validator.resolver';
import {DisableOnHandler} from './core/handler/disable-on.handler';
import {ValidatorResolver} from './core/validator.resolver';
import {OnValueChangesHandler} from './core/handler/on-value-changes.handler';

export function provideNgxForm(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector) => (): void => {
        NgxFormModule.injector = injector;
      },
      multi: true,
      deps: [Injector]
    },
    NgxFormBuilder,
    ValidatorResolver,
    AsyncValidatorResolver,
    DisableOnHandler,
    OnValueChangesHandler
  ]);
}

@NgModule()
export class NgxFormModule {

  public static injector: Injector = null;

  public static getNgxFormBuilder(): NgxFormBuilder {
    return NgxFormModule.injector.get(NgxFormBuilder);
  }

  public static getInjector(): Injector {
    return NgxFormModule.injector;
  }

  /**
   * @deprecated use provideNgxForm() instead
   */
  public static forRoot(): ModuleWithProviders<NgxFormModule> {
    return {
      ngModule: NgxFormModule,
      providers: [
        provideNgxForm()
      ]
    };
  }
}
