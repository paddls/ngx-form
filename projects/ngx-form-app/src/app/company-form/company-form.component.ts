import {Component, OnInit} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {NgxFormGroup} from '@paddls/ngx-form';
import {CompanyForm} from '../form/company.form';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  standalone: false
})
export class CompanyFormComponent implements OnInit {

  public companyForm: NgxFormGroup<CompanyForm>;

  public constructor(private readonly controlContainer: ControlContainer) {
  }

  public ngOnInit(): void {
    this.companyForm = this.controlContainer.control as NgxFormGroup<CompanyForm>;
  }
}
