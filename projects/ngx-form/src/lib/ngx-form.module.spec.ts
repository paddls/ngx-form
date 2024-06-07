import {TestBed, waitForAsync} from '@angular/core/testing';
import {NgxFormModule} from './ngx-form.module';
import {Injector} from '@angular/core';

describe('NgxFormModule', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxFormModule,
        Injector
      ]
    }).compileComponents();
  }));


  it('should be instantiated', () => {
    expect(NgxFormModule).toBeDefined();
  })
})
