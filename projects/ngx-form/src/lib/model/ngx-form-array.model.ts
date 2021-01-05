import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn} from '@angular/forms';
import {NgxFormBuilder} from '../ngx-form.builder';
import {FormArrayContext} from '../decorator/form-array.decorator';
import {UPDATE_ON_METADATA_KEY} from '../decorator/update-on.decorator';
import {NgxForm} from './ngx-form';

export const FORM_ARRAY_INSTANCE_METADATA_KEY: string = 'ngx-form:form-array-instance';

export class NgxFormArray<V> extends FormArray implements NgxForm {

  public constructor(private readonly builder: NgxFormBuilder,
                     controls: AbstractControl[],
                     validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                     asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
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
        {type: formArrayContext.type, defaultValue: formArrayContext.defaultValue},
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
  }

  public patchValue(values: V[], options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    this.clear();
    values.forEach(() => this.add());
    super.setValue(values.map((value: V) => value), options);
  }

  public cancel(): void {
  }

  public empty(): void {
    this.clear();
  }

  public restore(): void {
    this.clear();

    const formArrayContext: FormArrayContext<V> = Reflect.getMetadata(FORM_ARRAY_INSTANCE_METADATA_KEY, this);
    (formArrayContext.defaultValues || []).forEach((value: V) => this.add(value));
  }
}
