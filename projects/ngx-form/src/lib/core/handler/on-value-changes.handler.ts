import { DestroyRef, Injectable } from '@angular/core';
import { ConstructorFunction, Handler } from '../../common/common';
import { NgxFormGroup } from '../../model/ngx-form-group.model';
import { merge, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ON_VALUE_CHANGES_METADATA_KEY, OnValueChangesContext } from '../../decorator/on-value-changes.decorator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class OnValueChangesHandler implements Handler {

  public handle<T>(type: () => ConstructorFunction<T>, instance: NgxFormGroup<T>, unsubscribeOn: Observable<any> | DestroyRef): void {
    if (!Reflect.hasMetadata(ON_VALUE_CHANGES_METADATA_KEY, type().prototype)) {
      return;
    }

    if (!unsubscribeOn) {
      throw new Error(`Please provide 'unsubscribeOn' property with a valid Observable property name on @BuildForm decorator context to use @OnValueChanges`);
    }

    const contexts: OnValueChangesContext[] = Reflect.getMetadata(ON_VALUE_CHANGES_METADATA_KEY, type().prototype);

    contexts.forEach((context: OnValueChangesContext) => {
      let trigger$: Observable<void> = this.getValueChanges(instance, context.controls);
      if (unsubscribeOn instanceof Observable) {
        trigger$ = trigger$.pipe(
          takeUntil(unsubscribeOn)
        );
      } else if (unsubscribeOn instanceof DestroyRef) {
        trigger$ = trigger$.pipe(
          takeUntilDestroyed(unsubscribeOn)
        );
      } else {
        throw new Error('Please provide a valid Observable or DestroyRef property name on @BuildForm decorator context to use @OnValueChanges');
      }
      trigger$.subscribe({
        next: () => instance.getValue()[context.propertyKey].call(instance.getValue(), instance),
        complete: () => console.log('complete')
      })
    });
  }

  private getValueChanges<T>(instance: NgxFormGroup<T>, keys: string | string[]): Observable<void> {
    if (!keys) {
      return instance.valueChanges.pipe(
        map(() => void 0)
      );
    } else {
      if (!Array.isArray(keys)) {
        keys = [keys];
      }

      return merge(...keys.map((key: string) => instance.get(key).valueChanges)).pipe(
        map(() => void 0)
      );
    }
  }

}
