import 'reflect-metadata';
import { ON_VALUE_CHANGES_METADATA_KEY, OnValueChanges } from './on-value-changes.decorator';

class LibraryForm {

  public name: string = 'My Library';

  @OnValueChanges()
  public myMethod(): void {
    this.name = 'Another library'
  }
}

describe('OnValueChangesDecorator', () => {

  const form: LibraryForm = new LibraryForm();

  it('should add value changes metadata on method with decorator', () => {
    expect(Reflect.getMetadata(`${ON_VALUE_CHANGES_METADATA_KEY}`, form)).toBeDefined();
  });
});
