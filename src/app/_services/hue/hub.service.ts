import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '../storage.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HubConfig} from '../../_interfaces/hub';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  constructor(private httpClient: HttpClient,
              private storageService: StorageService) {
  }

  public getToken(): string {
    return (this.storageService.get('hue_token') as string);
  }

  public hasToken(): boolean {
    return this.getToken() != null;
  }

  private setToken(token: string | null): void {
    token ? this.storageService.set('hue_token', token) : this.storageService.clear('hue_token');
  }

  public getHueIp(): string {
    return (this.storageService.get('hue_ip') as string);
  }

  public hasHueIp(): boolean {
    return this.getHueIp() != null;
  }

  private setHueIp(ip: string | null): void {
    ip ? this.storageService.set('hue_ip', ip) : this.storageService.clear('hue_ip');
  }

  public clearHub(): boolean {
    this.setHueIp(null);
    this.setToken(null);
    return true;
  }

  /**
   * Checks whether a given IP address is a valid Hue Hub
   * @param ip The IP address
   */
  public ipIsHub(ip: string): Promise<boolean> {
    return this.httpClient.get(`${ip}/api`).toPromise().then((value: any) => {
      return Array.isArray(value) && value.length === 1;
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
      });
    });
  }

  public getConfig(ip: string): Promise<HubConfig> {
    return this.httpClient.get<HubConfig>(`${ip}/api/${this.getToken()}/config`)
      .toPromise()
      .then((config) => {
        config.users = [];

        for (const [key, value] of Object.entries(config.whitelist)) {
          config.users.push({
            id: key,
            name: value.name,
            'create date': value['create date'],
            'last use date': value['last use date'],
          });
        }

        return config;
      });
  }
}
