import {Validator, VALIDATORS_METADATA_KEY} from './validator.decorator';
import {Validators} from '@angular/forms';
import 'reflect-metadata';

@Validator(Validators.required)
class LibraryForm {

  public name: string = 'My Library';

  @Validator([Validators.required, Validators.min(0)])
  public numberOfBooks: number = 10;
}

describe('ValidatorDecorator', () => {

  const form: LibraryForm = new LibraryForm();

  it('should add validator metadata on property with decorator', () => {
    expect(Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}:numberOfBooks`, form).toString()).toEqual([Validators.required, Validators.min(0)].toString());
  })
})
