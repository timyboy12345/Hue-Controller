import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectComponent } from './connect/connect.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../_components/_components.module';
import { LightsComponent } from './lights/lights.component';
import { AudioComponent } from './audio/audio.component';
import {HasUsernameGuardGuard} from '../_guards/has-username-guard.guard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [{
  path: 'settings',
  component: ConnectComponent
}, {
  path: 'audio',
  component: AudioComponent
}, {
  path: 'lights',
  component: LightsComponent,
  canActivate: [HasUsernameGuardGuard],
}, {
  path: '**',
  pathMatch: 'full',
  redirectTo: 'settings'
}];

@NgModule({
  declarations: [ConnectComponent, LightsComponent, AudioComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule]
})
export class SettingsModule { }
