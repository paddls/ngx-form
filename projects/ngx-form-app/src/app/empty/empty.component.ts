import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty',
  template: '<a routerLink="/">NotEmpty</a>',
  imports: [
    RouterLink
  ]
})
export class EmptyComponent {
}
