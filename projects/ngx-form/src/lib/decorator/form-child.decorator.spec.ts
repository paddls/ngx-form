import {FormControl} from './form-control.decorator';
import {NgxFormGroup} from '../model/ngx-form-group.model';
import {BuildForm} from './build-form.decorator';
import {NgxFormBuilder} from '../ngx-form.builder';
import {NgxFormModule} from '../ngx-form.module';
import {FormArray} from './form-array.decorator';
import {FormChild} from './form-child.decorator';
import {NgxFormArray} from '../model/ngx-form-array.model';
import {TestBed} from '@angular/core/testing';

class UserForm {

  @FormControl()
  public name: string;

  @FormArray({defaultValue: 'Default skill', defaultValues: ['Java', 'C++']})
  public skills: string[];
}

class ConsumerComponent {

  @BuildForm(() => UserForm)
  public form: NgxFormGroup<UserForm>;

  @FormChild({attribute: 'form', path: 'skills'})
  public skillForm: NgxFormArray<string>;

  @FormChild({attribute: 'form', path: 'wrong'})
  public wrongPathForm: NgxFormArray<string>;
}

let builder: NgxFormBuilder;

const component: ConsumerComponent = new ConsumerComponent();

describe('FormChildDecorator', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxFormModule.forRoot()
      ]
    });

    builder = TestBed.inject(NgxFormBuilder);
  });

  it('should create form group', () => {
    expect(component.form).toBeDefined();
  });

  it('should create form child when path is correct', () => {
    expect(component.skillForm).toBeDefined();
  });

  it('should not create form child when path is incorrect', () => {
    expect(component.wrongPathForm).toBeNull();
  });

  it('should have value defined', () => {
    expect(component.skillForm.value).toBeDefined();
  });
})
