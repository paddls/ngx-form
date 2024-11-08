import {findPropertyFormContexts, FormContextCommon} from './decorator.common';
import {FORM_CONTROL_SUFFIX_METADATA_KEY} from '../decorator/form-control.decorator';
import {FORM_GROUP_SUFFIX_METADATA_KEY, FormGroupContext} from '../decorator/form-group.decorator';
import {FORM_ARRAY_SUFFIX_METADATA_KEY, FormArrayContext} from '../decorator/form-array.decorator';
import {NgxFormArray} from '../model/ngx-form-array.model';
import {FORM_GROUP_INSTANCE_METADATA_KEY, NgxFormGroup} from '../model/ngx-form-group.model';
import {Observable} from 'rxjs';
import {NgxFormControl} from '../model/ngx-form-control.model';
import {set} from './functions/set';

export interface Handler {

  handle<T>(type: () => ConstructorFunction<T>, instance: NgxFormGroup<T>, unsubscribeOn: Observable<any>): void;

}

export type ConstructorFunction<T> = new(...args: any[]) => T;

export function transformValueToSmartValue<V>(formGroup: NgxFormGroup<V>, parent: string): V {
  const formGroupContext: FormGroupContext<V> = Reflect.getMetadata(FORM_GROUP_INSTANCE_METADATA_KEY, formGroup);
  const value: V = new (formGroupContext.type())();

  const controlContexts: {[key: string]: FormContextCommon<V>} = findPropertyFormContexts(formGroupContext.type().prototype, FORM_CONTROL_SUFFIX_METADATA_KEY);
  Object.keys(controlContexts).forEach((key: string) => {
    const controlContext: FormContextCommon<V> = controlContexts[key];
    set(value, key, formGroup.get(controlContext.name)?.value);
  });

  const arrayContexts: {[key: string]: FormContextCommon<any>} = findPropertyFormContexts(formGroupContext.type().prototype, FORM_ARRAY_SUFFIX_METADATA_KEY);
  Object.keys(arrayContexts).forEach((key: string) => {
    const formArrayContext: FormArrayContext<any> = arrayContexts[key] as FormArrayContext<any>;

    if (!value[key]) {
      value[key] = [];
    }

    if (formArrayContext.type) {
      value[key] = (formGroup.get(formArrayContext.name) as unknown as NgxFormArray<V>)?.controls.map((item: any, index: number) => (item as NgxFormGroup<V>).getValue(parent + index));
    } else {
      value[key] = (formGroup.get(formArrayContext.name) as unknown as NgxFormArray<V>)?.controls.map((item: any) => (item as NgxFormControl<V>).value);
    }
  });

  const groupContexts: {[key: string]: FormContextCommon<V>} = findPropertyFormContexts(formGroupContext.type().prototype, FORM_GROUP_SUFFIX_METADATA_KEY);
  Object.keys(groupContexts).forEach((key: string) => {
    const groupContext: FormGroupContext<V> = groupContexts[key] as FormGroupContext<V>;
    set(value, key, (formGroup.get(groupContext.name) as unknown as NgxFormArray<V>)?.getValue(parent + key))
  });

  return value;
}

export function transformSmartValueToValue<V>(value: V): any {
  const obj: any = {};

  const controlContexts: {[key: string]: FormContextCommon<V>} = {};
  Object.assign(controlContexts, {
    ...findPropertyFormContexts(value.constructor.prototype, FORM_CONTROL_SUFFIX_METADATA_KEY),
    ...findPropertyFormContexts(value.constructor.prototype, FORM_GROUP_SUFFIX_METADATA_KEY)
  });
  Object.keys(controlContexts).forEach((key: string) => {
    const controlContext: FormContextCommon<V> = controlContexts[key];
    if (value[key] !== undefined) {
      set(obj, controlContext.name, value[key]);
    }
  });

  const arrayContexts: {[key: string]: FormContextCommon<V>} = findPropertyFormContexts(value.constructor.prototype, FORM_ARRAY_SUFFIX_METADATA_KEY);
  Object.keys(arrayContexts).forEach((key: string) => {
    const formArrayContext: FormArrayContext<any> = arrayContexts[key] as FormArrayContext<any>;

    if (value[key] === undefined) {
      return;
    }

    if (!obj[formArrayContext.name]) {
      obj[formArrayContext.name] = [];
    }

    obj[formArrayContext.name] = value[key];
  });

  return obj;
}

type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
  | Date;

type Arrayable<T> = T[];

type IterableElement<TargetIterable> =
  TargetIterable extends Iterable<infer ElementType> ?
    ElementType :
    TargetIterable extends AsyncIterable<infer ElementType> ?
      ElementType :
      never;

export type DataToFormType<V, K extends keyof V = keyof V> = {
  [key in K]: V[key] extends Primitive ? NgxFormControl<V[key]> : V[key] extends Arrayable<IterableElement<V[key]>> ? NgxFormArray<IterableElement<V[key]>> : NgxFormGroup<V[key]>
};
export type DataFormType<V> = Partial<V> & {[key: string]: any};
