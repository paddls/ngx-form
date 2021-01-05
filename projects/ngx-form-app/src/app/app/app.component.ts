import {Component} from '@angular/core';
import {BuildForm, FormChild, NgxFormArray, NgxFormGroup} from '@witty-services/ngx-form';
import {UserForm} from '../form/user.form';
import {CompanyForm} from '../form/company.form';
import {AddressForm} from '../form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @BuildForm(() => UserForm)
  public userForm: NgxFormGroup<UserForm>;

  @FormChild({attribute: 'userForm', path: 'skills'})
  public skillForms: NgxFormArray<string>;

  @FormChild({attribute: 'userForm', path: 'companies'})
  public companyForms: NgxFormArray<CompanyForm>;

  private valueToSet: UserForm = new UserForm({
    firstName: 'Thomas',
    lastName: 'Nisole',
    skills: ['Angular', 'NestJS'],
    personalAddress: new AddressForm({
      city: 'Cesson',
      route: 'rue des Myosotis',
      streetNumber: 1,
      zipCode: '35510'
    }),
    companies: [
      new CompanyForm({
        name: 'Witty SARL',
        address: new AddressForm({
          city: 'Cesson',
          route: 'a rue des Charmilles',
          streetNumber: 7,
          zipCode: '35510'
        }),
        siret: '1010101010101010'
      })

    ]
  });

  public constructor() {
    console.log(this.userForm);
  }

  public onResetForm(): void {
    this.userForm.reset();
  }

  public onRestore(): void {
    this.userForm.restore();
  }

  public onEmpty(): void {
    this.userForm.empty();
  }

  public onCancel(): void {
    this.userForm.cancel();
  }

  public onLoadUserProfile(): void {
    this.userForm.setValue(this.valueToSet);

    setTimeout(() => {
      this.userForm.patchValue(new UserForm({
        companies: [...this.userForm.getValue().companies, new CompanyForm({
          name: 'Romain SA',
          address: new AddressForm({
            city: 'Cesson',
            route: 'a rue des Charmilles',
            streetNumber: 7,
            zipCode: '35510'
          }),
          siret: '1010101010101010'
        })]
      }));
    }, 2000);
  }

  public onAddSkill(): void {
    this.skillForms.add();
  }

  public onAddCompany(): void {
    this.companyForms.add();
  }

  public onSubmit(): void {
    console.log(this.userForm);
    console.log(this.userForm.getValue());
    console.log(this.userForm.value);
  }
}
