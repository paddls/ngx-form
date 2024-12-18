import { Observable } from 'rxjs';
import { Type } from '@angular/core';

export const DISABLE_ON_METADATA_KEY: string = 'ngx-form:disable-on';

export type DisableOnSimpleConfig = Observable<boolean>;

export type DisableOnConfigFactoryFn = (...providers: any[]) => DisableOnSimpleConfig;

export interface DisableOnConfigWithProviders {

  factory: DisableOnConfigFactoryFn;

  providers: Type<any>[];

}

export type DisableOnConfig = DisableOnSimpleConfig | DisableOnConfigWithProviders;

export interface DisableOnOptions {

  onlySelf?: boolean;

  emitEvent?: boolean;

}

export interface DisableOnContext {

  propertyKey?: string;

  config: DisableOnConfig;

  options?: DisableOnOptions;

}

export function DisableOn(config: DisableOnConfig, options?: DisableOnOptions): any {
  return (target: any, propertyKey = null): void => {
    const context: DisableOnContext = {propertyKey, config, options};

    let metas: DisableOnContext[] = [];
    if (Reflect.hasMetadata(DISABLE_ON_METADATA_KEY, target)) {
      metas = Reflect.getMetadata(DISABLE_ON_METADATA_KEY, target);
    }
    Reflect.defineMetadata(DISABLE_ON_METADATA_KEY, metas.concat(context), target);
  }
}
