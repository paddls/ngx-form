import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn} from '@angular/forms';
import {transformSmartValueToValue, transformValueToSmartValue} from '../common';
import {NgxForm} from './ngx-form';
import {values} from 'lodash';
import {FormGroupContext} from '../decorator/form-group.decorator';

export const FORM_GROUP_INSTANCE_METADATA_KEY: string = 'ngx-form:form-group-instance';

export class NgxFormGroup<V> extends FormGroup implements NgxForm {

  private makeRestoration: boolean = false;

  public readonly value: any;

  public constructor(controls: { [key: string]: AbstractControl; },
                     validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                     asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  public getValue(parent: string = ''): V {
    if (parent !== '') {
      parent += parent + '.';
    }

    return transformValueToSmartValue(this, parent);
  }

  public setValue(value: V, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.setValue(transformSmartValueToValue(value), options);

    if (this.makeRestoration) {
      this.makeRestoration = false;

      return;
    }
  }

  public patchValue(value: Partial<V>, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.patchValue(transformSmartValueToValue(value), options);
  }

  public cancel(): void {
  }

  public empty(): void {
    this.reset();

    (values(this.controls) as any).forEach((control: NgxForm) => control.empty());
  }

  public restore(): void {
    (values(this.controls) as any).forEach((control: NgxForm) => control.restore());
    const groupContext: FormGroupContext<V> = Reflect.getMetadata(FORM_GROUP_INSTANCE_METADATA_KEY, this);

    if (groupContext.defaultValue !== undefined) {
      this.makeRestoration = true;
      this.patchValue(groupContext.defaultValue);
    }
  }
}
