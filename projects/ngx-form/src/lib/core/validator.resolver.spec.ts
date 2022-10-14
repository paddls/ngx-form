import {TestBed} from '@angular/core/testing';
import {NgxFormModule} from '../ngx-form.module';
import {ValidatorResolver} from './validator.resolver';
import {Injectable} from '@angular/core';
import {FormControl, ValidatorFn, Validators} from '@angular/forms';
import {ValidatorFactory, ValidatorFactoryWithProviders} from '../factory/validator.factory';

@Injectable()
class MyProvider {

  public readonly length: number = 5;

}

describe('ValidatorResolver', () => {

  let resolver: ValidatorResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxFormModule.forRoot()
      ],
      providers: [
        ValidatorResolver,
        MyProvider
      ]
    });

    resolver = TestBed.inject(ValidatorResolver);
  });

  it('should return undefined if no config', () => {
    expect(resolver.resolve(undefined)).toBeUndefined();
  });

  it('should return validator fn as is', () => {
    const validator: ValidatorFn = Validators.required;

    expect(resolver.resolve(validator)).toEqual(validator);
  });

  it('should return validator fn array as is', () => {
    const validators: ValidatorFn[] = [Validators.required, Validators.min(0)];

    expect(resolver.resolve(validators)).toEqual(validators);
  });

  it('should build validator fn', () => {
    const validator: ValidatorFactoryWithProviders =
      ValidatorFactory.of(((provider: MyProvider) => Validators.min(provider.length)), [MyProvider]);

    const error: any = (resolver.resolve(validator) as ValidatorFn)(new FormControl(0));
    expect(error).toEqual(Validators.min(5)(new FormControl(0)));
  });
});
