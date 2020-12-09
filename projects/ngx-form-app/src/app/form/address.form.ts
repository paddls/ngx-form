import {FormControl, UpdateOn} from '@witty-services/ngx-form';

@UpdateOn('blur')
export class AddressForm {

  @FormControl()
  public streetNumber: number;

  @FormControl()
  public route: string;

  @FormControl()
  public zipCode: string;

  @FormControl()
  public city: string;
}
