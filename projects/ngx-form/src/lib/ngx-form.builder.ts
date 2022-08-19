import {Injectable} from '@angular/core';
import {AbstractControlOptions, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup, ValidatorFn} from '@angular/forms';
import {FORM_GROUP_INSTANCE_METADATA_KEY, NgxFormGroup} from './model/ngx-form-group.model';
import {FORM_CONTROL_INSTANCE_METADATA_KEY, NgxFormControl} from './model/ngx-form-control.model';
import {FORM_ARRAY_INSTANCE_METADATA_KEY, NgxFormArray} from './model/ngx-form-array.model';
import {findPropertyFormContexts, FormContextCommon, FormHooks} from './common/decorator.common';
import {FORM_GROUP_SUFFIX_METADATA_KEY, FormGroupContext} from './decorator/form-group.decorator';
import {FORM_CONTROL_SUFFIX_METADATA_KEY} from './decorator/form-control.decorator';
import {UPDATE_ON_METADATA_KEY} from './decorator/update-on.decorator';
import {FORM_ARRAY_SUFFIX_METADATA_KEY, FormArrayContext} from './decorator/form-array.decorator';
import {VALIDATORS_METADATA_KEY} from './decorator/validator.decorator';
import {ASYNC_VALIDATORS_METADATA_KEY} from './decorator/async-validator.decorator';
import {ConstructorFunction} from './common/common';
import {AsyncValidatorResolver} from './resolver/async-validator.resolver';

@Injectable()
export class NgxFormBuilder extends UntypedFormBuilder {

  public constructor(private readonly asyncValidatorResolver: AsyncValidatorResolver) {
    super();
  }

  public group<V>(controlsConfig: {[key: string]: any;}, options?: AbstractControlOptions | null): NgxFormGroup<V> {
    const fg: UntypedFormGroup = super.group(controlsConfig, options);

    return new NgxFormGroup<V>(fg.controls, {asyncValidators: fg.asyncValidator, updateOn: fg.updateOn, validators: fg.validator});
  }

  public control<V>(formState: V, options?: AbstractControlOptions | null): NgxFormControl<V> {
    return new NgxFormControl(formState, options);
  }

  public array<V>(controlsConfig: any[],
                  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): NgxFormArray<V> {
    return new NgxFormArray(this, controlsConfig, validatorOrOpts, asyncValidator);
  }

  public build<V>(rootGroupContext: FormGroupContext<V>, options?: AbstractControlOptions): NgxFormGroup<V> {
    const form: NgxFormGroup<V> = this.group(
      {},
      options
    );
    Reflect.defineMetadata(FORM_GROUP_INSTANCE_METADATA_KEY, rootGroupContext, form);

    const controlContexts: {[key: string]: FormContextCommon<any>} = findPropertyFormContexts(rootGroupContext.type().prototype, FORM_CONTROL_SUFFIX_METADATA_KEY) || {};
    Object.keys(controlContexts).forEach((key: string) => {
      const controlConfiguration: FormContextCommon<any> = controlContexts[key];
      form.addControl(controlConfiguration.name, this.buildControl<any, any>(key, controlConfiguration, rootGroupContext.type().prototype));
    });

    const arrayContexts: {[key: string]: FormContextCommon<any>} = findPropertyFormContexts(rootGroupContext.type().prototype, FORM_ARRAY_SUFFIX_METADATA_KEY) || {};
    Object.keys(arrayContexts).forEach((key: string) => {
      const arrayContext: FormArrayContext<any> = arrayContexts[key] as FormArrayContext<any>;
      const ngxFormArray: NgxFormArray<any> = this.buildArray<any, any>(key, arrayContext, rootGroupContext.type().prototype);
      form.addControl(arrayContext.name, ngxFormArray);
    });

    const groupContexts: {[key: string]: FormContextCommon<any>} = findPropertyFormContexts(rootGroupContext.type().prototype, FORM_GROUP_SUFFIX_METADATA_KEY) || {};
    Object.keys(groupContexts).forEach((key: string) => {
      const groupContext: FormGroupContext<any> = groupContexts[key] as FormGroupContext<any>;

      form.addControl(
        groupContext.name,
        this.buildGroup(key, groupContext, rootGroupContext.type().prototype)
      );
    });

    return form;
  }

  public buildControl<V, VC>(key: string, formContextCommon: FormContextCommon<VC>, groupType: ConstructorFunction<V>): NgxFormControl<VC> {
    const ngxFormControl: NgxFormControl<VC> = this.control(
      formContextCommon.defaultValue !== undefined ? formContextCommon.defaultValue : null,
      {
        validators: Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}:${key}`, groupType),
        asyncValidators: this.asyncValidatorResolver.resolve(Reflect.getMetadata(`${ASYNC_VALIDATORS_METADATA_KEY}:${key}`, groupType)),
        updateOn: Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}:${key}`, groupType)
      }
    );
    Reflect.defineMetadata(FORM_CONTROL_INSTANCE_METADATA_KEY, formContextCommon, ngxFormControl);

    return ngxFormControl;
  }

  public buildArray<V, VC>(key: string, arrayContext: FormArrayContext<VC>, groupType: ConstructorFunction<V>): NgxFormArray<VC> {
    const ngxFormArray: NgxFormArray<VC> = this.array<VC>(
      [],
      {
        validators: Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}:${key}`, groupType),
        asyncValidators: this.asyncValidatorResolver.resolve(Reflect.getMetadata(`${ASYNC_VALIDATORS_METADATA_KEY}:${key}`, groupType)),
        updateOn: Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}:${key}`, groupType)
      }
    );
    Reflect.defineMetadata(FORM_ARRAY_INSTANCE_METADATA_KEY, arrayContext, ngxFormArray);

    (arrayContext.defaultValues || []).forEach((value: VC) => ngxFormArray.add(value));

    return ngxFormArray;
  }

  public buildGroup<V, VC>(key: string, groupContext: FormGroupContext<VC>, groupType: ConstructorFunction<V>): NgxFormGroup<VC> {
    const groupValidators: ValidatorFn | ValidatorFn[] = Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}:${key}`, groupType) || Reflect.getMetadata(`${VALIDATORS_METADATA_KEY}`, groupContext.type());
    const groupAsyncValidators: AsyncValidatorFn | AsyncValidatorFn[] = this.asyncValidatorResolver.resolve(
      Reflect.getMetadata(`${ASYNC_VALIDATORS_METADATA_KEY}:${key}`, groupType) || Reflect.getMetadata(`${ASYNC_VALIDATORS_METADATA_KEY}`, groupContext.type())
    );
    const groupUpdateOn: FormHooks = Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}:${key}`, groupType) || Reflect.getMetadata(`${UPDATE_ON_METADATA_KEY}`, groupContext.type());

    const ngxFormGroup: NgxFormGroup<VC> = this.build<VC>(
      groupContext,
      {
        validators: groupValidators,
        asyncValidators: groupAsyncValidators,
        updateOn: groupUpdateOn
      }
    );
    Reflect.defineMetadata(FORM_GROUP_INSTANCE_METADATA_KEY, groupContext, ngxFormGroup);

    if (groupContext.defaultValue !== undefined) {
      ngxFormGroup.patchValue(groupContext.defaultValue);
    }

    return ngxFormGroup;
  }
}
