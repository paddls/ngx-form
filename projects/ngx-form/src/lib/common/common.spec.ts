import { FormControl } from '../decorator/form-control.decorator';
import { FormGroupContext } from '../decorator/form-group.decorator';
import { NgxFormBuilder } from '../core/ngx-form.builder';
import { NgxFormGroup } from '../model/ngx-form-group.model';
import { transformSmartValueToValue, transformValueToSmartValue } from './common';
import { FormArray } from '../decorator/form-array.decorator';
import { TestBed } from '@angular/core/testing';
import { provideNgxForm } from '../ngx-form.module';
import {NgxFormControl} from '../model/ngx-form-control.model';
import {NgxFormArray} from '../model/ngx-form-array.model';

class UserForm {

  @FormControl({defaultValue: 'Thomas'})
  public firstName: string;

  @FormControl()
  public lastName: string;

  @FormArray({defaultValue: 'Default skill'})
  public skills: string[];

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

let builder: NgxFormBuilder;
let form: NgxFormGroup<UserForm>;

describe('Common', () => {

  const formGroupContextConfiguration: FormGroupContext<UserForm> = {
    type: () => UserForm
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgxForm(),
      ]
    })

    builder = TestBed.inject(NgxFormBuilder);
    form = builder.build(formGroupContextConfiguration);
  });

  it('should transform value to smart value', () => {
    expect(transformValueToSmartValue(form, '')).toBeInstanceOf(UserForm);
  })

  it('should transform smart value to value', () => {
    expect(transformSmartValueToValue(new UserForm())).toBeInstanceOf(Object);
  })

  it('should not expose functions as controls', () => {
    expect(form.controls['getFullName']).toBeUndefined();
  })

  it('should expose all controls', () => {
    expect(form.controls.firstName).toBeDefined();
    expect(form.controls.lastName).toBeDefined();
    expect(form.controls.skills).toBeDefined();
  })

  it('should expose all controls as FormControl', () => {
    expect(form.controls.firstName).toBeInstanceOf(NgxFormControl);
    expect(form.controls.lastName).toBeInstanceOf(NgxFormControl);
    expect(form.controls.skills).toBeInstanceOf(NgxFormArray);
  });

  it('should expose functions when retrieving value', () => {
    expect(form.getValue().getFullName).toBeDefined();
  });

})
