# NGX-FORM

![ngx-form-ci](https://github.com/witty-services/ngx-form/workflows/build/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/witty-services/ngx-form/badge.svg?branch=master)](https://coveralls.io/github/witty-services/ngx-form?branch=master)
[![npm version](https://badge.fury.io/js/%40witty-services%2Fngx-form.svg)](https://badge.fury.io/js/%40witty-services%2Fngx-form)
![GitHub](https://img.shields.io/github/license/witty-services/ngx-form)
![GitHub repo size](https://img.shields.io/github/repo-size/witty-services/ngx-form)
![GitHub last commit](https://img.shields.io/github/last-commit/witty-services/ngx-form)
![GitHub issues](https://img.shields.io/github/issues/witty-services/ngx-form)
![GitHub top language](https://img.shields.io/github/languages/top/witty-services/ngx-form)

Model based typed reactive forms made easy.

## Summary

* [How to install](#how-to-install)
* [Basic usage](#basic-usage)
    * [Create a form](#create-a-form)
    * [Build a form](#build-a-form)
* [Nested forms](#nested-forms)
* [Install and build project](#install-and-build-project)


## How to install

First install the library in your project :

```shell script
npm install --save @witty-services/ngx-form
```

After that, import `NgxFormModule` as follows : 

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { NgxFormModule } from '@witty-services/ngx-form';

@NgModule({
    imports: [
        ReactiveFormsModule,
        NgxFormModule
    ]
})
export class AppModule {
}
```

## Basic usage

### Create a form

With ngx-form, the form creation is model driven. 
Therefore, to create a form, you need to create a model class 
which will represent the form.

A form model should look like this : 

```typescript
import {FormControl} from '@witty-services/ngx-form';

export class AddressForm {

  @FormControl({value: 3})
  public streetNumber: number;

  @FormControl({value: 'Kennedy Street'})
  public route: string;

  @FormControl({value: '10055'})
  public zipCode: string;

  @FormControl()
  public city: string;
}
```

Each class attribute with the ``@FormControl()`` decorator will 
be marked as a form control.
You can specify a default value by adding it to the decorator context.

### Build a form

Once you've created the model, you can build the form wherever you 
like through your entire Angular application using the ``@Form()`` decorator.

```typescript
import {Component} from '@angular/core';
import {Form, NgxFormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @Form(() => AddressForm)
  public addressForm: NgxFormGroup<AddressForm>;

  public onSubmit(): void {
    console.log(this.addressForm.getValue());
  }
}
```

That's it ! You can now use your newly created form juste like 
any other reactive form.
Furthermore, the form is strongly typed. To retrieve the strongly 
typed result, just call ```form.getValue()``` method.

## Nested forms

```typescript
import {FormControl, FormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './address.form';

export class UserForm {

  @FormControl({value: 'Thomas'})
  public firstName: string;

  @FormControl({value: 'Nisole'})
  public lastName: string;

  @FormGroup({
    type: () => AddressForm
  })
  public address: AddressForm;
}
```

To nest forms, use the ```@FormGroup()``` decorator. Do not forget
to specify the type of your child form in the decorator context.

## Install and build project

To install and build the project, you just have to clone the repository and install dependencies : 

````shell script
npm i
````

Once you've completed the installation, other available commands are :

````shell script
# Run tests
npm run test

# Run linter
npm run lint

# Run sample app
npm run start
````
