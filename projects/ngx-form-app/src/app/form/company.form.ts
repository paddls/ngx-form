import {FormControl, FormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './address.form';

export class CompanyForm {

  @FormControl()
  public name: string;

  @FormControl()
  public siret: string;

  @FormGroup(() => AddressForm)
  public address: AddressForm;

  public constructor(data: Partial<CompanyForm> = {}) {
    Object.assign(this, data);
  }
}
