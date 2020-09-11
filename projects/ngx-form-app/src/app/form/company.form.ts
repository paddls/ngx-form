import {FormControl} from '@witty-services/ngx-form';

export class CompanyForm {

  @FormControl({value: 'Nisole & fils'})
  public name: string;

  @FormControl({value: '123456789'})
  public siret: string;
}
