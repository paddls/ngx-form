import {NgxFormModule} from '../ngx-form.module';
import {NgxFormGroup} from '../model/ngx-form-group.model';

export const FORM_METADATA_KEY: string = 'ngx-form:form';
export const FORM_INSTANCE_METADATA_KEY: string = 'ngx-form:form-instance';

export interface FormContextConfiguration<T> {
  type: () => new(...args: any[]) => T;
}

export function Form<V>(type: () => new(...args: any[]) => V): any {
  return (target: any, propertyKey: string): void => {
    const formContextConfiguration: FormContextConfiguration<V> = {
      type
    };
    Reflect.defineMetadata(FORM_METADATA_KEY, formContextConfiguration, target);

    Object.defineProperty(target.constructor.prototype, propertyKey, {
      get(): NgxFormGroup<V> {
        if (Reflect.hasOwnMetadata(FORM_INSTANCE_METADATA_KEY, this, propertyKey)) {
          return Reflect.getOwnMetadata(FORM_INSTANCE_METADATA_KEY, this, propertyKey);
        }

        const form: NgxFormGroup<V> = NgxFormModule.getNgxFormService().build(formContextConfiguration.type());
        Reflect.defineMetadata(FORM_INSTANCE_METADATA_KEY, form, this, propertyKey);

        return form;
      },
      set: () => void 0,
      enumerable: true,
      configurable: true
    });
  }
}
