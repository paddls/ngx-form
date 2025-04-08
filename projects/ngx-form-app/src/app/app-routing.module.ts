import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./not-empty/not-empty.component').then(m => m.NotEmptyComponent)
  },
  {
    path: 'empty',
    loadComponent: () => import('./empty/empty.component').then(m => m.EmptyComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
