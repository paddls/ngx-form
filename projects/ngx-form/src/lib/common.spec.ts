import {FormControl} from './decorator/form-control.decorator';
import {FormGroupContext} from './decorator/form-group.decorator';
import {NgxFormBuilder} from './ngx-form.builder';
import {NgxFormGroup} from './model/ngx-form-group.model';
import {transformSmartValueToValue, transformValueToSmartValue} from './common';
import {FormArray} from './decorator/form-array.decorator';

class UserForm {

  @FormControl({defaultValue: 'Thomas'})
  public firstName: string;

  @FormControl()
  public lastName: string;

  @FormArray({defaultValue: 'Default skill'})
  public skills: string[];
}

describe('Common', () => {

  const formGroupContextConfiguration: FormGroupContext<UserForm> = {
    type: () => UserForm
  };

  const builder: NgxFormBuilder = new NgxFormBuilder();
  let form: NgxFormGroup<UserForm>;

  beforeEach(() => {
    form = builder.build(formGroupContextConfiguration);
  })

  it('should transform value to smart value', () => {
    expect(transformValueToSmartValue(form, '')).toBeInstanceOf(UserForm);
  })

  it('should transform smart value to value', () => {
    expect(transformSmartValueToValue(new UserForm())).toBeInstanceOf(Object);
  })
})
