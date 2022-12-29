import {NgxFormModule} from '../ngx-form.module';
import {NgxFormGroup} from '../model/ngx-form-group.model';
import {ConstructorFunction} from '../common/common';
import {FormGroupContext} from './form-group.decorator';
import {DisableOnHandler} from '../core/handler/disable-on.handler';
import {OnValueChangesHandler} from '../core/handler/on-value-changes.handler';

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

        const form: NgxFormGroup<V> = NgxFormModule.getNgxFormBuilder().build(formGroupContextConfiguration);
        Reflect.defineMetadata(BUILD_FORM_INSTANCE_METADATA_KEY, form, this, propertyKey);

        NgxFormModule.getInjector().get(DisableOnHandler).handle(type, form, this[config?.unsubscribeOn]);

        NgxFormModule.getInjector().get(OnValueChangesHandler).handle(type, form, this[config?.unsubscribeOn]);

        return form;
      },
      set: () => void 0,
      enumerable: true,
      configurable: true
    });
  }
}
