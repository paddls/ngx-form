import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn} from '@angular/forms';
import {NgxFormBuilder} from '../core/ngx-form.builder';
import {FormArrayContext} from '../decorator/form-array.decorator';
import {UPDATE_ON_METADATA_KEY} from '../decorator/update-on.decorator';
import {NgxFormCollection} from './interface/ngx-form-collection';
import {NgxFormControl} from './ngx-form-control.model';
import {transformValueToSmartValue} from '../common/common';
import {NgxFormGroup} from './ngx-form-group.model';

export const FORM_ARRAY_INSTANCE_METADATA_KEY: string = 'ngx-form:form-array-instance';

export class NgxFormArray<V> extends FormArray implements NgxFormCollection {

  private lastValuesSet: V[];

  public constructor(private readonly builder: NgxFormBuilder,
                     controls: AbstractControl[],
                     validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                     asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  public getValue(parent: string = ''): V[] {
    if (parent !== '') {
      parent += parent + '.';
    }

    return this.controls.map((control: AbstractControl) => {
      if (control instanceof NgxFormGroup) {
        return transformValueToSmartValue(control, parent);
      } else {
        return control.value;
      }
    });
  }

  public add(value: V = null, index: number = -1): AbstractControl {
    const formArrayContext: FormArrayContext<any> = Reflect.getMetadata(FORM_ARRAY_INSTANCE_METADATA_KEY, this);
    let form: AbstractControl;
    if (!formArrayContext.type) {
      form = this.builder.control(
        value || formArrayContext.defaultValue,
        {
          validators: [],
          asyncValidators: [],
          updateOn: formArrayContext.updateOn
        }
      );
    } else {
      form = this.builder.build(
        {type: formArrayContext.type, defaultValue: value || formArrayContext.defaultValue},
        formArrayContext.updateOn || Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}`, formArrayContext.type())
      )
    }

    if (index === -1) {
      this.push(form);
    } else {
      this.insert(index, form);
    }

    return form;
  }

  public setValue(values: V[], options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    this.clear();
    values.forEach(() => this.add());
    super.setValue(values.map((value: V) => value), options);
    this.lastValuesSet = values;
  }

  public patchValue(values: V[], options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.patchValue(values.map((value: V) => value), options);
  }

  public cancel(): void {
    this.setValue(this.lastValuesSet);
  }

  public empty(): void {
    this.clear();
  }

  public restore(): void {
    this.clear();

    const formArrayContext: FormArrayContext<V> = Reflect.getMetadata(FORM_ARRAY_INSTANCE_METADATA_KEY, this);
    (formArrayContext.defaultValues || []).forEach((value: V) => this.add(value));
  }

  public markAllAsDirty(): void {
    this.markAsDirty({onlySelf: true});

    this.controls
      .filter((value: AbstractControl) => value instanceof NgxFormControl)
      .forEach((control: NgxFormControl<any>) => control.markAsDirty());

    this.controls
      .filter((value: AbstractControl) => !(value instanceof NgxFormControl))
      .forEach((control: any) => control.markAllAsDirty());
  }

  public markAllAsPending(): void {
    this.markAsPending({onlySelf: true});

    this.controls
      .filter((value: AbstractControl) => value instanceof NgxFormControl)
      .forEach((control: NgxFormControl<any>) => control.markAsPending());

    this.controls
      .filter((value: AbstractControl) => !(value instanceof NgxFormControl))
      .forEach((control: any) => control.markAllAsPending());
  }

  public markAllAsPristine(): void {
    this.markAsPristine({onlySelf: true});

    this.controls
      .filter((value: AbstractControl) => value instanceof NgxFormControl)
      .forEach((control: NgxFormControl<any>) => control.markAsPristine());

    this.controls
      .filter((value: AbstractControl) => !(value instanceof NgxFormControl))
      .forEach((control: any) => control.markAllAsPristine());
  }

  public markAllAsUntouched(): void {
    this.markAsUntouched({onlySelf: true});

    this.controls
      .filter((value: AbstractControl) => value instanceof NgxFormControl)
      .forEach((control: NgxFormControl<any>) => control.markAsUntouched());

    this.controls
      .filter((value: AbstractControl) => !(value instanceof NgxFormControl))
      .forEach((control: any) => control.markAllAsUntouched());
  }
}
