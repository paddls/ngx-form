import 'reflect-metadata';
import { AsyncValidatorFn } from '@angular/forms';
import { ASYNC_VALIDATORS_METADATA_KEY, AsyncValidator } from './async-validator.decorator';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AsyncValidatorFactory } from '../factory/async-validator.factory';

class MyService {
}

const myAsyncValidator: AsyncValidatorFn = () =>
  of(void 0).pipe(
    delay(10),
    map(() => ({asyncError: true}))
  );

@AsyncValidator(myAsyncValidator)
class LibraryForm {

  public name: string = 'My Library';

  @AsyncValidator([])
  public numberOfBooks: number = 10;

  @AsyncValidator(AsyncValidatorFactory.of((service: MyService) => () => of({error: `${service}`}), [MyService]))
  public address: string;

  @AsyncValidator([
    myAsyncValidator,
    AsyncValidatorFactory.of((service: MyService) => () => of({error: `${service}`}), [MyService])
  ])
  public secondaryAddress: string;
}

class NotAForm {
}

describe('AsyncValidatorDecorator', () => {

  const form: LibraryForm = new LibraryForm();

  it('should add async validator metadata on property with decorator', () => {
    expect(Reflect.getMetadata(`${ASYNC_VALIDATORS_METADATA_KEY}:numberOfBooks`, form)).toBeDefined();
  })

  it('should not add async validator metadata on property without decorator', () => {
    expect(Reflect.getMetadata(`${ASYNC_VALIDATORS_METADATA_KEY}:name`, form)).toBeUndefined();
  })

  it('should add async validator metadata on class with decorator', () => {
    expect(Reflect.getMetadata(`${ASYNC_VALIDATORS_METADATA_KEY}`, LibraryForm)).toBeDefined();
  })

  it('should not add async validator metadata on class without decorator', () => {
    expect(Reflect.getMetadata(`${ASYNC_VALIDATORS_METADATA_KEY}`, NotAForm)).toBeUndefined();
  })
})
