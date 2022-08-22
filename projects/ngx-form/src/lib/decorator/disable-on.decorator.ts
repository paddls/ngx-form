export const DISABLE_ON_METADATA_KEY: string = 'ngx-form:disable-on';

export interface DisableOnSimpleConfig {

}

export interface DisableOnConfigWithProviders {

}

export type DisableOnConfig = DisableOnSimpleConfig | DisableOnConfigWithProviders;

export interface DisableOnContext {

  propertyKey: string;

  config: DisableOnConfig;

}

export function DisableOn(config: DisableOnConfig): any {
  return (target: any, propertyKey): void => {
    const context: DisableOnContext = {propertyKey, config};

    let metas: DisableOnContext[] = [];
    if (Reflect.hasMetadata(DISABLE_ON_METADATA_KEY, target)) {
      metas = Reflect.getMetadata(DISABLE_ON_METADATA_KEY, target);
    }
    Reflect.defineMetadata(DISABLE_ON_METADATA_KEY, metas.concat(context), target);
  }
}
