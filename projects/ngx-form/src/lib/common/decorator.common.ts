import 'reflect-metadata';
import { FORM_CONTROL_SUFFIX_METADATA_KEY } from '../decorator/form-control.decorator';
import { FORM_GROUP_SUFFIX_METADATA_KEY } from '../decorator/form-group.decorator';
import { FORM_ARRAY_SUFFIX_METADATA_KEY } from '../decorator/form-array.decorator';

export const PROPERTY_CONFIGURATIONS_METADATA_KEY: string = 'ngx-form:form-context-commons';

export type FormHooks = 'change' | 'blur' | 'submit';

export interface FormContextCommon<T> {

  name?: string;

  defaultValue?: any;
}

export function addFormContextCommon<T>(target: T, formControlContext: FormContextCommon<T>, propertyKey: string, suffixKey: string): void {
  applyPropertyConfiguration(target, propertyKey, formControlContext, suffixKey);
}

export function findAllPropertyFormContexts<T>(target: T): {[key: string]: FormContextCommon<T>} {
  return [
    FORM_CONTROL_SUFFIX_METADATA_KEY,
    FORM_GROUP_SUFFIX_METADATA_KEY,
    FORM_ARRAY_SUFFIX_METADATA_KEY
  ].reduce((acc: {[key: string]: FormContextCommon<T>}, curr: string) => ({...acc, ...findPropertyFormContexts(target, curr)}), {});
}

export function findPropertyFormContexts<T>(target: T, suffixKey: string): {[key: string]: FormContextCommon<T>} {
  return Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${suffixKey}`, target) || {};
}

function applyPropertyConfiguration<T>(target: T, propertyKey: string, controlConfiguration: FormContextCommon<T>, suffixKey: string): void {
  const configurations: {[key: string]: FormContextCommon<T>} = findPropertyFormContexts(target, suffixKey);
  configurations[propertyKey] = controlConfiguration;

  Reflect.defineMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${suffixKey}`, configurations, target);
}
