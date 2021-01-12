import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationItem} from './_interfaces/navigation-item';
import {PopupService} from './_services/popup.service';
import {Popup} from './_interfaces/popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Hue-Controller';
  public mobileMenuOpened: boolean;
  private listener: void;

  public get popups(): Popup[] {
    return this.popupService.getPopups();
  }

  constructor(public popupService: PopupService) {
    this.mobileMenuOpened = false;
  }

  public get itemsWithoutChildren(): NavigationItem[] {
    return this.items.filter(i => i.children == null);
  }

  public get itemsWithChildren(): NavigationItem[] {
    return this.items.filter(i => i.children != null);
  }

  public items: NavigationItem[] = [{
    title: 'Home',
    route: '/home',
    icon: 'home',
  }, {
    title: 'Settings',
    children: [{
      title: 'Hub',
      icon: 'settings',
      route: '/settings/settings',
    }, {
      title: 'Audio',
      icon: 'library_music',
      route: '/settings/audio',
    }, {
      title: 'Lampen',
      icon: 'lightbulb',
      route: '/settings/lights',
    }]
  }, {
    title: 'Feesten',
    children: [{
      title: 'Rave',
      route: '/party/rave',
      icon: 'music_note',
    }]
  }];

  ngOnDestroy(): void {
    this.listener = window.removeEventListener('keydown', this.mouseDown.bind(this));
  }

  ngOnInit(): void {
    window.addEventListener('keydown', this.mouseDown.bind(this));
  }

  private mouseDown(event: KeyboardEvent): any {
    if (event.key.toLowerCase() === 'escape' && this.mobileMenuOpened) {
      this.mobileMenuOpened = false;
    }
  }
}
