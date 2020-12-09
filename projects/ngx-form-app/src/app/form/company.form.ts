import {FormControl, FormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './address.form';

export class CompanyForm {

  @FormControl()
  public name: string;

  @FormControl()
  public siret: string;

  @FormGroup(() => AddressForm)
  public address: AddressForm;
}
