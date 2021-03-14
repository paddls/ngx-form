import {clone} from 'lodash';
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
  })

  it('should get smart value', () => {
    expect(form.getValue()).toBeInstanceOf(UserForm);
  })

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
  })
})
