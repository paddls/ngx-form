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

  @FormArray({type: () => CompanyForm, defaultValues: [new CompanyForm()]})
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
  });

  it('should set value on method call', () => {
    form.controls.skills.setValue(['Angular, TypeScript']);
    expect(form.getValue().skills).toEqual(['Angular, TypeScript']);
  });

  it('should patch value on method call', () => {
    form.controls.skills.patchValue(['Angular, TypeScript']);
    expect(form.getValue().skills).toEqual(['Angular, TypeScript']);
  });

  it('should add value on method call', () => {
    (form.controls.skills as NgxFormArray<string>).add('C#');
    expect(form.getValue().skills).toEqual(['Java', 'C++', 'C#']);
  });

  it('should insert value on add method call with index', () => {
    (form.controls.skills as NgxFormArray<string>).add('C#', 0);
    expect(form.getValue().skills).toEqual(['C#', 'Java', 'C++']);
  });

  it('should add form value on method call', () => {
    const companyForm: CompanyForm = new CompanyForm({
      name: 'Witty Services',
      siret: '00000000000000'
    });
    (form.controls.companies as NgxFormArray<CompanyForm>).add(new CompanyForm());
    expect(form.getValue().companies).toEqual([companyForm, companyForm]);
  });

  it('should restore value on method call', () => {
    form.controls.skills.setValue(['Angular, TypeScript']);
    form.restore();
    expect(form.getValue().skills).toEqual(['Java', 'C++']);
  });

  it('should empty value on method call', () => {
    form.controls.skills.setValue(['Angular, TypeScript']);
    form.empty();
    expect(form.getValue().skills).toEqual([]);
  });

  it('should mark all as dirty', () => {
    const companies: NgxFormArray<CompanyForm> = form.controls.companies as NgxFormArray<CompanyForm>;
    expect(companies.dirty).toBeFalse();
    expect(companies.controls[0].dirty).toBeFalse();
    expect(companies.controls[0].get('name').dirty).toBeFalse();
    form.markAllAsDirty();
    expect(companies.dirty).toBeTrue();
    expect(companies.controls[0].dirty).toBeTrue();
    expect(companies.controls[0].get('name').dirty).toBeTrue();
  });

  it('should mark all as untouched', () => {
    const companies: NgxFormArray<CompanyForm> = form.controls.companies as NgxFormArray<CompanyForm>;
    companies.controls[0].get('name').markAsTouched();
    expect(companies.untouched).toBeFalse();
    expect(companies.controls[0].untouched).toBeFalse();
    expect(companies.controls[0].get('name').untouched).toBeFalse();
    form.markAllAsUntouched();
    expect(companies.untouched).toBeTrue();
    expect(companies.controls[0].untouched).toBeTrue();
    expect(companies.controls[0].get('name').untouched).toBeTrue();
  });

  it('should mark all as pending', () => {
    const companies: NgxFormArray<CompanyForm> = form.controls.companies as NgxFormArray<CompanyForm>;
    expect(companies.pending).toBeFalse();
    expect(companies.controls[0].pending).toBeFalse();
    expect(companies.controls[0].get('name').pending).toBeFalse();
    form.markAllAsPending();
    expect(companies.pending).toBeTrue();
    expect(companies.controls[0].pending).toBeTrue();
    expect(companies.controls[0].get('name').pending).toBeTrue();
  });

  it('should mark all as pristine', () => {
    const companies: NgxFormArray<CompanyForm> = form.controls.companies as NgxFormArray<CompanyForm>;
    companies.controls[0].get('name').markAsDirty();
    expect(companies.pristine).toBeFalse();
    expect(companies.controls[0].pristine).toBeFalse();
    expect(companies.controls[0].get('name').pristine).toBeFalse();
    form.markAllAsPristine();
    expect(companies.pristine).toBeTrue();
    expect(companies.controls[0].pristine).toBeTrue();
    expect(companies.controls[0].get('name').pristine).toBeTrue();
  });

  it('should set the value with the latest setValue call', () => {
    const initialValue: CompanyForm[] = [new CompanyForm({
      name: 'Thomas SA',
      siret: 'mon siret'
    })];
    form.get('companies').setValue(initialValue);

    form.get('companies').patchValue([new CompanyForm({
      name: 'Oscarrr SA',
      siret: 'mon siret'
    })]);

    (form.get('companies') as NgxFormArray<CompanyForm>).cancel();
    expect((form.get('companies') as NgxFormArray<CompanyForm>).getValue()).toEqual(initialValue);
  });
});
