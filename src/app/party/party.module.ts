import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RaveComponent} from './rave/rave.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{
  path: 'rave',
  component: RaveComponent
}];

@NgModule({
  declarations: [RaveComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class PartyModule {
}
