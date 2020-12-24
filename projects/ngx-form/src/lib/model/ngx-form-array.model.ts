import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn} from '@angular/forms';
import {NgxFormBuilder} from '../ngx-form.builder';
import {FORM_ARRAY_INSTANCE_METADATA_KEY, FormArrayContext} from '../decorator/form-array.decorator';
import {UPDATE_ON_METADATA_KEY} from '../decorator/update-on.decorator';

export class NgxFormArray extends FormArray {

  public constructor(private readonly builder: NgxFormBuilder,
                     controls: AbstractControl[],
                     validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                     asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  public add(index: number = -1): AbstractControl {
    const formArrayContext: FormArrayContext<any> = Reflect.getMetadata(FORM_ARRAY_INSTANCE_METADATA_KEY, this);
    let form: AbstractControl;
    if (!formArrayContext.type) {
      form = this.builder.control(
        formArrayContext.value || null,
        {
          validators: [],
          asyncValidators: [],
          updateOn: formArrayContext.updateOn
        }
      );
    } else {
      form = this.builder.build(
        {type: formArrayContext.type, value: formArrayContext.value},
        formArrayContext.updateOn || Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}`, formArrayContext.type())
      )
    }

    console.log(form);
    if (index === -1) {
      this.push(form);
    } else {
      this.insert(index, form);
    }

    return form;
  }
}
