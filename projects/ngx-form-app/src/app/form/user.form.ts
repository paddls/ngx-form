import { FormArray, FormControl, FormGroup, OnValueChanges, UpdateOn, Validator } from '@paddls/ngx-form';
import { CompanyForm } from './company.form';
import { AddressForm } from './address.form';
import { Validators } from '@angular/forms';
import { FriendModel } from '../model/friend.model';

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

  @FormControl({defaultValue: ['Java', 'C++']})
  public skills: string[];

  @FormArray(() => CompanyForm)
  public companiesFormArray: CompanyForm[];

  @FormGroup({type: () => AddressForm, defaultValue: new AddressForm({...defaultAddress})})
  @UpdateOn('submit')
  public personalAddressFormGroup: AddressForm;

  @FormControl()
  public friend: FriendModel;

  public constructor(data: Partial<UserForm> = {}) {
    Object.assign(this, data);
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @OnValueChanges('firstName')
  public test(firstName: string): void {
    console.log('Test', firstName);
  }
}
