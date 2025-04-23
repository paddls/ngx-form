import { FormControl } from '../decorator/form-control.decorator';
import { FormGroup, FormGroupContext } from '../decorator/form-group.decorator';
import { NgxFormBuilder } from '../core/ngx-form.builder';
import { NgxFormGroup } from './ngx-form-group.model';
import { FormArray } from '../decorator/form-array.decorator';
import { TestBed } from '@angular/core/testing';
import { provideNgxForm } from '../ngx-form.module';
import {CompanyForm} from 'projects/ngx-form-app/src/app/form/company.form';

class AddressForm {

  @FormControl({defaultValue: 0})
  public streetNumber: number;

  @FormControl({defaultValue: 'Default route'})
  public route: string;

  public constructor(data: Partial<AddressForm> = {}) {
    Object.assign(this, data);
  }
}

const defaultAddress: AddressForm = new AddressForm({
  streetNumber: 7,
  route: 'User route'
})

class UserForm {

  @FormGroup({type: () => AddressForm, defaultValue: defaultAddress})
  public addressFormGroup: AddressForm;

  @FormControl({defaultValue: ['Java', 'C++']})
  public skills: string[];

  @FormArray(() => CompanyForm)
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

describe('NgxFormGroup', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgxForm(),
      ]
    })

    builder = TestBed.inject(NgxFormBuilder);
    form = builder.build(formGroupContextConfiguration);
  });

  it('should get smart value', () => {
    expect(form.getValue()).toBeInstanceOf(UserForm);
  });

  it('should set value on method call', () => {
    form.setValue(new UserForm({
      addressFormGroup: new AddressForm({
        route: 'Hey',
        streetNumber: 8
      }),
      skills: ['Java'],
      companiesFormArray: []
    }));
    expect(form.getValue().addressFormGroup.streetNumber).toEqual(8);
    expect(form.getValue().skills).toEqual(['Java']);
  });

  it('should restore value on method call', () => {
    form.setValue(new UserForm({
      addressFormGroup: new AddressForm({
        route: 'Hey',
        streetNumber: 8
      }),
      skills: [],
      companiesFormArray: []
    }));
    form.restore();
    expect(form.getValue().addressFormGroup.streetNumber).toEqual(7);
    form.setValue(new UserForm({
      addressFormGroup: new AddressForm({
        route: 'Hey',
        streetNumber: 8
      }),
      skills: [],
      companiesFormArray: []
    }));
    expect(form.getValue().addressFormGroup.streetNumber).toEqual(8);
  });

  it('should reset value on method call', () => {
    form.empty();
    expect(form.getValue().addressFormGroup.streetNumber).toEqual(null);
  });

  it('should patch value on method call', () => {
    form.patchValue(new UserForm({
      addressFormGroup: new AddressForm({
        route: 'Hey',
        streetNumber: 8
      })
    }));
    expect(form.getValue().addressFormGroup.streetNumber).toEqual(8);
  });

  it('should mark all as dirty', () => {
    const address: NgxFormGroup<AddressForm> = form.controls.addressFormGroup;
    expect(address.dirty).toBeFalse();
    expect(address.get('route').dirty).toBeFalse();
    form.markAllAsDirty();
    expect(address.dirty).toBeTrue();
    expect(address.get('route').dirty).toBeTrue();
  });

  it('should mark all as untouched', () => {
    const address: NgxFormGroup<AddressForm> = form.controls.addressFormGroup ;
    address.get('route').markAsTouched();
    expect(address.untouched).toBeFalse();
    expect(address.get('route').untouched).toBeFalse();
    form.markAllAsUntouched();
    expect(address.untouched).toBeTrue();
    expect(address.get('route').untouched).toBeTrue();
  });

  it('should mark all as pending', () => {
    const address: NgxFormGroup<AddressForm> = form.controls.addressFormGroup;
    expect(address.pending).toBeFalse();
    expect(address.get('route').pending).toBeFalse();
    form.markAllAsPending();
    expect(address.pending).toBeTrue();
    expect(address.get('route').pending).toBeTrue();
  });

  it('should mark all as pristine', () => {
    const address: NgxFormGroup<AddressForm> = form.controls.addressFormGroup;
    address.get('route').markAsDirty();
    expect(address.pristine).toBeFalse();
    expect(address.get('route').pristine).toBeFalse();
    form.markAllAsPristine();
    expect(address.pristine).toBeTrue();
    expect(address.get('route').pristine).toBeTrue();
  });

  it('should set the value with the latest setValue call', () => {
    const initialValue: UserForm = new UserForm({
      addressFormGroup: new AddressForm({
        route: 'route',
        streetNumber: 1
      }),
      skills: ['Typescript'],
      companiesFormArray: []
    });
    form.setValue(initialValue);

    form.patchValue(new UserForm({
      addressFormGroup: new AddressForm({
        route: 'routeeee'
      }),
      skills: ['C++']
    }));

    form.cancel();
    expect(form.getValue()).toEqual(initialValue);
  });
})
