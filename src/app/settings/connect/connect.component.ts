import {Component, OnDestroy, OnInit} from '@angular/core';
import {HubService} from '../../_services/hue/hub.service';
import {PopupService} from '../../_services/popup.service';
import {PopupType} from '../../_interfaces/popup';
import {HubConfig} from '../../_interfaces/hub';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit, OnDestroy {
  public ip = 'http://';
  public canSubmit: boolean;
  public connectedIp?: string;
  public config?: HubConfig;

  constructor(private popupService: PopupService,
              private connectService: HubService) {
    this.canSubmit = false;
    this.connectedIp = undefined;
  }


  ngOnInit(): void {
    this.canSubmit = true;

    if (this.connectService.hasHueIp()) {
      this.connectedIp = this.connectService.getHueIp();
      this.getConfig();
    }
  }

  ngOnDestroy(): void {
  }

  public submitIp(): void {
    const ip = this.ip;

    if (ip && this.canSubmit) {
      this.canSubmit = false;
      this.connectService.ipIsHub(ip)
        .then(isValidHub => {
          console.log(isValidHub);
          if (isValidHub) {
            this.connectService.requestToken(ip, 5, 5)
              .then(value => {
                console.log(value);
                this.connectedIp = ip;
                this.popupService.add('Verbonden!', 'We zijn verbonden met een hub!', PopupType.SUCCESS);
                this.getConfig();
              })
              .catch(reason => {
                console.log(reason);
                this.canSubmit = true;
                this.popupService.add('Kon niet verbinden',
                  'De knop op de hub is waarschijnlijk niet op tijd ingedrukt', PopupType.WARNING);
              });
          } else {
            this.canSubmit = true;
            this.popupService.add('IP niet geldig', 'Er is geen hub aangesloten op dit IP-adres', PopupType.WARNING);
          }
        })
        .catch(() => {
          this.canSubmit = true;
          this.popupService.add('IP niet geldig', 'Er is geen hub aangesloten op dit IP-adres', PopupType.WARNING);
        });
    } else {
      this.popupService.add('Voer een geldig IP-adres in', 'Het ingevoerde IP adres is niet geldig', PopupType.WARNING);
    }
  }

  public remove(): void {
    this.connectService.clearHub();
    this.config = undefined;
    this.connectedIp = undefined;
  }

  private getConfig(): void {
    this.connectService.getConfig(this.connectService.getHueIp())
      .then(config => {
        this.config = config;
        console.log(config);
      });
  }
}
