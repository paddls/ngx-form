import {AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {NgxForm} from './ngx-form';
import {FormContextCommon} from '../decorator/decorator.common';

export const FORM_CONTROL_INSTANCE_METADATA_KEY: string = 'ngx-form:form-control-instance';

export class NgxFormControl<V> extends FormControl implements NgxForm {

  private makeRestoration: boolean = false;

  public readonly value: any;

  public constructor(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  public getValue(): V {
    return this.value;
  }

  public setValue(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }): void {
    super.setValue(value, options);

    if (this.makeRestoration) {
      this.makeRestoration = false;

      return;
    }
  }

  public patchValue(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }): void {
    super.patchValue(value, options);
  }

  public cancel(): void {
  }

  public empty(): void {
  }

  public restore(): void {
    this.makeRestoration = true;
    const formContextCommon: FormContextCommon<V> = Reflect.getMetadata(FORM_CONTROL_INSTANCE_METADATA_KEY, this);
    this.setValue(formContextCommon.defaultValue !== undefined ? formContextCommon.defaultValue : null);
  }
}
