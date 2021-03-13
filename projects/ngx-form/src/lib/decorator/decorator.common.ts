export const PROPERTY_CONFIGURATIONS_METADATA_KEY: string = 'ngx-form:form-context-commons';

export type FormHooks = 'change' | 'blur' | 'submit';

export interface FormContextCommon<T> {

  name?: string;

  defaultValue?: any;
}

export function addFormContextCommon<T>(target: T, formControlContext: FormContextCommon<T>, propertyKey: string, suffixKey: string): void {
  applyPropertyConfiguration(target, propertyKey, formControlContext, suffixKey);
}

export function findPropertyFormContexts<T>(target: T, suffixKey: string): {[key: string]: FormContextCommon<T>} {
  return Reflect.getMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${suffixKey}`, target) || {};
}

function applyPropertyConfiguration<T>(target: T, propertyKey: string, controlConfiguration: FormContextCommon<T>, suffixKey: string): void {
  const configurations: {[key: string]: FormContextCommon<T>} = findPropertyFormContexts(target, suffixKey);
  configurations[propertyKey] = controlConfiguration;

  Reflect.defineMetadata(`${PROPERTY_CONFIGURATIONS_METADATA_KEY}:${suffixKey}`, configurations, target);
}
