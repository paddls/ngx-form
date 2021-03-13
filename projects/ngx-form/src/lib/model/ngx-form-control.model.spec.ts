import {Validators} from '@angular/forms';
import {Validator} from '../decorator/validator.decorator';
import {FormControl} from '../decorator/form-control.decorator';
import {FormGroupContext} from '../decorator/form-group.decorator';
import {UpdateOn} from '../decorator/update-on.decorator';
import {NgxFormBuilder} from '../ngx-form.builder';
import {NgxFormGroup} from './ngx-form-group.model';

@UpdateOn('change')
class UserForm {

  @FormControl({defaultValue: 'Thomas'})
  public firstName: string;

  @Validator(Validators.required)
  @FormControl()
  public lastName: string;
}

describe('NgxFormControl', () => {

  const formGroupContextConfiguration: FormGroupContext<UserForm> = {
    type: () => UserForm
  };

  const builder: NgxFormBuilder = new NgxFormBuilder();
  let form: NgxFormGroup<UserForm>;

  beforeEach(() => {
    form = builder.build(formGroupContextConfiguration);
  })

  it('should set value on method call', () => {
    form.controls.firstName.setValue('Oscar');
    expect(form.getValue().firstName).toEqual('Oscar');
  })

  it('should restore value on method call', () => {
    form.controls.firstName.setValue('Oscar');
    form.restore();
    expect(form.getValue().firstName).toEqual('Thomas');
  })
})
