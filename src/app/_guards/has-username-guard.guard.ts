import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {HubService} from '../_services/hue/hub.service';
import {PopupService} from '../_services/popup.service';
import {PopupType} from '../_interfaces/popup';

@Injectable({
  providedIn: 'root'
})
export class HasUsernameGuardGuard implements CanActivate {
  constructor(private connectService: HubService,
              private popupService: PopupService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.connectService.hasToken()) {
      this.popupService.add('No hub is connected!', 'You haven\'t connected a hub to this application', PopupType.DANGER);
    }

    return this.connectService.hasToken();
  }

}
