import {findPropertyFormContexts, FormContextCommon} from './decorator/decorator.common';
import {FORM_CONTROL_SUFFIX_METADATA_KEY} from './decorator/form-control.decorator';
import {FORM_GROUP_SUFFIX_METADATA_KEY, FormGroupContext} from './decorator/form-group.decorator';
import {FORM_ARRAY_SUFFIX_METADATA_KEY, FormArrayContext} from './decorator/form-array.decorator';
import {NgxFormArray} from './model/ngx-form-array.model';
import {FORM_GROUP_INSTANCE_METADATA_KEY, NgxFormGroup} from './model/ngx-form-group.model';
import set from 'lodash.set';

export type ConstructorFunction<T> = new(...args: any[]) => T;

export function transformValueToSmartValue<V>(formGroup: NgxFormGroup<V>, parent: string): V {
  const formGroupContext: FormGroupContext<V> =  Reflect.getMetadata(FORM_GROUP_INSTANCE_METADATA_KEY, formGroup);
  const value: V = new (formGroupContext.type())();

  const controlContexts: { [key: string]: FormContextCommon<V> } = findPropertyFormContexts(formGroupContext.type().prototype, FORM_CONTROL_SUFFIX_METADATA_KEY);
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
      value[key] = (formGroup.get(formArrayContext.name) as NgxFormArray<any>)?.controls.map((item: NgxFormGroup<V>, index: number) => item.getValue(parent + index));
    } else {
      value[key] = (formGroup.get(formArrayContext.name) as NgxFormArray<any>)?.controls.map((item: NgxFormGroup<V>, index: number) => item.value);
    }
  });

  const groupContexts: { [key: string]: FormContextCommon<V> } = findPropertyFormContexts(formGroupContext.type().prototype, FORM_GROUP_SUFFIX_METADATA_KEY);
  Object.keys(groupContexts).forEach((key: string) => {
    const groupContext: FormGroupContext<V> = groupContexts[key] as FormGroupContext<V>;
    set(value, key, (formGroup.get(groupContext.name) as NgxFormGroup<any>)?.getValue(parent + key))
  });

  return value;
}

export function transformSmartValueToValue<V>(value: V): any {
  const obj: any = {};

  const controlContexts: { [key: string]: FormContextCommon<V> } = {};
  Object.assign(controlContexts, {
    ...findPropertyFormContexts(value.constructor.prototype, FORM_CONTROL_SUFFIX_METADATA_KEY),
    ...findPropertyFormContexts(value.constructor.prototype, FORM_GROUP_SUFFIX_METADATA_KEY)
  });
  Object.keys(controlContexts).forEach((key: string) => {
    const controlContext: FormContextCommon<V> = controlContexts[key];
    if(value[key] !== undefined) {
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
