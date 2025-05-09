import { DestroyRef, inject, Injectable, Injector, Type } from '@angular/core';
import { Handler } from '../../common/common';
import { NgxFormGroup } from '../../model/ngx-form-group.model';
import { DISABLE_ON_METADATA_KEY, DisableOnContext } from '../../decorator/disable-on.decorator';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { findAllPropertyFormContexts, findPropertyFormContexts, FormContextCommon } from '../../common/decorator.common';
import { AbstractControl } from '@angular/forms';
import { FORM_GROUP_SUFFIX_METADATA_KEY, FormGroupContext } from '../../decorator/form-group.decorator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConstructorFunction } from '../../common/typing';

@Injectable()
export class DisableOnHandler implements Handler {

  private readonly injector: Injector = inject(Injector);

  public handle<T>(type: () => ConstructorFunction<T>, instance: NgxFormGroup<T>, unsubscribeOn: Observable<any> | DestroyRef): void {
    if (!Reflect.hasMetadata(DISABLE_ON_METADATA_KEY, type().prototype) && !Reflect.hasMetadata(DISABLE_ON_METADATA_KEY, type())) {
      return;
    }

    if (!unsubscribeOn) {
      throw new Error(`Please provide 'unsubscribeOn' property with a valid Observable property name on @BuildForm decorator context to use @DisableOn`);
    }

    const children: {[key: string]: FormGroupContext<T>} = findPropertyFormContexts(type().prototype, FORM_GROUP_SUFFIX_METADATA_KEY) as {[key: string]: FormGroupContext<T>};

    Object.keys(children).forEach((key: string) => this.handle(children[key].type, instance.get(children[key].name) as unknown as NgxFormGroup<any>, unsubscribeOn));

    const disableOnContexts: DisableOnContext[] = [
      ...(Reflect.getMetadata(DISABLE_ON_METADATA_KEY, type().prototype) || []),
      ...(Reflect.getMetadata(DISABLE_ON_METADATA_KEY, type()) || [])
    ];

    const formContexts: {[key: string]: FormContextCommon<T>} = findAllPropertyFormContexts(type().prototype);

    disableOnContexts.forEach((context: DisableOnContext) => {
      let element: AbstractControl;
      let trigger$: Observable<boolean>;

      if (!!context.propertyKey) {
        element = instance.get(formContexts[context.propertyKey].name);
      } else {
        element = instance;
      }

      if (context.config instanceof Observable) {
        trigger$ = context.config
      } else if (!!context.config.factory && !!context.config.providers) {
        trigger$ = context.config.factory(...context.config.providers.map((provider: Type<any>) => this.injector.get(provider)));
      } else {
        throw new Error('Invalid @DisableOn argument');
      }

      if (unsubscribeOn instanceof Observable) {
        trigger$ = trigger$.pipe(
          takeUntil(unsubscribeOn)
        );
      } else if (unsubscribeOn instanceof DestroyRef) {
        trigger$ = trigger$.pipe(
          takeUntilDestroyed(unsubscribeOn)
        );
      } else {
        throw new Error('Please provide a valid Observable or DestroyRef property name on @BuildForm decorator context to use @DisableOnHandler');
      }

      trigger$.subscribe((disable: boolean) => {
        if (!!disable) {
          element.disable(context.options);
        } else {
          element.enable(context.options);
        }
      });
    });
  }

}
