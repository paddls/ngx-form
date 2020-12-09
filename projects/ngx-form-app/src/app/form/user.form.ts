import {FormControl, FormGroup, UpdateOn, FormArray} from '@witty-services/ngx-form';
import {CompanyForm} from './company.form';
import {AddressForm} from './address.form';

@UpdateOn('change')
export class UserForm {

  @FormControl()
  @UpdateOn('blur')
  public firstName: string;

  @FormControl('lastname')
  public lastName: string;

  @FormArray(() => CompanyForm)
  public companies: CompanyForm[];

  @FormGroup(() => AddressForm)
  @UpdateOn('submit')
  public personalAddress: AddressForm;
}
