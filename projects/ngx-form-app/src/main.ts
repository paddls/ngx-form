import { enableProdMode, importProvidersFrom } from '@angular/core';


import { environment } from './environments/environment';
import { provideNgxForm } from '@paddls/ngx-form';
import { AppRoutingModule } from './app/app-routing.module';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule, BrowserModule, ReactiveFormsModule),
    provideNgxForm()
  ]
})
  .catch((err: any) => console.error(err));
