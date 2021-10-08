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
* [FormGroup](#formgroup)
* [FormArray](#formarray)
* [Validator, AsyncValidator and UpdateOn](#validator-asyncvalidator-and-updateon)
* [FormChild](#formchild)
* [Form lifecycle](#form-lifecycle)
  * [getValue()](#getvalue)
  * [setValue()](#setvalue)
  * [patchValue()](#patchvalue)
  * [restore()](#restore)
  * [empty()](#empty)
  * [cancel()](#cancel)
  * [markAllAsDirty()](#markallasdirty)
  * [markAllAsPending()](#markallaspending)
  * [markAllAsPristine()](#markallaspristine)
  * [markAllAsUntouched()](#markallasuntouched)
  * [add()](#add)
* [Install and build project](#install-and-build-project)

## How to install

First install the library in your project :

```shell script
npm install --save @witty-services/ngx-form
```

After that, import `NgxFormModule` as follows :

```typescript
import {ReactiveFormsModule} from '@angular/forms';
import {NgxFormModule} from '@witty-services/ngx-form';

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

With ngx-form, the form creation is model driven. Therefore, to create a form, you need to create a model class which
will represent the form.

A form model should look like this :

```typescript
import {FormControl} from '@witty-services/ngx-form';

export class AddressForm {

  @FormControl()
  public city: string;

  @FormControl({defaultValue: 3})
  public streetNumber: number;

  @FormControl({defaultValue: '10055', name: 'postalCode'})
  public zipCode: string;

  @FormControl('street')
  public route: string;

  public constructor(data: Partial<AddressForm> = {}) {
    Object.assign(this, data);
  }
}
```

Each class attribute with the ``@FormControl()`` decorator will be marked as a form control. Inside
the ``@FormControl()`` annotation, you can add some context at your will. Two properties are
available : ``defaultValue`` and ``name``.

By specifying a ``defaultValue``, the form control will be initialized with this value at the form creation.

With the ``name`` property, you can differentiate the name given to the field in your model and the name of the control
in the created form.

You can define only one of the properties in the context, or both. If you just want to specify the
``name`` property, you can do it just by passing a string as the context like in the example above.

### Build a form

Once you've created the model, you can build the form wherever you like through your entire Angular application using
the ``@BuildForm()`` decorator.

```typescript
import {Component} from '@angular/core';
import {BuildForm, NgxFormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @BuildForm(() => AddressForm)
  public addressForm: NgxFormGroup<AddressForm>;

  public onSubmit(): void {
    console.log(this.addressForm.getValue());
  }
}
```

That's it ! You can now use your newly created form juste like any other reactive form. Furthermore, the form is
strongly typed. To retrieve the strongly typed result, just call ``form.getValue()`` method.

## FormGroup

```typescript
import {FormControl, FormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './address.form';

export class UserForm {

  @FormControl({value: 'Brad'})
  public firstName: string;

  @FormControl({value: 'Pitt'})
  public lastName: string;

  @FormGroup(() => AddressForm)
  public personalAddress: AddressForm;

  @FormGroup({type: () => AddressForm, defaultValue: myAddressValue, name: 'companyAddress'})
  public workAddress: AddressForm;
}
```

To nest forms, use the ``@FormGroup()`` decorator. Do not forget to specify the type of your child form in the decorator
context.

You can also specify ``defaultValue`` and ``name`` properties if necessary. If you don't need to specify them, you can
specify the type in the context directly like in the example above.

## FormArray

```typescript
import {FormControl, FormArray} from '@witty-services/ngx-form';
import {CompanyForm} from './company.form';

export class UserForm {

  @FormControl({defaultValue: 'Leonardo'})
  public firstName: string;

  @FormControl()
  public lastName: string;

  @FormArray({defaultValue: 'Default skill', defaultValues: ['Java', 'C++'], updateOn: 'blur', name: 'userSkills'})
  public skills: string[];

  @FormArray(() => CompanyForm)
  public companies: CompanyForm[];
}
```

To add a ``FormArray`` to your form model, just add an attribute with the ``@FormArray()``
decorator. Again, you can specify ``defaultValue`` and ``name`` properties if necessary. Like with the ``@FormGroup()``
decorator, you can specify a type if you wish to create an array of nested forms.

Additionally, you can add ``defaultValues`` or ``updateOn`` properties to the context.

Like with the ``@FormControl()`` or ``@FormGroup()`` decorators, shorthands for ``name`` and ``type``
properties are available. Just specify the properties directly in the context if they are the only property used.

## Validator, AsyncValidator and UpdateOn

```typescript
import {FormControl, FormGroup, UpdateOn, Validator, AsyncValidator} from '@witty-services/ngx-form';
import {AddressForm} from './address.form';
import {clone} from 'lodash';
import {Validators} from '@angular/forms';

@UpdateOn('change')
export class UserForm {

  @FormControl({defaultValue: 'Thomas'})
  @Validator(Validators.required)
  @UpdateOn('blur')
  public firstName: string;

  @AsyncValidator(myAsyncValidator)
  @FormControl('lastname')
  public lastName: string;

  @Validator([Validators.required, Validators.min(0)])
  public age: number;

  @FormGroup({type: () => AddressForm, defaultValue: clone(defaultAddress)})
  @UpdateOn('submit')
  public personalAddress: AddressForm;
}
```

To add Validators, AsyncValidators or specify the ``updateOn`` property on any form, ``FormControl``,
``FormGroup`` or ``FormArray``, just add a ``@Validator``, ``@AsyncValidator`` or ``@UpdateOn`` decorator on any form
model attribute or on the form model class if you want to apply it to a form.

The ``@Validator`` or ``@AsyncValidator`` decorators take any ``ValidatorFn``, ``AsyncValidatorFn`` or arrays of
``ValidatorFn`` and ``AsyncValidatorFn`` as parameters to apply them to the desired control or form. The
``@UpdateOn`` decorator takes ``'change'``, ``'blur'`` or ``'submit'`` value as parameter to apply it to the desired
control or form.

## FormChild

```typescript
import {Component} from '@angular/core';
import {BuildForm, FormChild, NgxFormArray, NgxFormGroup} from '@witty-services/ngx-form';
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

  @FormChild({attribute: 'userForm', path: 'skills'})
  public skillForms: NgxFormArray<string>;

  @FormChild({attribute: 'userForm', path: 'companies'})
  public companyForms: NgxFormArray<CompanyForm>;
}
```

``@FormChild`` attribute can be used to access a subform of a built parent form directly. To do that, add an attribute
with the ``@FormChild`` decorator in the same class as your built parent form. Just specify the attribute name of the
parent form with the ``attribute``
decorator parameter, the ``path`` of the form child you want to directly access, and you're done !

## Form lifecycle

A `NgxForm` object exposes the following methods :

### getValue()

Returns the current strongly typed value of the form.

```typescript
import {Component} from '@angular/core';
import {BuildForm, NgxFormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @BuildForm(() => AddressForm)
  public addressForm: NgxFormGroup<AddressForm>;

  public onSubmit(): void {
    console.log(this.addressForm.getValue());
  }
}
```

### setValue()

Sets a new value on the form. The behaviour of this method is similar to classic reactive forms.

```typescript
import {Component} from '@angular/core';
import {BuildForm, NgxFormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @BuildForm(() => AddressForm)
  public addressForm: NgxFormGroup<AddressForm>;

  public constructor() {
    this.addressForm.setValue(new AddressForm({city: 'New York City'}))
  }
}
```

### patchValue()

Patches a new value on the form. The behaviour of this method is similar to classic reactive forms.

```typescript
import {Component} from '@angular/core';
import {BuildForm, NgxFormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @BuildForm(() => AddressForm)
  public addressForm: NgxFormGroup<AddressForm>;

  public constructor() {
    this.addressForm.patchValue(new AddressForm({city: 'New York City'}))
  }
}
```

### restore()

Restores the form value to the initial value. Each control initial value is defined with the ``defaultValue`` attribute
available in the ``@FormControl()``, ``@FormGroup()`` and ``@FormArray()`` decorators.

```typescript
import {Component} from '@angular/core';
import {BuildForm, NgxFormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @BuildForm(() => AddressForm)
  public addressForm: NgxFormGroup<AddressForm>;

  public onRestore(): void {
    this.addressForm.restore();
  }
}
```

### empty()

Empties all values of the form. This calls ``reset()`` method on each form control and ``clear()`` method on all form
arrays.

```typescript
import {Component} from '@angular/core';
import {BuildForm, NgxFormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @BuildForm(() => AddressForm)
  public addressForm: NgxFormGroup<AddressForm>;

  public onRestore(): void {
    this.addressForm.empty();
  }
}
```

### cancel()

Cancels the last ``setValue()`` applied on the form.

```typescript
import {Component} from '@angular/core';
import {BuildForm, NgxFormGroup} from '@witty-services/ngx-form';
import {AddressForm} from './form/address.form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @BuildForm(() => AddressForm)
  public addressForm: NgxFormGroup<AddressForm>;

  public onRestore(): void {
    this.addressForm.cancel();
  }
}
```

### markAllAsDirty()

Sets all controls to ``DIRTY`` state.

### markAllAsPending()

Sets all controls to ``PENDING`` state.

### markAllAsPristine()

Sets all controls to ``PRISTINE`` state.

### markAllAsUntouched()

Sets all controls to ``UNTOUCHED`` state.

### add()

Adds a new element to a form array. Prefer this method over ``push()`` method available on classic reactive forms as you
don't need to explicitly pass a new form control to add : by default, NgxForm will add a new instance of the type of the
form array. You can set a default value to the new element and set a specific index.

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
