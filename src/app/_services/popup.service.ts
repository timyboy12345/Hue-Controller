import {Injectable} from '@angular/core';
import {Popup, PopupType} from '../_interfaces/popup';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popups: Popup[] = [];

  constructor() {
  }

  public getPopups(): Popup[] {
    return this.popups;
  }

  public add(title: string, description: string, type: PopupType): Popup {
    const popup = new Popup(title, description, type, this);
    this.popups.push(popup);
    console.log(`${type} ${title}: ${description}`);
    window.alert(description);
    return popup;
  }

  public removePopupById(id: string): boolean {
    let index = -1;

    this.popups.forEach((popup, i) => {
      if (popup.id === id) {
        index = i;
        return;
      }
    });

    if (index >= 0) {
      this.popups.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}
