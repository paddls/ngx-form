import {FormControl} from './form-control.decorator';
import {NgxFormGroup} from '../model/ngx-form-group.model';
import {BuildForm} from './build-form.decorator';
import {NgxFormBuilder} from '../ngx-form.builder';
import {NgxFormModule} from '../ngx-form.module';
import {TestBed} from '@angular/core/testing';

class UserForm {

  @FormControl()
  public name: string;

  @FormControl({defaultValue: 'Oscar GUERIN'})
  public displayName: string;
}

class ConsumerComponent {

  @BuildForm(() => UserForm)
  public form: NgxFormGroup<UserForm>;
}

describe('BuildFormDecorator', () => {

  let builder: NgxFormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxFormModule.forRoot()
      ]
    });

    builder = TestBed.inject(NgxFormBuilder);
  });

  const component: ConsumerComponent = new ConsumerComponent();

  it('should create form group', () => {
    expect(component.form).toBeDefined();
  });

  it('should create form controls', () => {
    expect(component.form.controls.name).toBeDefined();
  });

  it('should set initial value when specified', () => {
    expect(component.form.controls.name.value).toBeNull();
    expect(component.form.controls.displayName.value).toEqual('Oscar GUERIN');
  });
})
