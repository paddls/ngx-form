export const ON_VALUE_CHANGES_METADATA_KEY: string = 'ngx-form:on-value-changes';

export interface OnValueChangesContext {

  propertyKey?: string;

  controls?: string | string[];

}

export function OnValueChanges(controls?: string | string[]): any {
  return (target: any, propertyKey = null): void => {
    const context: OnValueChangesContext = {propertyKey, controls};

    let metas: OnValueChangesContext[] = [];
    if (Reflect.hasMetadata(ON_VALUE_CHANGES_METADATA_KEY, target)) {
      metas = Reflect.getMetadata(ON_VALUE_CHANGES_METADATA_KEY, target);
    }
    Reflect.defineMetadata(ON_VALUE_CHANGES_METADATA_KEY, metas.concat(context), target);
  }
}
