import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn} from '@angular/forms';
import {set} from 'lodash';
import {ConstructorFunction} from '../common';
import {FORM_CONTROL_SUFFIX_METADATA_KEY} from '../decorator/form-control.decorator';
import {FORM_GROUP_SUFFIX_METADATA_KEY, FormGroupContext} from '../decorator/form-group.decorator';
import {findPropertyFormContexts, FormContextCommon} from '../decorator/decorator.common';

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

    const controlContexts: { [key: string]: FormContextCommon<V> } = findPropertyFormContexts(type.prototype, FORM_CONTROL_SUFFIX_METADATA_KEY);
    Object.keys(controlContexts).forEach((key: string) => {
      const controlContext: FormContextCommon<V> = controlContexts[key];
      set(value as any, key, this.get(controlContext.name).value);
    });

    // const arrayContexts: {[key: string]: FormContextCommon<V>} = findPropertyFormContexts(type.prototype, FORM_ARRAY_SUFFIX_METADATA_KEY);

    const groupContexts: { [key: string]: FormContextCommon<V> } = findPropertyFormContexts(type.prototype, FORM_GROUP_SUFFIX_METADATA_KEY);
    Object.keys(groupContexts).forEach((key: string) => {
      const groupContext: FormGroupContext<V> = groupContexts[key] as FormGroupContext<V>;
      set(value as any, key, (this.get(groupContext.name) as NgxFormGroup<any>).getValue(parent + key))
    });

    return value;
  }
}
