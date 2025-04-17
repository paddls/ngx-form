import { NgxFormControl } from '../model/ngx-form-control.model';
import { NgxFormArray } from '../model/ngx-form-array.model';
import { NgxFormGroup } from '../model/ngx-form-group.model';
import { IsNumericLiteral, IsStringLiteral } from 'type-fest';

export type MarkFunctionProperties<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key;
};

export type ExcludedFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

export type ExcludeFunctions<T> = Pick<T, ExcludedFunctionPropertyNames<T>>;

export type ConstructorFunction<T> = new(...args: any[]) => T;

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
  | Date
  | File;

export type Arrayable<T> = T[];

export type IterableElement<TargetIterable> =
  TargetIterable extends Iterable<infer ElementType> ?
    ElementType :
    TargetIterable extends AsyncIterable<infer ElementType> ?
      ElementType :
      never;

type EndsWith<TValue, TEndsWith extends string> =
  TValue extends string
    ? IsStringLiteral<TEndsWith> extends true
      ? IsStringLiteral<TValue> extends true
        ? TValue extends `${string}${TEndsWith}`
          ? true
          : false
        : boolean
      : boolean
    : TValue extends number
      ? IsNumericLiteral<TValue> extends true
        ? EndsWith<`${TValue}`, TEndsWith>
        : false
      : false;

export type DataToFormType<V, K extends keyof ExcludeFunctions<V> = keyof ExcludeFunctions<V>> = {
  [key in K]: V[key] extends Primitive
    ? NgxFormControl<V[key]>
    : V[key] extends Arrayable<IterableElement<V[key]>>
      ? NgxFormArray<IterableElement<V[key]>>
      : EndsWith<V[key], 'Form'> extends true
        ? NgxFormGroup<V[key]>
        : NgxFormControl<V[key]>
};
export type DataFormType<V> = Partial<V> & {[key: string]: any};
