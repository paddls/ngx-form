import { FormControl, Validator } from '@paddls/ngx-form';
import { Validators } from '@angular/forms';
import { matchingPasswords } from '../validators/matching-passwords.validator';

@Validator(matchingPasswords('password', 'confirmPassword'))
export class SignupForm {

  @FormControl()
  @Validator([Validators.required, Validators.email])
  public email: string;

  @FormControl()
  @Validator(Validators.required)
  public password: string;

  @FormControl()
  public confirmPassword: string;
}
