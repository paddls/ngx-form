import {Component} from '@angular/core';
import {BuildForm, NgxFormArray, NgxFormBuilder, NgxFormGroup} from '@witty-services/ngx-form';
import {UserForm} from '../form/user.form';
import {CompanyForm} from '../form/company.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @BuildForm(() => UserForm)
  public userForm: NgxFormGroup<UserForm>;

  public companyForms: NgxFormArray;

  public constructor(formBuilder: NgxFormBuilder) {
    console.log(this.userForm);
    this.companyForms = this.userForm.get('companies') as NgxFormArray;
    (this.userForm.get('companies') as NgxFormArray).push(formBuilder.build({type: () => CompanyForm}));
  }

  public onSubmit(): void {
    console.log(this.userForm);
    console.log(this.userForm.getValue());
  }
}
