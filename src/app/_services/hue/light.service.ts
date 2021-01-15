import {Injectable} from '@angular/core';
import {HubService} from './hub.service';
import {HttpClient} from '@angular/common/http';
import {Light} from '../../_interfaces/light';

@Injectable({
  providedIn: 'root'
})
export class LightService {

  constructor(private connectService: HubService,
              private httpClient: HttpClient,) {
  }

  public getLights(): Promise<Light[]> {
    return this.httpClient.get(`${this.connectService.getHueIp()}/api/${this.connectService.getToken()}/lights`)
      .toPromise()
      .then((lightsObject: any) => {
        return Object
          .keys(lightsObject)
          .map((key: string) => {
            return new Light(lightsObject[key], parseInt(key, 10), this);
          });
      });
  }

  public updateState(lightId: number, payload: any): Promise<any> {
    return this.httpClient.put(`${this.connectService.getHueIp()}/api/${this.connectService.getToken()}/lights/${lightId}/state`, payload).toPromise();
  }
}
