import { Injectable } from '@angular/core';
import { ConstructorFunction, Handler } from '../../common/common';
import { NgxFormGroup } from '../../model/ngx-form-group.model';
import { merge, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ON_VALUE_CHANGES_METADATA_KEY, OnValueChangesContext } from '../../decorator/on-value-changes.decorator';

@Injectable()
export class OnValueChangesHandler implements Handler {

  public handle<T>(type: () => ConstructorFunction<T>, instance: NgxFormGroup<T>, unsubscribeOn: Observable<any>): void {
    if (!Reflect.hasMetadata(ON_VALUE_CHANGES_METADATA_KEY, type().prototype)) {
      return;
    }

    if (!unsubscribeOn) {
      throw new Error(`Please provide 'unsubscribeOn' property with a valid Observable property name on @BuildForm decorator context to use @OnValueChanges`);
    }

    const contexts: OnValueChangesContext[] = Reflect.getMetadata(ON_VALUE_CHANGES_METADATA_KEY, type().prototype);

    contexts.forEach((context: OnValueChangesContext) =>
      this.getValueChanges(instance, context.controls).pipe(
        takeUntil(unsubscribeOn)
      ).subscribe(() => instance.getValue()[context.propertyKey].call(instance.getValue(), instance))
    );
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
