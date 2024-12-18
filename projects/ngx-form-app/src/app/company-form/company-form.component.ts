import { Component, inject, OnInit } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { NgxFormGroup } from '@paddls/ngx-form';
import { CompanyForm } from '../form/company.form';
import { AddressFormComponent } from '../address-form/address-form.component';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  imports: [
    ReactiveFormsModule,
    AddressFormComponent
  ]
})
export class CompanyFormComponent implements OnInit {

  private readonly controlContainer: ControlContainer = inject(ControlContainer);

  public companyForm: NgxFormGroup<CompanyForm>;

  public ngOnInit(): void {
    this.companyForm = this.controlContainer.control as NgxFormGroup<CompanyForm>;
  }
}
