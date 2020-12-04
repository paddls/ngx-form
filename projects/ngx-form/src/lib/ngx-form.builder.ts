import {Injectable} from '@angular/core';
import {AbstractControlOptions, AsyncValidatorFn, FormBuilder, FormGroup, ValidatorFn} from '@angular/forms';
import {NgxFormGroup} from './model/ngx-form-group.model';
import {NgxFormControl} from './model/ngx-form-control.model';
import {NgxFormArray} from './model/ngx-form-array.model';

function isAbstractControlOptions(options: AbstractControlOptions| {[key: string]: any}): options is AbstractControlOptions {
  return (options as AbstractControlOptions).asyncValidators !== undefined ||
    (options as AbstractControlOptions).validators !== undefined ||
    (options as AbstractControlOptions).updateOn !== undefined;
}

export type FormHooks = 'change'|'blur'|'submit';

@Injectable()
export class NgxFormBuilder extends FormBuilder {

  public group<V>(controlsConfig: { [key: string]: any; }, options?: AbstractControlOptions | { [key: string]: any; } | null): NgxFormGroup<V> {
    const fg: FormGroup = super.group(controlsConfig, options);

    let validators: ValidatorFn|ValidatorFn[]|null = null;
    let asyncValidators: AsyncValidatorFn|AsyncValidatorFn[]|null = null;
    let updateOn: FormHooks|undefined;

    if (options != null) {
      if (isAbstractControlOptions(options)) {
        validators = options.validators != null ? options.validators : null;
        asyncValidators = options.asyncValidators != null ? options.asyncValidators : null;
        updateOn = options.updateOn != null ? options.updateOn : undefined;
      } else {
        validators = options[`validator`] != null ? options[`validator`] : null;
        asyncValidators = options[`asyncValidator`] != null ? options[`asyncValidator`] : null;
      }
    }

    return new NgxFormGroup(fg.controls, {asyncValidators, updateOn, validators});
  }

  public control(formState: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): NgxFormControl {
    return new NgxFormControl(formState, validatorOrOpts, asyncValidator);
  }

  public array(controlsConfig: any[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): NgxFormArray {
    return new NgxFormArray(controlsConfig, validatorOrOpts, asyncValidator);
  }
}
