import { FormArray, FormControl, FormGroup, UpdateOn, Validator } from '@paddls/ngx-form';
import { CompanyForm } from './company.form';
import { AddressForm } from './address.form';
import { Validators } from '@angular/forms';

const defaultAddress: AddressForm = new AddressForm({
  route: 'User route',
  city: 'User city',
  zipCode: 'User zipCode'
});

@UpdateOn('change')
export class UserForm {

  @FormControl({defaultValue: 'Thomas'})
  @Validator(Validators.required)
  @UpdateOn('blur')
  public firstName: string;

  @FormControl('lastname')
  public lastName: string;

  @Validator([Validators.required, Validators.min(0)])
  public age: number;

  @FormArray({defaultValue: 'Default skill', defaultValues: ['Java', 'C++']})
  public skills: string[];

  @FormArray(() => CompanyForm)
  public companies: CompanyForm[];

  @FormGroup({type: () => AddressForm, defaultValue: new AddressForm({...defaultAddress})})
  @UpdateOn('submit')
  public personalAddress: AddressForm;

  public constructor(data: Partial<UserForm> = {}) {
    Object.assign(this, data);
  }
}
