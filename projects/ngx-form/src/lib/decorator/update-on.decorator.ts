import {FormHooks} from '../common/decorator.common';

export const UPDATE_ON_METADATA_KEY: string = 'ngx-form:update-on';

export function UpdateOn<T>(updateOn: FormHooks): any {
  return (target: any, propertyKey: string = null): void => {
    let key: string = UPDATE_ON_METADATA_KEY;
    if (propertyKey) {
      key += `:${propertyKey}`;
    }
    Reflect.defineMetadata(key, updateOn, target);
  }
}
