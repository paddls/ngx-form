import {FormControl} from '../decorator/form-control.decorator';
import {FormGroupContext} from '../decorator/form-group.decorator';
import {FormArray} from '../decorator/form-array.decorator';
import {NgxFormBuilder} from '../ngx-form.builder';
import {NgxFormGroup} from './ngx-form-group.model';
import {NgxFormArray} from './ngx-form-array.model';

class CompanyForm {

  @FormControl({defaultValue: 'Witty Services'})
  public name: string;

  @FormControl({defaultValue: '00000000000000'})
  public siret: string;

  public constructor(data: Partial<CompanyForm> = {}) {
    Object.assign(this, data);
  }
}

class UserForm {

  @FormArray({defaultValue: 'Default skill', defaultValues: ['Java', 'C++']})
  public skills: string[];

  @FormArray(() => CompanyForm)
  public companies: CompanyForm[];

  public constructor(data: Partial<UserForm> = {}) {
    Object.assign(this, data);
  }
}

describe('NgxFormArray', () => {

  const formGroupContextConfiguration: FormGroupContext<UserForm> = {
    type: () => UserForm
  };

  const builder: NgxFormBuilder = new NgxFormBuilder();
  let form: NgxFormGroup<UserForm>;

  beforeEach(() => {
    form = builder.build(formGroupContextConfiguration);
  })

  it('should set value on method call', () => {
    form.controls.skills.setValue(['Angular, TypeScript']);
    expect(form.getValue().skills).toEqual(['Angular, TypeScript']);
  })

  it('should patch value on method call', () => {
    form.controls.skills.patchValue(['Angular, TypeScript']);
    expect(form.getValue().skills).toEqual(['Angular, TypeScript']);
  })

  it('should add value on method call', () => {
    (form.controls.skills as NgxFormArray<string>).add('C#');
    expect(form.getValue().skills).toEqual(['Java', 'C++', 'C#']);
  })

  it('should insert value on add method call with index', () => {
    (form.controls.skills as NgxFormArray<string>).add('C#', 0);
    expect(form.getValue().skills).toEqual(['C#', 'Java', 'C++']);
  })

  it('should add form value on method call', () => {
    const companyForm: CompanyForm = new CompanyForm({
      name: 'Witty Services',
      siret: '00000000000000'
    });
    (form.controls.companies as NgxFormArray<CompanyForm>).add(new CompanyForm());
    expect(form.getValue().companies).toEqual([companyForm]);
  })

  it('should restore value on method call', () => {
    form.controls.skills.setValue(['Angular, TypeScript']);
    form.restore();
    expect(form.getValue().skills).toEqual(['Java', 'C++']);
  })

  it('should empty value on method call', () => {
    form.controls.skills.setValue(['Angular, TypeScript']);
    form.empty();
    expect(form.getValue().skills).toEqual([]);
  })
})
