import { FormControl, UpdateOn, Validator } from '@paddls/ngx-form';
import { Validators } from '@angular/forms';

@UpdateOn('blur')
export class AddressForm {

  @FormControl({defaultValue: 0})
  public streetNumber: number;

  @Validator(Validators.required)
  @FormControl({defaultValue: 'Default route'})
  public route: string;

  @FormControl({defaultValue: 'Default zipCode'})
  public zipCode: string;

  @FormControl({defaultValue: 'Default city'})
  public city: string;

  public constructor(data: Partial<AddressForm> = {}) {
    Object.assign(this, data);
  }
}
