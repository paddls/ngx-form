import {NgxFormModule} from '../ngx-form.module';
import {NgxFormGroup} from '../model/ngx-form-group.model';
import {ConstructorFunction} from '../common/common';
import {FormGroupContext} from './form-group.decorator';
import {UPDATE_ON_METADATA_KEY} from './update-on.decorator';
import {AbstractControlOptions} from '@angular/forms';
import {VALIDATORS_METADATA_KEY} from './validator.decorator';
import {ASYNC_VALIDATORS_METADATA_KEY} from './async-validator.decorator';
import {DisableOnHandler} from '../core/disable-on.handler';

export const BUILD_FORM_METADATA_KEY: string = 'ngx-form:build-form';

export const BUILD_FORM_INSTANCE_METADATA_KEY: string = 'ngx-form:form-instance';

export interface BuildFormConfig {

  unsubscribeOn?: string;

}

export interface BuildFormContextConfiguration<T> extends BuildFormConfig {

  type: () => ConstructorFunction<T>;

}

export function BuildForm<V>(type: () => ConstructorFunction<V>, config: BuildFormConfig = {}): any {
  return (target: any, propertyKey: string): void => {
    const buildFormContextConfiguration: BuildFormContextConfiguration<V> = {
      type,
      ...config
    };
    Reflect.defineMetadata(BUILD_FORM_METADATA_KEY, buildFormContextConfiguration, target);

    Object.defineProperty(target.constructor.prototype, propertyKey, {
      get(): NgxFormGroup<V> {
        if (Reflect.hasOwnMetadata(BUILD_FORM_INSTANCE_METADATA_KEY, this, propertyKey)) {
          return Reflect.getOwnMetadata(BUILD_FORM_INSTANCE_METADATA_KEY, this, propertyKey);
        }

        const formGroupContextConfiguration: FormGroupContext<V> = {
          type,
        };

        const options: AbstractControlOptions = {
          validators: Reflect.getMetadata(VALIDATORS_METADATA_KEY, type()),
          asyncValidators: Reflect.getMetadata(ASYNC_VALIDATORS_METADATA_KEY, type()),
          updateOn: Reflect.getMetadata(UPDATE_ON_METADATA_KEY, type())
        };

        const form: NgxFormGroup<V> = NgxFormModule.getNgxFormBuilder().build(formGroupContextConfiguration, options);
        Reflect.defineMetadata(BUILD_FORM_INSTANCE_METADATA_KEY, form, this, propertyKey);

        NgxFormModule.getInjector().get(DisableOnHandler).subscribe(type, form);

        return form;
      },
      set: () => void 0,
      enumerable: true,
      configurable: true
    });
  }
}
