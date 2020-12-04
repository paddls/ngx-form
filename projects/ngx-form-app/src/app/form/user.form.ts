import {FormControl, FormGroup} from '@witty-services/ngx-form';
import {CompanyForm} from './company.form';

export class UserForm {

  @FormControl({value: 'Thomas'})
  public firstName: string;

  @FormControl({value: 'Nisole'})
  public lastName: string;

  @FormGroup({
    type: () => CompanyForm
  })
  public company: CompanyForm;
}
