import {NgxFormBuilder} from './ngx-form.builder';
import {UpdateOn} from '../decorator/update-on.decorator';
import {FormControl} from '../decorator/form-control.decorator';
import {FormArray} from '../decorator/form-array.decorator';
import {FormGroup, FormGroupContext} from '../decorator/form-group.decorator';
import {NgxFormGroup} from '../model/ngx-form-group.model';
import {Validator} from '../decorator/validator.decorator';
import {Validators} from '@angular/forms';
import clone from 'lodash.clone';
import {TestBed} from '@angular/core/testing';
import {NgxFormModule} from '../ngx-form.module';
import {AsyncValidator} from '../decorator/async-validator.decorator';
import {AsyncValidatorFactory} from '../factory/async-validator.factory';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

@Injectable()
class MyService {

  public httpCall(): Observable<string> {
    return of('http result');
  }
}

class AddressForm {

  @Validator([Validators.required, Validators.min(0)])
  @FormControl({defaultValue: 0})
  public streetNumber: number;

  @FormControl({defaultValue: 'Default route'})
  public route: string;

  @FormControl({defaultValue: 'Default zipCode'})
  public zipCode: string;

  @FormControl({defaultValue: 'Default city'})
  public city: string;

  public constructor(data: Partial<AddressForm> = {}) {
    Object.assign(this, data);
  }
}

class CompanyForm {

  @FormControl()
  public name: string;

  @FormControl()
  public siret: string;

  @FormGroup(() => AddressForm)
  public address: AddressForm;

  public constructor(data: Partial<CompanyForm> = {}) {
    Object.assign(this, data);
  }
}

const defaultAddress: AddressForm = new AddressForm({
  route: 'User route',
  city: 'User city',
  zipCode: 'User zipCode'
})

@UpdateOn('change')
class UserForm {

  @FormControl({defaultValue: 'Thomas'})
  public firstName: string;

  @Validator(Validators.required)
  @FormControl()
  public lastName: string;

  @FormArray({defaultValue: 'Default skill', defaultValues: ['Java', 'C++']})
  public skills: string[];

  @FormArray(() => CompanyForm)
  public companies: CompanyForm[];

  @FormGroup({type: () => AddressForm, defaultValue: clone(defaultAddress)})
  @UpdateOn('submit')
  public personalAddress: AddressForm;

  @AsyncValidator([
    AsyncValidatorFactory.of(
      (service: MyService) => () => service.httpCall().pipe(map((result: string) => ({error: result}))),
      [MyService]
    )
  ])
  @FormControl()
  public secondaryAddress: string;

  public constructor(data: Partial<UserForm> = {}) {
    Object.assign(this, data);
  }
}

let builder: NgxFormBuilder;

const formGroupContextConfiguration: FormGroupContext<UserForm> = {
  type: () => UserForm
};

describe('NgxFormBuilder', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxFormModule.forRoot()
      ],
      providers: [
        MyService
      ]
    });

    builder = TestBed.inject(NgxFormBuilder);
  });

  it('should create ngx form control instance', () => {
    expect(builder.build(formGroupContextConfiguration)).toBeDefined()
  });

  it('should call build control method for each form control annotation', () => {
    spyOn(builder, 'buildControl').and.callThrough();
    builder.build(formGroupContextConfiguration);
    expect(builder.buildControl).toHaveBeenCalledTimes(7);
  });

  it('should call build group method for each form group annotation', () => {
    spyOn(builder, 'buildGroup').and.callThrough();
    builder.build(formGroupContextConfiguration);
    expect(builder.buildGroup).toHaveBeenCalledTimes(1);
  });

  it('should call build array method for each form array annotation', () => {
    spyOn(builder, 'buildArray').and.callThrough();
    builder.build(formGroupContextConfiguration);
    expect(builder.buildArray).toHaveBeenCalledTimes(2);
  });

  it('should have option properties set according to annotations', () => {
    const form: NgxFormGroup<UserForm> = builder.build(formGroupContextConfiguration);
    expect(form.updateOn).toEqual('change');
    expect(form.controls.lastName.validator).toEqual(Validators.required);
    expect((form.controls.personalAddress as NgxFormGroup<AddressForm>).controls.streetNumber.validator).toBeDefined();
  });

  it('should resolve async validator with dependencies', () => {
    const form: NgxFormGroup<UserForm> = builder.build(formGroupContextConfiguration);

    expect(form.controls.secondaryAddress.errors).toEqual({error: 'http result'});
  });
});
