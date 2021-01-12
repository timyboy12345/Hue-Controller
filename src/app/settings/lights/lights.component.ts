import {Component, OnDestroy, OnInit} from '@angular/core';
import {LightService} from '../../_services/hue/light.service';
import {Light} from '../../_interfaces/light';

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit {
  public lights?: Light[];

  constructor(private lightService: LightService) {
  }

  ngOnInit(): void {
    this.lightService.getLights().then(value => {
      this.lights = value;
    });
  }
}
