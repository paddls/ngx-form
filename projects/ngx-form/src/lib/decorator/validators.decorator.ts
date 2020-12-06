import { ValidatorFn } from '@angular/forms';

export interface FormControlValidatorsConfiguration<T> {

  validators: ValidatorFn[];

  propertyKey: string;
}

export function Validators(...validators: ValidatorFn[]): any {
  return (target: any, propertyKey: string): void => {
    // let formControlContextConfiguration: FormControlContextConfiguration<T> = {
    //   propertyKey,
    //   name: propertyKey
    // }
    //
    // if (typeof formControlContext === 'object') {
    //   formControlContextConfiguration = {
    //     ...formControlContextConfiguration,
    //     ...formControlContext
    //   };
    // } else if (typeof formControlContext === 'string') {
    //   formControlContextConfiguration.name = formControlContext;
    // }
    //
    // let metas: FormControlContextConfiguration<T>[] = [];
    // if (Reflect.hasMetadata(FORM_CONTROLS_METADATA_KEY, target)) {
    //   metas = Reflect.getMetadata(FORM_CONTROLS_METADATA_KEY, target);
    // }
    //
    // Reflect.defineMetadata(FORM_CONTROLS_METADATA_KEY, metas.concat(formControlContextConfiguration), target);
  }
}
