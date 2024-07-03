import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app/app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AddressFormComponent} from './address-form/address-form.component';
import {CompanyFormComponent} from './company-form/company-form.component';
import {provideNgxForm} from "@paddls/ngx-form";

@NgModule({
  declarations: [
    AppComponent,
    AddressFormComponent,
    CompanyFormComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNgxForm()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
