import { FormControl } from '@witty-services/ngx-form';

export class PhoneForm {

  @FormControl()
  public label: string;

  @FormControl()
  public phoneNumber: string;
}
