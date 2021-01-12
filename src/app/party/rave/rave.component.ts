import {Component, OnDestroy, OnInit} from '@angular/core';
import {Light} from '../../_interfaces/light';
import {LightService} from '../../_services/hue/light.service';

@Component({
  selector: 'app-rave',
  templateUrl: './rave.component.html',
  styleUrls: ['./rave.component.scss']
})
export class RaveComponent implements OnInit, OnDestroy {
  public lights?: Light[];
  public partyLights: Light[] = [];
  private interval: any;
  public shouldUpdate = false;
  private partyWasPlayed = false;

  private intervalDelay = 1000;

  private colors = [[0, 128, 255], [255, 0, 13], [43, 255, 0]];

  constructor(private lightService: LightService) {
  }

  ngOnInit(): void {
    this.lightService.getLights().then(value => {
      this.lights = value;

      this.lights.forEach(light => {
        if (light.name.includes('Centris')) {
          this.partyLights.push(light);
        }
      });

      this.interval = window.setInterval(() => {
        this.changePartyLights();
      }, this.intervalDelay);
    });
  }

  ngOnDestroy(): void {
    this.disableParty();
    clearInterval(this.interval);
  }

  public enableParty(): void {
    this.partyLights.forEach(light => {
      light.saveState();
    });

    this.partyWasPlayed = true;
    this.shouldUpdate = true;
  }

  public disableParty(): void {
    this.shouldUpdate = false;

    if (this.partyWasPlayed) {
      // Wait for the lights to go back to the previous state, so all transitions are finished
      window.setTimeout(() => {
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

        if (d > 0.3) {
          light.turnOn(1);

          // Generate brightness between 155 and 255
          const brightness = Math.floor(Math.random() * 100) + 156;
          light.setBrightness(brightness, 1);

          const randomElement = this.colors[Math.floor(Math.random() * this.colors.length)];
          light.setRgbColor(randomElement[0], randomElement[1], randomElement[2], 1);
        }
      });
    }
  }
}
