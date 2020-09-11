import 'reflect-metadata';

import {Injector, NgModule} from '@angular/core';
import {NgxFormService} from './ngx-form.service';
import {NgxFormBuilder} from './ngx-form.builder';

@NgModule({
  providers: [
    NgxFormBuilder,
    NgxFormService
  ]
})
export class NgxFormModule {

  public static injector: Injector = null;

  public constructor(injector: Injector) {
    NgxFormModule.injector = injector;
  }

  public static getNgxFormService(): NgxFormService {
    return NgxFormModule.injector.get(NgxFormService);
  }
}
