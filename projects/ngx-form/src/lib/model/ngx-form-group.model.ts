import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { NgxForm } from './interface/ngx-form';
import { FormGroupContext } from '../decorator/form-group.decorator';
import { NgxFormCollection } from './interface/ngx-form-collection';
import { NgxFormControl } from './ngx-form-control.model';
import { transformSmartValueToValue, transformValueToSmartValue } from '../common/common';
import { DataFormType, DataToFormType } from '../common/typing';

export const FORM_GROUP_INSTANCE_METADATA_KEY: string = 'ngx-form:form-group-instance';

export class NgxFormGroup<V> extends FormGroup<DataToFormType<V>> implements NgxFormCollection {

  private lastValueSet: Partial<V>;
  private makeRestoration: boolean = false;

  public constructor(controls: DataToFormType<V>,
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

  public setValue(value: DataFormType<V>, options?: {onlySelf?: boolean; emitEvent?: boolean}): void {
    super.setValue(transformSmartValueToValue(value), options);

    if (this.makeRestoration) {
      this.makeRestoration = false;
    }
    this.lastValueSet = value;
  }

  public patchValue(value: DataFormType<V>, options?: {onlySelf?: boolean; emitEvent?: boolean}): void {
    super.patchValue(transformSmartValueToValue(value), options);
  }

  public cancel(): void {
    this.setValue(this.lastValueSet);
  }

  public empty(): void {
    this.reset();

    (Object.values(this.controls) as any).forEach((control: NgxForm) => control.empty());
  }

  public restore(): void {
    (Object.values(this.controls) as any).forEach((control: NgxForm) => control.restore());
    const groupContext: FormGroupContext<V> = Reflect.getMetadata(FORM_GROUP_INSTANCE_METADATA_KEY, this);

    if (groupContext.defaultValue !== undefined) {
      this.makeRestoration = true;
      this.patchValue(groupContext.defaultValue);
    }
  }

  public markAllAsDirty(): void {
    this.markAsDirty({onlySelf: true});

    Object.values(this.controls)
      .filter((value: AbstractControl) => value instanceof NgxFormControl)
      .forEach((control: NgxFormControl<any>) => control.markAsDirty());

    Object.values(this.controls)
      .filter((value: AbstractControl) => !(value instanceof NgxFormControl))
      .forEach((control: any) => control.markAllAsDirty());
  }

  public markAllAsPending(): void {
    this.markAsPending({onlySelf: true});

    Object.values(this.controls)
      .filter((value: AbstractControl) => value instanceof NgxFormControl)
      .forEach((control: NgxFormControl<any>) => control.markAsPending());

    Object.values(this.controls)
      .filter((value: AbstractControl) => !(value instanceof NgxFormControl))
      .forEach((control: any) => control.markAllAsPending());
  }

  public markAllAsPristine(): void {
    this.markAsPristine({onlySelf: true});

    Object.values(this.controls)
      .filter((value: AbstractControl) => value instanceof NgxFormControl)
      .forEach((control: NgxFormControl<any>) => control.markAsPristine());

    Object.values(this.controls)
      .filter((value: AbstractControl) => !(value instanceof NgxFormControl))
      .forEach((control: any) => control.markAllAsPristine());
  }

  public markAllAsUntouched(): void {
    this.markAsUntouched({onlySelf: true});

    Object.values(this.controls)
      .filter((value: AbstractControl) => value instanceof NgxFormControl)
      .forEach((control: NgxFormControl<any>) => control.markAsUntouched());

    Object.values(this.controls)
      .filter((value: AbstractControl) => !(value instanceof NgxFormControl))
      .forEach((control: any) => control.markAllAsUntouched());
  }
}
