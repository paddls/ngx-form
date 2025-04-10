import { NgxFormControl } from '../model/ngx-form-control.model';
import { NgxFormArray } from '../model/ngx-form-array.model';
import { NgxFormGroup } from '../model/ngx-form-group.model';

type MarkFunctionProperties<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key;
};

type ExcludedFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludedFunctionPropertyNames<T>>;

export type ConstructorFunction<T> = new(...args: any[]) => T;

type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
  | Date
  | File;

type Arrayable<T> = T[];

type IterableElement<TargetIterable> =
  TargetIterable extends Iterable<infer ElementType> ?
    ElementType :
    TargetIterable extends AsyncIterable<infer ElementType> ?
      ElementType :
      never;

export type DataToFormType<V, K extends keyof ExcludeFunctions<V> = keyof ExcludeFunctions<V>> = {
  [key in K]: V[key] extends Primitive ? NgxFormControl<V[key]> : V[key] extends Arrayable<IterableElement<V[key]>> ? NgxFormArray<IterableElement<V[key]>> : NgxFormGroup<V[key]>
};
export type DataFormType<V> = Partial<V> & {[key: string]: any};
