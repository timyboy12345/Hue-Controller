import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {HasUsernameGuardGuard} from './_guards/has-username-guard.guard';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent,
}, {
  path: 'settings',
  loadChildren: () => import('./settings/settings.module').then(value => value.SettingsModule)
}, {
  path: 'party',
  loadChildren: () => import('./party/party.module').then(value => value.PartyModule),
  canActivate: [HasUsernameGuardGuard]
}, {
  pathMatch: 'full',
  path: '**',
  redirectTo: '/home',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
