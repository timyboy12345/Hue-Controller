import {Component, OnDestroy, OnInit} from '@angular/core';
import {Popup, PopupType} from '../../_interfaces/popup';
import {ConnectService} from '../../_services/hue/connect.service';
import {NewDecibelMeterService} from '../../_services/new-decibel-meter.service';
import {PopupService} from '../../_services/popup.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit, OnDestroy {
  public devices?: MediaDeviceInfo[];
  private shouldClosePopups: Popup[] = [];

  public get supportsAudioInput(): boolean {
    return this.newDecibelMeterService.supportsMicrophoneInput;
  }

  constructor(private connectService: ConnectService,
              private newDecibelMeterService: NewDecibelMeterService,
              private popupService: PopupService) {
  }

  ngOnInit(): void {
    this.newDecibelMeterService.supportsAudioInput()
      .then(() => {
        if (this.newDecibelMeterService.supportsMicrophoneInput) {
          window.setTimeout(() => {
            this.devices = this.newDecibelMeterService.getSources();

            this.newDecibelMeterService.connectToId(this.devices[0].deviceId, this.sourceChosen).then(value => {
              console.log(`Succesfully connected to source: ${value}`);

              this.newDecibelMeterService.listen();
            });
          }, 400);
        }
      })
      .catch(reason => {
        const popup = this.popupService.add('Geen toegang tot je microfoon', 'Geen toegang tot microfoons: ' + reason, PopupType.DANGER);
        this.shouldClosePopups.push(popup);
      });
  }

  public chooseSource(deviceId: string): void {
    this.newDecibelMeterService.connectToId(deviceId, this.sourceChosen);
  }

  private sourceChosen(event: any): void {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.newDecibelMeterService.disconnect();
    this.shouldClosePopups.forEach(p => p.close());
  }
}
