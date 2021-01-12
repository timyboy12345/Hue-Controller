import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '../storage.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {

  constructor(private httpClient: HttpClient,
              private storageService: StorageService) {
  }

  public getToken(): string {
    return (this.storageService.get('hue_token') as string);
  }

  public hasToken(): boolean {
    return this.getToken() != null;
  }

  private setToken(token: string): void {
    this.storageService.set('hue_token', token);
  }

  public getHueIp(): string {
    return (this.storageService.get('hue_ip') as string);
  }

  public hasHueIp(): boolean {
    return this.getHueIp() != null;
  }

  private setHueIp(ip: string): void {
    this.storageService.set('hue_ip', ip);
  }

  public ipIsHub(ip: string): Promise<boolean> {
    return this.httpClient.get(`${ip}/api`).toPromise().then((value: any) => {
      if (Array.isArray(value) && value.length === 1) {
        return true;
      }

      return false;
    });
  }

  /**
   * Request a username from a hub
   * @param ip The ip the Hue Hub resides on
   * @param maxTries The maximum amount of tries, defaults to 10
   * @param intervalInSeconds The amount of seconds between each try, defaults to 1
   * @example requestToken('http://192.168.1.1', 5, 2)
   */
  public requestToken(ip: string, maxTries: number = 10, intervalInSeconds: number = 1): Promise<string> {
    return new Promise((resolve, reject) => {
      let realTries = 0;

      const interval = window.setInterval(() => {
        realTries++;

        if (realTries >= maxTries) {
          reject();
          clearInterval(interval);
        }

        this.requestTokenOnce(ip)
          .then(token => {
            if (token) {
              clearInterval(interval);
              this.setToken(token);
              this.setHueIp(ip);
              resolve(token);
            }
          })
          .catch(reason => {
            // Request failed
          });
      }, intervalInSeconds * 1000);
    });
  }

  private requestTokenOnce(ip: string): Promise<string> {
    const data = {
      devicetype: 'hue_party_app#web client'
    };

    return new Promise<string>((resolve, reject) => {
      return this.httpClient.post(`${ip}/api`, data).toPromise().then((value: any) => {
        if (Array.isArray(value) && value.length === 1) {
          if (value[0].error) {
            reject();
          }

          if (value[0].success) {
            resolve(value[0].success.username);
          }
        }

        reject();


        // [{
        //   "success": {
        //     "username": "g6ciMXgtvVIgRFUPWZlkCj4L47WfpUn7U0GsjYTQ"
        //   }
        // }]
      });
    });
  }
}
