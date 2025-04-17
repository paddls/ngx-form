import { Component, DestroyRef, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressFormComponent } from '../address-form/address-form.component';
import { CompanyFormComponent } from '../company-form/company-form.component';
import { UserForm } from '../form/user.form';
import { CompanyForm } from '../form/company.form';
import { SignupForm } from '../form/signup.form';
import { AddressForm } from '../form/address.form';
import { BuildForm, FormChild, NgxFormArray, NgxFormGroup } from '@paddls/ngx-form';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-empty',
  templateUrl: 'not-empty.component.html',
  imports: [
    ReactiveFormsModule,
    AddressFormComponent,
    CompanyFormComponent,
    RouterLink
  ]
})
export class NotEmptyComponent {

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  @BuildForm(() => UserForm, {unsubscribeOn: '_destroyRef'})
  public readonly userForm: NgxFormGroup<UserForm>;

  @FormChild({attribute: 'userForm', path: 'skills'})
  public readonly skillForms: NgxFormArray<string>;

  @FormChild({attribute: 'userForm', path: 'companies'})
  public readonly companyForms: NgxFormArray<CompanyForm>;

  @BuildForm(() => SignupForm)
  public readonly signUpForm: NgxFormGroup<SignupForm>;

  private valueToSet: UserForm = new UserForm({});

  public constructor() {
    this.userForm.controls.personalAddress.

    console.log(this.signUpForm);
  }

  public onResetForm(): void {
    this.userForm.reset();
    this.signUpForm.reset();
  }

  public onRestore(): void {
    this.userForm.restore();
    this.signUpForm.restore();
  }

  public onEmpty(): void {
    this.userForm.empty();
    this.signUpForm.empty();
  }

  public onCancel(): void {
    this.userForm.cancel();
    this.signUpForm.cancel();
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

  public onSubmitSignUp(): void {
    console.log(this.signUpForm);
    console.log(this.signUpForm.getValue());
    console.log(this.signUpForm.value);
  }
}
