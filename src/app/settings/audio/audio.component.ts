import {Component, OnDestroy, OnInit} from '@angular/core';
import {Popup, PopupType} from '../../_interfaces/popup';
import {HubService} from '../../_services/hue/hub.service';
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
  private interval: any;

  public listening = false;
  public volume?: number;

  public get supportsAudioInput(): boolean {
    return this.newDecibelMeterService.supportsMicrophoneInput;
  }

  constructor(private connectService: HubService,
              private newDecibelMeterService: NewDecibelMeterService,
              private popupService: PopupService) {
  }

  ngOnInit(): void {
    this.newDecibelMeterService.supportsAudioInput()
      .then(() => {
        if (this.newDecibelMeterService.supportsMicrophoneInput) {
          window.setTimeout(() => {
            this.devices = this.newDecibelMeterService.getSources();

            this.newDecibelMeterService.connectToId(this.devices[0].deviceId, this.sourceChosen)
              .then(value => {
                console.log(`Succesfully connected to source: ${value}`);

                this.newDecibelMeterService.listen().then(() => {
                  this.listening = true;

                  this.interval = window.setInterval(() => {
                    this.getVolume();
                    console.log(this.volume);
                  }, 100);
                });
              })
              .catch(reason => {

              });
          }, 400);
        }
      })
      .catch(reason => {
        // const popup = this.popupService.add('Geen toegang tot je microfoon', 'Geen toegang tot microfoons: ' + reason, PopupType.DANGER);
        const popup = this.popupService.add('Geen toegang tot je microfoon', 'We hebben geen toegang tot je microfoon, heb je wel toestemming gegeven?', PopupType.DANGER);
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
    this.disconnect();
  }

  private disconnect(): void {
    clearInterval(this.interval);
    this.listening = false;
    this.newDecibelMeterService.disconnect();
    this.shouldClosePopups.forEach(p => p.close());
  }

  private getVolume(): void {
    this.volume = this.newDecibelMeterService.getVolume();
  }
}
