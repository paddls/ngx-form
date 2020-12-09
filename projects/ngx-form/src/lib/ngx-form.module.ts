import 'reflect-metadata';

import {Injector, NgModule} from '@angular/core';
import {NgxFormBuilder} from './ngx-form.builder';

@NgModule({
  providers: [
    NgxFormBuilder
  ]
})
export class NgxFormModule {

  public static injector: Injector = null;

  public constructor(injector: Injector) {
    NgxFormModule.injector = injector;
  }

  public static getNgxFormBuilder(): NgxFormBuilder {
    return NgxFormModule.injector.get(NgxFormBuilder);
  }
}
