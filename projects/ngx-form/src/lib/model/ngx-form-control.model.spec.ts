import {Validators} from '@angular/forms';
import {Validator} from '../decorator/validator.decorator';
import {FormControl} from '../decorator/form-control.decorator';
import {FormGroupContext} from '../decorator/form-group.decorator';
import {UpdateOn} from '../decorator/update-on.decorator';
import {NgxFormBuilder} from '../core/ngx-form.builder';
import {NgxFormGroup} from './ngx-form-group.model';
import {NgxFormControl} from './ngx-form-control.model';
import {TestBed} from '@angular/core/testing';
import {NgxFormModule} from '../ngx-form.module';

@UpdateOn('change')
class UserForm {

  @FormControl({defaultValue: 'Thomas'})
  public firstName: string;

  @Validator(Validators.required)
  @FormControl('userLastName')
  public lastName: string;

  public constructor(data: Partial<UserForm> = {}) {
    Object.assign(this, data);
  }
}

const formGroupContextConfiguration: FormGroupContext<UserForm> = {
  type: () => UserForm
};

let builder: NgxFormBuilder;
let form: NgxFormGroup<UserForm>;

describe('NgxFormControl', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxFormModule.forRoot()
      ]
    })

    builder = TestBed.inject(NgxFormBuilder);
    form = builder.build(formGroupContextConfiguration);
  });

  it('should set value on method call', () => {
    form.controls.firstName.setValue('Oscar');
    expect(form.getValue().firstName).toEqual('Oscar');
  });

  it('should restore value on method call', () => {
    form.controls.firstName.setValue('Oscar');
    form.restore();
    expect(form.getValue().firstName).toEqual('Thomas');
  });

  it('should set the value with the latest setValue call', () => {
    form.get('firstName').setValue('Thomas');
    form.get('firstName').patchValue('Oscarrr');

    (form.get('firstName') as NgxFormControl<string>).cancel();
    expect(form.get('firstName').value).toEqual('Thomas');
  });
})
