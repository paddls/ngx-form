import {Injectable} from '@angular/core';
import {ConstructorFunction} from '../common/common';
import {NgxFormGroup} from '../model/ngx-form-group.model';
import {DISABLE_ON_METADATA_KEY, DisableOnConfig} from '../decorator/disable-on.decorator';

@Injectable()
export class DisableOnHandler {

  public subscribe<T>(type: () => ConstructorFunction<T>, instance: NgxFormGroup<T>): void {
    if (!Reflect.hasMetadata(DISABLE_ON_METADATA_KEY, type().prototype)) {
      return;
    }

    const configs: DisableOnConfig[] = Reflect.getMetadata(DISABLE_ON_METADATA_KEY, type().prototype);

    console.log(configs);
  }

}
