import {Injectable} from '@angular/core';
import {FORM_GROUP_METADATAKEY, NgxFormGroup} from './model/ngx-form-group.model';
import {NgxFormBuilder} from './ngx-form.builder';
import {FORM_CONTROLS_METADATA_KEY, FormControlContextConfiguration} from './decorator/form-control.decorator';
import {FORM_ARRAYS_METADATA_KEY, FormArrayContextConfiguration} from './decorator/form-array.decorator';
import {FORM_GROUPS_METADATA_KEY, FormGroupContextConfiguration} from './decorator/form-group.decorator';

@Injectable()
export class NgxFormService {

  public constructor(protected readonly formBuilder: NgxFormBuilder) {
  }

  public build<V>(type: new(...args: any[]) => V): NgxFormGroup<V> {
    const form: NgxFormGroup<V> = this.formBuilder.group({});
    Reflect.defineMetadata(FORM_GROUP_METADATAKEY, type, form);

    const formControlContextConfiguration: FormControlContextConfiguration<any>[] = Reflect.getMetadata(FORM_CONTROLS_METADATA_KEY, type.prototype) || [];

    for(const formControlContextConfigurationElement of formControlContextConfiguration) {
      form.addControl(formControlContextConfigurationElement.name, this.formBuilder.control(formControlContextConfigurationElement.value || null, []));
    }

    const formArrayContextConfigurations: FormArrayContextConfiguration<any>[] = Reflect.getMetadata(FORM_ARRAYS_METADATA_KEY, type.prototype) || [];

    for(const formArrayContextConfiguration of formArrayContextConfigurations) {
      form.addControl(formArrayContextConfiguration.name, this.formBuilder.array(formArrayContextConfiguration.value || null, []));
    }

    const formGroupContextConfigurations: FormGroupContextConfiguration<any>[] = Reflect.getMetadata(FORM_GROUPS_METADATA_KEY, type.prototype) || [];

    for(const formGroupContextConfiguration of formGroupContextConfigurations) {
      form.addControl(formGroupContextConfiguration.name, this.build(formGroupContextConfiguration.type()));
    }

    return form;
  }
}
