import {NgxFormModule} from '../ngx-form.module';
import {NgxFormGroup} from '../model/ngx-form-group.model';
import {ConstructorFunction} from '../common';
import {FormGroupContext} from './form-group.decorator';
import {FormHooks} from './decorator.common';
import {UPDATE_ON_METADATA_KEY} from './update-on.decorator';

export const BUILD_FORM_METADATA_KEY: string = 'ngx-form:build-form';
export const BUILD_FORM_INSTANCE_METADATA_KEY: string = 'ngx-form:form-instance';

export interface BuildFormContextConfiguration<T> {
  type: () => ConstructorFunction<T>;
}

export function BuildForm<V>(type: () => ConstructorFunction<V>): any {
  return (target: any, propertyKey: string): void => {
    const buildFormContextConfiguration: BuildFormContextConfiguration<V> = {
      type
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
        const updateOn: FormHooks = Reflect.getMetadata(UPDATE_ON_METADATA_KEY, target);
        const form: NgxFormGroup<V> = NgxFormModule.getNgxFormBuilder().build(formGroupContextConfiguration, updateOn);
        Reflect.defineMetadata(BUILD_FORM_INSTANCE_METADATA_KEY, form, this, propertyKey);

        return form;
      },
      set: () => void 0,
      enumerable: true,
      configurable: true
    });
  }
}
