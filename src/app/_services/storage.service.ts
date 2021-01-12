import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  public get(key: string, isJson: boolean = false): string | null {
    const item = window.localStorage.getItem(key);

    if (isJson && item != null) {
      return JSON.parse(item);
    } else {
      return item;
    }
  }

  public set(key: string, content: any, isJson: boolean = false): boolean {
    let item = content;

    if (isJson) {
      item = JSON.stringify(item);
    }

    window.localStorage.setItem(key, item);
    return true;
  }
}
