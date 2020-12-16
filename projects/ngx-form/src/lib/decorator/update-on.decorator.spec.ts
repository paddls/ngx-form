import 'reflect-metadata';
import {UPDATE_ON_METADATA_KEY, UpdateOn} from './update-on.decorator';

@UpdateOn('blur')
class LibraryForm {

  public name: string = 'My Library';

  @UpdateOn('change')
  public numberOfBooks: number = 10;
}

class NotAForm {
}

describe('UpdateOnDecorator', () => {

  const form: LibraryForm = new LibraryForm();

  it('should add update on metadata on property with decorator', () => {
    expect(Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}:numberOfBooks`, form)).toBeDefined();
  })

  it('should not add update on metadata on property without decorator', () => {
    expect(Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}:name`, form)).toBeUndefined();
  })

  it('should add update on metadata on class with decorator', () => {
    expect(Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}`, LibraryForm)).toBeDefined();
  })

  it('should not add update on metadata on class without decorator', () => {
    expect(Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}`, NotAForm)).toBeUndefined();
  })
})
