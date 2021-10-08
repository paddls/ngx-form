import {NgxForm} from './ngx-form';

export interface NgxFormCollection extends NgxForm {

  markAllAsDirty(): void;

  markAllAsPending(): void;

  markAllAsPristine(): void;

  markAllAsUntouched(): void;
}
