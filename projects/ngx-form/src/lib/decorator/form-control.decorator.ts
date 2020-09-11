export const FORM_CONTROLS_METADATA_KEY: string = 'ngx-form:form-controls';

export interface FormControlContext<T> {

  name?: string;

  value?: any;

  type?: () => new(...args: any[]) => T;
}

export interface FormControlContextConfiguration<T> extends FormControlContext<T> {

  propertyKey: string;
}

export function FormControl<T>(formControlContext?: FormControlContext<T>|string): any {
  return (target: any, propertyKey: string): void => {
    let formControlContextConfiguration: FormControlContextConfiguration<T> = {
      propertyKey,
      name: propertyKey
    }

    if (typeof formControlContext === 'object') {
      formControlContextConfiguration = {
        ...formControlContextConfiguration,
        ...formControlContext
      };
    } else if (typeof formControlContext === 'string') {
      formControlContextConfiguration.name = formControlContext;
    }

    let metas: FormControlContextConfiguration<T>[] = [];
    if (Reflect.hasMetadata(FORM_CONTROLS_METADATA_KEY, target)) {
      metas = Reflect.getMetadata(FORM_CONTROLS_METADATA_KEY, target);
    }

    Reflect.defineMetadata(FORM_CONTROLS_METADATA_KEY, metas.concat(formControlContextConfiguration), target);
  }
}
