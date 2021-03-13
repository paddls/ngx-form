import {FormControl} from './form-control.decorator';
import {PROPERTY_CONFIGURATIONS_METADATA_KEY} from './decorator.common';
import {FORM_ARRAY_SUFFIX_METADATA_KEY, FormArray, FormArrayContext} from './form-array.decorator';

class CompanyForm {

  @FormControl()
  public name: string;

  @FormControl()
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
}

describe('FormArrayDecorator', () => {

  const form: UserForm = new UserForm();

  it('should add form array metadata on form class', () => {
    const formMetadata: {[key: string]: FormArrayContext<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_ARRAY_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata).toBeDefined();
  })

  it('should add form array type metadata when defined', () => {
    const formMetadata: {[key: string]: FormArrayContext<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_ARRAY_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata.skills.type).toBeUndefined();
    expect(formMetadata.companies.type().name).toEqual(CompanyForm.name);
  })

  it('should add form array default value metadata when defined', () => {
    const formMetadata: {[key: string]: FormArrayContext<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_ARRAY_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata.skills.defaultValue).toEqual('Default skill');
    expect(formMetadata.companies.defaultValue).toBeUndefined();
  })

  it('should add form array default values metadata when defined', () => {
    const formMetadata: {[key: string]: FormArrayContext<any>} =
      Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${FORM_ARRAY_SUFFIX_METADATA_KEY}`, form);
    expect(formMetadata.skills.defaultValues).toEqual(['Java', 'C++']);
    expect(formMetadata.companies.defaultValues).toBeUndefined();
  })
})
