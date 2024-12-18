import 'reflect-metadata';
import { Validator, VALIDATORS_METADATA_KEY } from './validator.decorator';
import { Validators } from '@angular/forms';

@Validator(Validators.required)
class LibraryForm {

  public name: string = 'My Library';

  @Validator([Validators.required, Validators.min(0)])
  public numberOfBooks: number = 10;
}

class NotAForm {
}

describe('ValidatorDecorator', () => {

  const form: LibraryForm = new LibraryForm();

  it('should add validator metadata on property with decorator', () => {
    expect(Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}:numberOfBooks`, form)).toBeDefined();
  })

  it('should not add validator metadata on property without decorator', () => {
    expect(Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}:name`, form)).toBeUndefined();
  })

  it('should add validator metadata on class with decorator', () => {
    expect(Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}`, LibraryForm)).toBeDefined();
  })

  it('should not add validator metadata on class without decorator', () => {
    expect(Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}`, NotAForm)).toBeUndefined();
  })
})
