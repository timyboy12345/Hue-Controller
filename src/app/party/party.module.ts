import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RaveComponent} from './rave/rave.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../_components/_components.module';

const routes: Routes = [{
  path: 'rave',
  component: RaveComponent
}];

@NgModule({
  declarations: [RaveComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class PartyModule {
}
