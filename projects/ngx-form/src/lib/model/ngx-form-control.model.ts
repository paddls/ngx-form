import {AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {NgxForm} from './interface/ngx-form';
import {FormContextCommon} from '../common/decorator.common';

export const FORM_CONTROL_INSTANCE_METADATA_KEY: string = 'ngx-form:form-control-instance';

export class NgxFormControl<V> extends FormControl<V> implements NgxForm {

  private lastValueSet: V;
  private makeRestoration: boolean = false;
  private makePatch: boolean = false;

  public constructor(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  public readonly value: V;

  public setValue(value: V, options?: {onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean}): void {
    super.setValue(value, options);

    if (this.makeRestoration) {
      this.makeRestoration = false;
    }

    if (!this.makePatch) {
      this.lastValueSet = value;
    }
  }

  public patchValue(value: V, options?: {onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean}): void {
    this.makePatch = true;
    super.patchValue(value, options);
    this.makePatch = false;
  }

  public cancel(): void {
    this.setValue(this.lastValueSet);
  }

  public empty(): void {
  }

  public restore(): void {
    this.makeRestoration = true;
    const formContextCommon: FormContextCommon<V> = Reflect.getMetadata(FORM_CONTROL_INSTANCE_METADATA_KEY, this);
    this.setValue(formContextCommon.defaultValue !== undefined ? formContextCommon.defaultValue : null);
  }
}
