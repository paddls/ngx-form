import { Component, inject, OnInit } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { AddressForm } from '../form/address.form';
import { NgxFormGroup } from '@paddls/ngx-form';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  imports: [
    ReactiveFormsModule
  ]
})
export class AddressFormComponent implements OnInit {

  private readonly controlContainer: ControlContainer = inject(ControlContainer);

  public addressForm: NgxFormGroup<AddressForm>;

  public ngOnInit(): void {
    this.addressForm = this.controlContainer.control as NgxFormGroup<AddressForm>;
  }
}
