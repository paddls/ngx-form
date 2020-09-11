import {Component} from '@angular/core';
import {Form} from '@witty-services/ngx-form';
import {UserForm} from './form/user.form';
import {NgxFormGroup} from '../../../ngx-form/src/lib/model/ngx-form-group.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @Form(() => UserForm)
  public userForm: NgxFormGroup<UserForm>;

  public onSubmit(): void {
    console.log(UserForm.prototype);
    console.log(Reflect.getMetadataKeys(UserForm.prototype, 'firstName'));

    console.log(this.userForm);
    console.log(this.userForm.getValue());
  }
}
