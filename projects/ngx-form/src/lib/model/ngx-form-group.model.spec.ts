import {clone} from 'lodash-es';
import {FormControl} from '../decorator/form-control.decorator';
import {FormGroup, FormGroupContext} from '../decorator/form-group.decorator';
import {NgxFormBuilder} from '../ngx-form.builder';
import {NgxFormGroup} from './ngx-form-group.model';
import {FormArray} from '../decorator/form-array.decorator';

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

  @FormGroup({type: () => AddressForm, defaultValue: clone(defaultAddress)})
  public address: AddressForm;

  @FormArray({defaultValue: 'Default skill'})
  public skills: string[];

  public constructor(data: Partial<UserForm> = {}) {
    Object.assign(this, data);
  }
}

describe('NgxFormGroup', () => {

  const formGroupContextConfiguration: FormGroupContext<UserForm> = {
    type: () => UserForm
  };

  const builder: NgxFormBuilder = new NgxFormBuilder();
  let form: NgxFormGroup<UserForm>;

  beforeEach(() => {
    form = builder.build(formGroupContextConfiguration);
  });

  it('should get smart value', () => {
    expect(form.getValue()).toBeInstanceOf(UserForm);
  });

  it('should set value on method call', () => {
    form.setValue(new UserForm({
      address: new AddressForm({
        route: 'Hey',
        streetNumber: 8
      }),
      skills: ['Java']
    }));
    expect(form.getValue().address.streetNumber).toEqual(8);
  });

  it('should restore value on method call', () => {
    form.setValue(new UserForm({
      address: new AddressForm({
        route: 'Hey',
        streetNumber: 8
      }),
      skills: []
    }));
    form.restore();
    expect(form.getValue().address.streetNumber).toEqual(7);
    form.setValue(new UserForm({
      address: new AddressForm({
        route: 'Hey',
        streetNumber: 8
      }),
      skills: []
    }));
    expect(form.getValue().address.streetNumber).toEqual(8);
  });

  it('should reset value on method call', () => {
    form.empty();
    expect(form.getValue().address.streetNumber).toEqual(null);
  });

  it('should patch value on method call', () => {
    form.patchValue(new UserForm({
      address: new AddressForm({
        route: 'Hey',
        streetNumber: 8
      })
    }));
    expect(form.getValue().address.streetNumber).toEqual(8);
  });

  it('should mark all as dirty', () => {
    const address: NgxFormGroup<AddressForm> = form.controls.address as NgxFormGroup<AddressForm>;
    expect(address.dirty).toBeFalse();
    expect(address.get('route').dirty).toBeFalse();
    form.markAllAsDirty();
    expect(address.dirty).toBeTrue();
    expect(address.get('route').dirty).toBeTrue();
  });

  it('should mark all as untouched', () => {
    const address: NgxFormGroup<AddressForm> = form.controls.address as NgxFormGroup<AddressForm>;
    address.get('route').markAsTouched();
    expect(address.untouched).toBeFalse();
    expect(address.get('route').untouched).toBeFalse();
    form.markAllAsUntouched();
    expect(address.untouched).toBeTrue();
    expect(address.get('route').untouched).toBeTrue();
  });

  it('should mark all as pending', () => {
    const address: NgxFormGroup<AddressForm> = form.controls.address as NgxFormGroup<AddressForm>;
    expect(address.pending).toBeFalse();
    expect(address.get('route').pending).toBeFalse();
    form.markAllAsPending();
    expect(address.pending).toBeTrue();
    expect(address.get('route').pending).toBeTrue();
  });

  it('should mark all as pristine', () => {
    const address: NgxFormGroup<AddressForm> = form.controls.address as NgxFormGroup<AddressForm>;
    address.get('route').markAsDirty();
    expect(address.pristine).toBeFalse();
    expect(address.get('route').pristine).toBeFalse();
    form.markAllAsPristine();
    expect(address.pristine).toBeTrue();
    expect(address.get('route').pristine).toBeTrue();
  });

  it('should set the value with the latest setValue call', () => {
    const initialValue: UserForm = new UserForm({
      address: new AddressForm({
        route: 'route',
        streetNumber: 1
      }),
      skills: ['Typescript']
    });
    form.setValue(initialValue);

    form.patchValue(new UserForm({
      address: new AddressForm({
        route: 'routeeee'
      }),
      skills: ['C++']
    }));

    form.cancel();
    expect(form.getValue()).toEqual(initialValue);
  });
})
