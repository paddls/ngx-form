import {FormArray, FormControl, FormGroup, UpdateOn} from '@witty-services/ngx-form';
import {CompanyForm} from './company.form';
import {AddressForm} from './address.form';
import {clone} from 'lodash';

const defaultAddress: AddressForm = new AddressForm({
  route: 'User route',
  city: 'User city',
  zipCode: 'User zipCode'
})

@UpdateOn('change')
export class UserForm {

  @FormControl({defaultValue: 'Thomas'})
  @UpdateOn('blur')
  public firstName: string;

  @FormControl('lastname')
  public lastName: string;

  @FormArray({defaultValue: 'Default skill', defaultValues: ['Java', 'C++']})
  public skills: string[];

  @FormArray(() => CompanyForm)
  public companies: CompanyForm[];

  @FormGroup({type: () => AddressForm, defaultValue: clone(defaultAddress)})
  @UpdateOn('submit')
  public personalAddress: AddressForm;

  public constructor(data: Partial<UserForm> = {}) {
    Object.assign(this, data);
  }
}
