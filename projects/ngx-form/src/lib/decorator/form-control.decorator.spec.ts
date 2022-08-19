import {FORM_CONTROL_SUFFIX_METADATA_KEY, FormControl} from './form-control.decorator';
import {FormContextCommon, PROPERTY_CONFIGURATIONS_METADATA_KEY} from '../common/decorator.common';

class UserForm {

  @FormControl('userName')
  public name: string;

  @FormControl({defaultValue: 'Oscar GUERIN'})
  public displayName: string;

  public notAFormControl: number;
}

describe('FormControlDecorator', () => {

  const form: UserForm = new UserForm();

  it('should add form controls metadata on form class', () => {
    const formMetadata: {[key: string]: FormContextCommon<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_CONTROL_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata).toBeDefined();
  })

  it('should add control name on metadata', () => {
    const formMetadata: {[key: string]: FormContextCommon<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_CONTROL_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata.name.name).toEqual('userName');
    expect(formMetadata.displayName.name).toEqual('displayName');
  })

  it('should add control default value on metadata when defined', () => {
    const formMetadata: {[key: string]: FormContextCommon<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_CONTROL_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata.name.defaultValue).toBeUndefined();
    expect(formMetadata.displayName.defaultValue).toEqual('Oscar GUERIN');
  })

  it('should not add metadata for fields without annotation', () => {
    const formMetadata: {[key: string]: FormContextCommon<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_CONTROL_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata.notAFormControl).toBeUndefined();
  })
})
