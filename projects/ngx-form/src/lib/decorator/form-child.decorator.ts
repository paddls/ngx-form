import {NgxFormGroup} from '../model/ngx-form-group.model';
import {AbstractControl} from '@angular/forms';
import {NgxFormControl} from '../model/ngx-form-control.model';
import {NgxFormArray} from '../model/ngx-form-array.model';

export const FORM_CHILD_METADATA_KEY: string = 'ngx-form:form-children';

export interface FormChildContext {

  attribute: string;

  path: string;
}

export function FormChild<V>(context: FormChildContext): any {
  return (target: any, propertyKey: any): void => {
    Reflect.defineMetadata(FORM_CHILD_METADATA_KEY, context, target, propertyKey);

    Object.defineProperty(target.constructor.prototype, propertyKey, {
      get(): NgxFormGroup<V>|NgxFormControl<V>|NgxFormArray<V> {
        return (this[context.attribute] as AbstractControl).get(context.path) as NgxFormGroup<V>|NgxFormControl<V>|NgxFormArray<V>;
      },
      set: () => void 0,
      enumerable: true,
      configurable: true
    });
  }
}
