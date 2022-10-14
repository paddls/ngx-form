import {TestBed} from '@angular/core/testing';
import {NgxFormModule} from '../ngx-form.module';
import {Injectable} from '@angular/core';
import {AsyncValidatorFn, FormControl, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {AsyncValidatorResolver} from './async-validator.resolver';
import {delay, map} from 'rxjs/operators';
import {AsyncValidatorFactory, AsyncValidatorFactoryWithProviders} from '../factory/async-validator.factory';

const myAsyncValidator: AsyncValidatorFn = () =>
  of(void 0).pipe(
    delay(10),
    map(() => ({asyncError: true}))
  );

@Injectable()
class MyProvider {

  public readonly length$: Observable<number> = of(5);

}

describe('AsyncValidatorResolver', () => {

  let resolver: AsyncValidatorResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxFormModule.forRoot()
      ],
      providers: [
        AsyncValidatorResolver,
        MyProvider
      ]
    });

    resolver = TestBed.inject(AsyncValidatorResolver);
  });

  it('should return undefined if no config', () => {
    expect(resolver.resolve(undefined)).toBeUndefined();
  });

  it('should return async validator fn as is', () => {
    expect(resolver.resolve(myAsyncValidator)).toEqual(myAsyncValidator);
  });

  it('should return async validator fn array as is', () => {
    const validators: AsyncValidatorFn[] = [myAsyncValidator, myAsyncValidator];

    expect(resolver.resolve(validators)).toEqual(validators);
  });

  it('should build async validator fn', (done: DoneFn) => {
    const validator: AsyncValidatorFactoryWithProviders =
      AsyncValidatorFactory.of((() => myAsyncValidator), []);

    ((resolver.resolve(validator) as AsyncValidatorFn)(new FormControl(0)) as Observable<ValidationErrors>).subscribe((errors: any) => {
      expect(errors).toEqual({asyncError: true});
      done();
    });
  });
});
