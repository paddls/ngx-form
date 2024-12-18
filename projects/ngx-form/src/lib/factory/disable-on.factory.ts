import { Type } from '@angular/core';
import { DisableOnConfigFactoryFn, DisableOnConfigWithProviders } from '../decorator/disable-on.decorator';

export class DisableOnFactory {

  public static of(factory: DisableOnConfigFactoryFn, providers: Type<any>[]): DisableOnConfigWithProviders {
    return {factory, providers};
  }

}
