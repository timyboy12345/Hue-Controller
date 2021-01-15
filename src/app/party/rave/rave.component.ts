import {Component, OnDestroy, OnInit} from '@angular/core';
import {Light} from '../../_interfaces/light';
import {LightService} from '../../_services/hue/light.service';
import {PopupService} from '../../_services/popup.service';
import {PopupType} from '../../_interfaces/popup';

@Component({
  selector: 'app-rave',
  templateUrl: './rave.component.html',
  styleUrls: ['./rave.component.scss']
})
export class RaveComponent implements OnInit, OnDestroy {
  public lights?: Light[];
  public canParty: boolean;
  public partyLights: Light[] = [];
  private interval: any;
  public shouldUpdate = false;
  private partyWasPlayed = false;
  public isPartying = false;

  private intervalDelay = 500;

  // private colors = [[0, 128, 255], [255, 0, 13], [43, 255, 0]];
  private colors = [
    [120, 28, 129],
    [64, 67, 153],
    [72, 139, 194],
    [107, 178, 140],
    [159, 190, 87],
    [210, 179, 63],
    [231, 126, 49],
    [217, 33, 32]
  ];

  constructor(private lightService: LightService,
              private popupService: PopupService) {
    this.canParty = false;
  }

  ngOnInit(): void {
    this.lightService.getLights()
      .then(value => {
        this.lights = value;
        this.canParty = true;

        this.interval = window.setInterval(() => {
          this.changePartyLights();
        }, this.intervalDelay);
      })
      .catch(reason => {
        console.error(reason);
        this.popupService.add('Kon lampen niet ophalen', 'Er ging iets mis met het ophalen van de lampen', PopupType.DANGER);
      });
  }

  ngOnDestroy(): void {
    this.canParty = false;
    this.disableParty();
    clearInterval(this.interval);
  }

  public enableParty(): void {
    this.partyLights.forEach(light => {
      light.saveState();
    });

    this.isPartying = true;
    this.partyWasPlayed = true;
    this.shouldUpdate = true;
  }

  public disableParty(): void {
    this.shouldUpdate = false;

    if (this.partyWasPlayed) {
      // Wait for the lights to go back to the previous state, so all transitions are finished
      window.setTimeout(() => {
        this.isPartying = false;

        this.partyLights.forEach(light => {
          light.restorePreviousState();
        });
      }, this.intervalDelay + 300);
    }
  }

  private changePartyLights(): void {
    if (this.shouldUpdate) {
      this.partyLights.forEach(light => {
        const d = Math.random();

        if (!light.isOn) {
          light.turnOn(1);
        } else {
          if (d > 0.5) {
            if (d > 0.85) {
              // Generate brightness between 155 and 255
              const brightness = Math.floor(Math.random() * 100) + 156;
              light.setBrightness(brightness, 1);
            } else {
              // Get a random color from the array
              const randomElement = this.colors[Math.floor(Math.random() * this.colors.length)];
              light.setRgbColor(randomElement[0], randomElement[1], randomElement[2], 1);
            }
          }
        }
      });
    }
  }

  public addLight(light: Light): void {
    if (!this.partyLights.includes(light) && !this.isPartying) {
      this.partyLights.push(light);
    }
  }

  public removeLight(light: Light): void {
    if (this.partyLights.includes(light) && !this.isPartying) {
      this.partyLights.splice(this.partyLights.indexOf(light), 1);
    }
  }
}
