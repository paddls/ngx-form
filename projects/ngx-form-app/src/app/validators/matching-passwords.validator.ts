import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export function matchingPasswords(passwordKey: string, confirmedKey: string): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } => {
    const password: AbstractControl = group.controls[passwordKey];
    const confirmed: AbstractControl = group.controls[confirmedKey];

    if (password.value !== confirmed.value) {
      return {
        mismatchedPasswords: true
      };
    }
  };
}
