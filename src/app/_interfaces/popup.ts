import { v4 as uuidv4 } from 'uuid';
import {PopupService} from '../_services/popup.service';

export class Popup {
  public id: string;
  public title: string;
  public content: string;
  public type: PopupType;

  constructor(title: string, content: string, type: PopupType, private popupService: PopupService) {
    this.id = uuidv4();
    this.title = title;
    this.content = content;
    this.type = type;
  }

  public close(): void {
    this.popupService.removePopupById(this.id);
  }
}

export enum PopupType {
  DANGER = 'DANGER',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}
