import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app/app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxFormModule} from '@paddls/ngx-form';
import {AddressFormComponent} from './address-form/address-form.component';
import {CompanyFormComponent} from './company-form/company-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AddressFormComponent,
    CompanyFormComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    NgxFormModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
