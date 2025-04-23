import { NgxFormControl } from '../model/ngx-form-control.model';
import { NgxFormArray } from '../model/ngx-form-array.model';
import { NgxFormGroup } from '../model/ngx-form-group.model';

export type MarkFunctionProperties<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key;
};

export type ExcludedFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

export type ExcludeFunctions<T> = Pick<T, ExcludedFunctionPropertyNames<T>>;

export type ConstructorFunction<T> = new(...args: any[]) => T;

type GenericFormName = `${string}FormGroup`;

type GenericFormArrayName = `${string}FormArray`;

type ElementArray<T> = T extends Array<infer U> ? U : never;

export type DataToFormType<V, K extends keyof ExcludeFunctions<V> = keyof ExcludeFunctions<V>> = {
  [key in K]:  key extends GenericFormName
      ? NgxFormGroup<V[key]>
      : key extends GenericFormArrayName
        ? NgxFormArray<ElementArray<V[key]>>
        : NgxFormControl<V[key]>;
};

export type DataFormType<V> = Partial<V> & {[key: string]: any};
