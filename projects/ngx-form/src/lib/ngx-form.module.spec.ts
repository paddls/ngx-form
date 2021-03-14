import {async, TestBed} from '@angular/core/testing';
import {NgxFormModule} from './ngx-form.module';

describe('NgxFormModule', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxFormModule
      ]
    }).compileComponents();
  }));


  it('should be instantiated', () => {
    expect(NgxFormModule).toBeDefined();
  })
})
