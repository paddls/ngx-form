import {Component, OnInit} from '@angular/core';
import {ControlContainer, ReactiveFormsModule} from '@angular/forms';
import {AddressForm} from '../form/address.form';
import {NgxFormGroup} from '@paddls/ngx-form';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  imports: [
    ReactiveFormsModule
  ]
})
export class AddressFormComponent implements OnInit {

  public addressForm: NgxFormGroup<AddressForm>;

  public constructor(private readonly controlContainer: ControlContainer) {
  }

  public ngOnInit(): void {
    this.addressForm = this.controlContainer.control as NgxFormGroup<AddressForm>;
  }
}
