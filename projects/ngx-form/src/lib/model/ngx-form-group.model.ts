import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn} from '@angular/forms';
import {FORM_CONTROLS_METADATA_KEY, FormControlContextConfiguration} from '../decorator/form-control.decorator';
import {FORM_ARRAYS_METADATA_KEY, FormArrayContextConfiguration} from '../decorator/form-array.decorator';
import {set} from 'lodash';
import {FORM_GROUPS_METADATA_KEY, FormGroupContextConfiguration} from '../decorator/form-group.decorator';
import {ConstructorFunction} from '../common';

export const FORM_GROUP_METADATAKEY: string = 'ngx-form:form-group';

export class NgxFormGroup<V> extends FormGroup {

  public constructor(controls: { [key: string]: AbstractControl; },
                     validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                     asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  public getValue(parent: string = ''): V {
    if (parent !== '') {
      parent += parent + '.';
    }

    const type: ConstructorFunction<V> = Reflect.getMetadata(FORM_GROUP_METADATAKEY, this);
    const value: V = new type();

    const controlContextConfigurations: FormControlContextConfiguration<any>[] = Reflect.getMetadata(FORM_CONTROLS_METADATA_KEY, type.prototype) || [];

    for(const controlContextConfiguration of controlContextConfigurations) {
      set(value as any, controlContextConfiguration.propertyKey, this.get(controlContextConfiguration.name).value);
    }

    const formArrayContextConfigurations: FormArrayContextConfiguration<any>[] = Reflect.getMetadata(FORM_ARRAYS_METADATA_KEY, type.prototype) || [];

    for(const formArrayContextConfiguration of formArrayContextConfigurations) {
      set(value as any, formArrayContextConfiguration.propertyKey, this.get(formArrayContextConfiguration.name).value);
    }

    const formGroupContextConfigurations: FormGroupContextConfiguration<any>[] = Reflect.getMetadata(FORM_GROUPS_METADATA_KEY, type.prototype) || [];

    for(const formGroupContextConfiguration of formGroupContextConfigurations) {
      set(
        value as any,
        formGroupContextConfiguration.propertyKey,
        (this.get(formGroupContextConfiguration.name) as NgxFormGroup<any>).getValue(parent + formGroupContextConfiguration.propertyKey)
      );
    }

    return value;
  }
}
