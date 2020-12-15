import {Injectable} from '@angular/core';
import {AbstractControlOptions, AsyncValidatorFn, FormBuilder, FormGroup, ValidatorFn} from '@angular/forms';
import {FORM_GROUP_METADATAKEY, NgxFormGroup} from './model/ngx-form-group.model';
import {NgxFormControl} from './model/ngx-form-control.model';
import {NgxFormArray} from './model/ngx-form-array.model';
import {findPropertyFormContexts, FormContextCommon, FormHooks} from './decorator/decorator.common';
import {FORM_GROUP_SUFFIX_METADATA_KEY, FormGroupContext} from './decorator/form-group.decorator';
import {FORM_CONTROL_SUFFIX_METADATA_KEY} from './decorator/form-control.decorator';
import {UPDATE_ON_METADATA_KEY} from './decorator/update-on.decorator';
import {FORM_ARRAY_SUFFIX_METADATA_KEY, FormArrayContext} from './decorator/form-array.decorator';

function isAbstractControlOptions(options: AbstractControlOptions | { [key: string]: any }): options is AbstractControlOptions {
  return (options as AbstractControlOptions).asyncValidators !== undefined ||
    (options as AbstractControlOptions).validators !== undefined ||
    (options as AbstractControlOptions).updateOn !== undefined;
}

@Injectable()
export class NgxFormBuilder extends FormBuilder {

  public group<V>(controlsConfig: { [key: string]: any; }, options?: AbstractControlOptions | { [key: string]: any; } | null): NgxFormGroup<V> {
    const fg: FormGroup = super.group(controlsConfig, options);

    let validators: ValidatorFn | ValidatorFn[] | null = null;
    let asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | null = null;
    let updateOn: FormHooks | undefined;

    if (options != null) {
      if (isAbstractControlOptions(options)) {
        validators = options.validators != null ? options.validators : null;
        asyncValidators = options.asyncValidators != null ? options.asyncValidators : null;
        updateOn = options.updateOn != null ? options.updateOn : undefined;
      } else {
        validators = options[`validator`] != null ? options[`validator`] : null;
        asyncValidators = options[`asyncValidator`] != null ? options[`asyncValidator`] : null;
      }
    }

    return new NgxFormGroup(fg.controls, {asyncValidators, updateOn, validators});
  }

  public control(formState: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): NgxFormControl {
    return new NgxFormControl(formState, validatorOrOpts, asyncValidator);
  }

  public array(controlsConfig: any[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): NgxFormArray {
    return new NgxFormArray(controlsConfig, validatorOrOpts, asyncValidator);
  }

  public build<V>(rootGroupContext: FormGroupContext<V>, updateOn?: FormHooks): NgxFormGroup<V> {
    const form: NgxFormGroup<V> = this.group(
      {},
      {
        validators: [],
        asyncValidators: [],
        updateOn
      }
    );
    Reflect.defineMetadata(FORM_GROUP_METADATAKEY, rootGroupContext.type(), form);

    const controlContexts: { [key: string]: FormContextCommon<V> } = findPropertyFormContexts(rootGroupContext.type().prototype, FORM_CONTROL_SUFFIX_METADATA_KEY) || {};

    Object.keys(controlContexts).forEach((key: string) => {
      const controlConfiguration: FormContextCommon<V> = controlContexts[key];
      form.addControl(
        controlConfiguration.name,
        this.control(
          controlConfiguration.value || null,
          {
            validators: [],
            asyncValidators: [],
            updateOn: Reflect.getMetadata(`${ UPDATE_ON_METADATA_KEY }:${ key }`, rootGroupContext.type().prototype)
          }
        )
      )
    });

    const arrayContexts: { [key: string]: FormContextCommon<V> } = findPropertyFormContexts(rootGroupContext.type().prototype, FORM_ARRAY_SUFFIX_METADATA_KEY) || {};

    Object.keys(arrayContexts).forEach((key: string) => {
      const arrayContext: FormArrayContext<V> = arrayContexts[key] as FormArrayContext<V>;
      form.addControl(
        arrayContext.name,
        this.array(
          [],
          {
            validators: [],
            asyncValidators: [],
            updateOn: Reflect.getMetadata(`${ UPDATE_ON_METADATA_KEY }:${ key }`, rootGroupContext.type().prototype)
          }
        )
      )
    });

    const groupContexts: { [key: string]: FormContextCommon<V> } = findPropertyFormContexts(rootGroupContext.type().prototype, FORM_GROUP_SUFFIX_METADATA_KEY) || {};

    Object.keys(groupContexts).forEach((key: string) => {
      const groupContext: FormGroupContext<V> = groupContexts[key] as FormGroupContext<V>;
      const groupUpdateOn: FormHooks = Reflect.getMetadata(`${ UPDATE_ON_METADATA_KEY }:${ key }`, rootGroupContext.type().prototype) ||
        Reflect.getMetadata(`${ UPDATE_ON_METADATA_KEY }`, groupContext.type());
      form.addControl(
        groupContext.name,
        this.build(
          groupContext as FormGroupContext<V>,
          groupUpdateOn
        )
      );
    });

    return form;
  }
}
