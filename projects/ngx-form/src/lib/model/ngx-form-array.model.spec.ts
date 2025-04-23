import { FormControl } from '../decorator/form-control.decorator';
import { FormGroupContext } from '../decorator/form-group.decorator';
import { FormArray } from '../decorator/form-array.decorator';
import { NgxFormBuilder } from '../core/ngx-form.builder';
import { NgxFormGroup } from './ngx-form-group.model';
import { NgxFormArray } from './ngx-form-array.model';
import { TestBed } from '@angular/core/testing';
import { provideNgxForm } from '../ngx-form.module';

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
  public skillsFormArray: string[];

  @FormArray({type: () => CompanyForm, defaultValues: [new CompanyForm()]})
  public companiesFormArray: CompanyForm[];

  public constructor(data: Partial<UserForm> = {}) {
    Object.assign(this, data);
  }
}

const formGroupContextConfiguration: FormGroupContext<UserForm> = {
  type: () => UserForm
};

let builder: NgxFormBuilder;
let form: NgxFormGroup<UserForm>;

describe('NgxFormArray', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgxForm(),
      ]
    })

    builder = TestBed.inject(NgxFormBuilder);
    form = builder.build(formGroupContextConfiguration);
  });

  it('should set value on method call', () => {
    form.controls.skillsFormArray.setValue(['Angular, TypeScript']);
    expect(form.getValue().skillsFormArray).toEqual(['Angular, TypeScript']);
  });

  it('should patch value on method call', () => {
    form.controls.skillsFormArray.patchValue(['Java', 'Angular', 'TypeScript']);
    expect(form.getValue().skillsFormArray).toEqual(['Java', 'Angular']);
  });

  it('should patch value on method call', () => {
    form.controls.skillsFormArray.patchValue(['Angular']);
    expect(form.getValue().skillsFormArray).toEqual(['Angular', 'C++']);
  });

  it('should add value on method call', () => {
    form.controls.skillsFormArray.add('C#');
    expect(form.getValue().skillsFormArray).toEqual(['Java', 'C++', 'C#']);
  });

  it('should insert value on add method call with index', () => {
    form.controls.skillsFormArray.add('C#', 0);
    expect(form.getValue().skillsFormArray).toEqual(['C#', 'Java', 'C++']);
  });

  it('should add form value on method call', () => {
    const companyFormDefault: CompanyForm = new CompanyForm({
      name: 'Witty Services',
      siret: '00000000000000'
    });

    const addedCompanyForm: CompanyForm = new CompanyForm({
      name: 'Witty',
      siret: '11111111111111'
    });

    form.controls.companiesFormArray.add(addedCompanyForm);
    expect(form.getValue().companiesFormArray).toEqual([companyFormDefault, addedCompanyForm]);
  });

  it('should restore value on method call', () => {
    form.controls.skillsFormArray.setValue(['Angular, TypeScript']);
    form.restore();
    expect(form.getValue().skillsFormArray).toEqual(['Java', 'C++']);
  });

  it('should empty value on method call', () => {
    form.controls.skillsFormArray.setValue(['Angular, TypeScript']);
    form.empty();
    expect(form.getValue().skillsFormArray).toEqual([]);
  });

  it('should mark all as dirty', () => {
    const companies: NgxFormArray<CompanyForm> = form.controls.companiesFormArray;
    expect(companies.dirty).toBeFalse();
    expect(companies.controls[0].dirty).toBeFalse();
    expect(companies.controls[0].get('name').dirty).toBeFalse();
    form.markAllAsDirty();
    expect(companies.dirty).toBeTrue();
    expect(companies.controls[0].dirty).toBeTrue();
    expect(companies.controls[0].get('name').dirty).toBeTrue();
  });

  it('should mark all as untouched', () => {
    const companies: NgxFormArray<CompanyForm> = form.controls.companiesFormArray;
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
    const companies: NgxFormArray<CompanyForm> = form.controls.companiesFormArray;
    expect(companies.pending).toBeFalse();
    expect(companies.controls[0].pending).toBeFalse();
    expect(companies.controls[0].get('name').pending).toBeFalse();
    form.markAllAsPending();
    expect(companies.pending).toBeTrue();
    expect(companies.controls[0].pending).toBeTrue();
    expect(companies.controls[0].get('name').pending).toBeTrue();
  });

  it('should mark all as pristine', () => {
    const companies: NgxFormArray<CompanyForm> = form.controls.companiesFormArray;
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
    form.controls.companiesFormArray.setValue(initialValue);

    form.controls.companiesFormArray.patchValue([new CompanyForm({
      name: 'Oscarrr SA',
      siret: 'mon siret'
    })]);

    form.controls.companiesFormArray.cancel();
    expect(form.controls.companiesFormArray.getValue()).toEqual(initialValue);
  });
});
