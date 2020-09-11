import {AbstractControl, AsyncValidatorFn, ValidatorFn} from '@angular/forms';

export abstract class NgxForm extends AbstractControl {

  protected constructor(validator: ValidatorFn | null, asyncValidator: AsyncValidatorFn | null) {
    super(validator, asyncValidator);
  }
}
