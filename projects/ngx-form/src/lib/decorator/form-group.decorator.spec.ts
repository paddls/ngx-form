import {FormControl} from './form-control.decorator';
import {PROPERTY_CONFIGURATIONS_METADATA_KEY} from './decorator.common';
import {FORM_GROUP_SUFFIX_METADATA_KEY, FormGroup, FormGroupContext} from './form-group.decorator';
import {clone} from 'lodash-es';

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
  route: 'User route',
  streetNumber: 1
});

class UserForm {

  @FormGroup(() => AddressForm)
  public homeAddress: AddressForm;

  @FormGroup({type: () => AddressForm, defaultValue: clone(defaultAddress)})
  public workAddress: AddressForm;
}

describe('FormGroupDecorator', () => {

  const form: UserForm = new UserForm();

  it('should add form group metadata on form class', () => {
    const formMetadata: {[key: string]: FormGroupContext<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_GROUP_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata).toBeDefined();
  })

  it('should add form group type metadata for each form group annotation', () => {
    const formMetadata: {[key: string]: FormGroupContext<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_GROUP_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata.homeAddress.type().name).toEqual(AddressForm.name);
    expect(formMetadata.workAddress.type().name).toEqual(AddressForm.name);
  })

  it('should add form group default value metadata when defined', () => {
    const formMetadata: {[key: string]: FormGroupContext<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_GROUP_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata.homeAddress.defaultValue).toBeUndefined();
    expect(formMetadata.workAddress.defaultValue).toEqual(clone(defaultAddress));
  })
})
