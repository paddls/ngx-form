import { FormControl } from './form-control.decorator';
import { NgxFormGroup } from '../model/ngx-form-group.model';
import { BuildForm } from './build-form.decorator';
import { NgxFormBuilder } from '../core/ngx-form.builder';
import { provideNgxForm } from '../ngx-form.module';
import { TestBed } from '@angular/core/testing';
import { EMPTY, Observable, of } from 'rxjs';
import { DisableOn } from './disable-on.decorator';
import { Injectable } from '@angular/core';
import { DisableOnFactory } from '../factory/disable-on.factory';
import { delay } from 'rxjs/operators';
import { FormControlStatus, Validators } from '@angular/forms';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import { FormGroup } from './form-group.decorator';
import { Validator } from './validator.decorator';
import { OnValueChanges } from './on-value-changes.decorator';

@Injectable()
class MyProvider {

  public enable(): Observable<boolean> {
    return of(false);
  }

  public disable(): Observable<boolean> {
    return of(true);
  }

  public disableWithTimeout(): Observable<boolean> {
    return of(true).pipe(
      delay(100)
    );
  }

}

@Validator(Validators.required)
class UserForm {

  @FormControl()
  public name: string;

  @FormControl({defaultValue: 'Oscar GUERIN'})
  public displayName: string;

  @DisableOn(of(true))
  @FormControl()
  public surname: string;

  @DisableOn(DisableOnFactory.of((provider: MyProvider) => provider.disable(), [MyProvider]))
  @FormControl()
  public disabledAddress: string;

  @DisableOn(DisableOnFactory.of((provider: MyProvider) => provider.enable(), [MyProvider]))
  @FormControl()
  public enabledAddress: string;

  @DisableOn(DisableOnFactory.of((provider: MyProvider) => provider.disableWithTimeout(), [MyProvider]))
  @FormControl()
  public disabledWithTimeoutAddress: string;

  @DisableOn(DisableOnFactory.of((provider: MyProvider) => provider.disableWithTimeout(), [MyProvider]), {emitEvent: false})
  @FormControl()
  public disabledWithTimeoutAddressWithoutEvents: string;

  @FormGroup(() => SubForm)
  public subForm: SubForm;
}

class SubForm {

  @DisableOn(of(true))
  @FormControl()
  public myControl: string;

}

@DisableOn(of(true))
class DisabledForm {

  @FormControl()
  public name: string;

}

class SumForm {

  @FormControl()
  public a: number;

  @FormControl()
  public b: number;

  @FormControl()
  public sum: number;

  @OnValueChanges(['a', 'b'])
  public computeSum(instance: NgxFormGroup<SumForm>): void {
    this.sum = this.a + this.b;
    instance.setValue(this, {emitEvent: false});
  }
}

class ConsumerComponent {

  public readonly obs$: Observable<any> = EMPTY;

  @BuildForm(() => UserForm, {unsubscribeOn: 'obs$'})
  public form: NgxFormGroup<UserForm>;

  @BuildForm(() => DisabledForm, {unsubscribeOn: 'obs$'})
  public disabledForm: NgxFormGroup<DisabledForm>;

  @BuildForm(() => SumForm, {unsubscribeOn: 'obs$'})
  public sumForm: NgxFormGroup<SumForm>;
}

describe('BuildFormDecorator', () => {

  let builder: NgxFormBuilder;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgxForm(),
        MyProvider
      ]
    });

    builder = TestBed.inject(NgxFormBuilder);
    testScheduler = new TestScheduler(((actual: any, expected: any) => {
      expect(actual).toEqual(expected);
    }));
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

  it('should disable controls depending on disable on observable value', () => {
    expect(component.form.controls.enabledAddress.enabled).toBeTrue();
    expect(component.form.controls.disabledAddress.disabled).toBeTrue();
    expect(component.form.controls.surname.disabled).toBeTrue();
  });

  it('should emit disable events when emit event option is true or undefined', (done: DoneFn) => {
    component.form.controls.disabledWithTimeoutAddress.statusChanges.subscribe((event: FormControlStatus) => {
      expect(event).toEqual('DISABLED');

      done();
    });
  });

  it('should not emit disable events when emit event option is set to false', () => {
    testScheduler.run(({expectObservable}: RunHelpers) => {
      const source$: Observable<FormControlStatus> = component.form.controls.disabledWithTimeoutAddressWithoutEvents.statusChanges;
      expectObservable(source$).toBe('');
    });
  });

  it('should disable entire form if disable on decorator is set on form class', () => {
    expect(component.form.enabled).toBeTrue();
    expect(component.disabledForm.disabled).toBeTrue();
  });

  it('should disable controls from child form groups', () => {
    expect(component.form.controls.subForm.get('myControl').disabled).toBeTrue();
  });

  it('should compute sum on value changes', () => {
    component.sumForm.get('a').setValue(2);
    component.sumForm.get('b').setValue(3);

    expect(component.sumForm.getValue().sum).toEqual(5);
  })
})
