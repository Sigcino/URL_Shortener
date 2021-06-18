import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlComponent } from './url/url.component';

const routes: Routes = [
  { path: '',   redirectTo: '/UrlConverter', pathMatch: 'full' },
  { path: 'UrlConverter', component: UrlComponent } 
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
