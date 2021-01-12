import {ILight, LightCapabilities, LightConfig, LightState, LightSwUpdate} from './ilight';
import {LightService} from '../_services/hue/light.service';
import {ColorConverterService} from '../_services/helpers/color-converter.service';

export class Light {
  public static DEFAULT_TRANSITION_TIME = 4;

  capabilities: LightCapabilities;
  config: LightConfig;
  manufacturerName: string;
  modelId: string;
  name: string;
  productId: string;
  productName: string;
  state: LightState;
  swConfigId: string;
  swUpdate: LightSwUpdate;
  swVersion: number;
  type: string;
  uniqueId: string;

  protected previousState?: LightState;

  protected houseId: number;

  constructor(light: ILight, houseId: number, private lightService: LightService) {
    this.capabilities = light.capabilities;
    this.config = light.config;
    this.manufacturerName = light.manufacturername;
    this.modelId = light.modelid;
    this.name = light.name;
    this.productId = light.productid;
    this.productName = light.productname;
    this.state = light.state;
    this.swConfigId = light.swconfigid;
    this.swUpdate = light.swupdate;
    this.swVersion = light.swversion;
    this.type = light.type;
    this.uniqueId = light.uniqueid;
    this.houseId = houseId;
  }

  public getInfo(): ILight {
    return {
      capabilities: this.capabilities,
      config: this.config,
      manufacturername: this.manufacturerName,
      modelid: this.modelId,
      name: this.name,
      productid: this.productId,
      productname: this.productName,
      state: this.state,
      swconfigid: this.swConfigId,
      swupdate: this.swUpdate,
      swversion: this.swVersion,
      type: this.type,
      uniqueid: this.uniqueId
    };
  }

  public turnOn(transitionTime: number = Light.DEFAULT_TRANSITION_TIME): Promise<void> {
    return this.lightService.updateState(this.houseId, {
      on: true,
      transitiontime: transitionTime
    }).then(() => {
      this.state.on = true;
    });
  }

  public turnOff(transitionTime: number = Light.DEFAULT_TRANSITION_TIME): Promise<void> {
    return this.lightService.updateState(this.houseId, {
      on: false,
      transitiontime: transitionTime
    }).then(() => {
      this.state.on = false;
    });
  }

  public get isOn(): boolean {
    return this.state.on;
  }

  public setBrightness(brightness: number, transitionTime: number = Light.DEFAULT_TRANSITION_TIME): Promise<void> {
    if (brightness < 1 || brightness > 255) {
      throw new Error('Brightness can\'t be below 1 or above 255');
    }

    return this.lightService.updateState(this.houseId, {
      bri: brightness,
      transitiontime: transitionTime
    }).then(() => {
      this.state.bri = brightness;
    });
  }

  public setRgbColor(red: number, green: number, blue: number, duration: number = Light.DEFAULT_TRANSITION_TIME): Promise<void> {
    const xy: number[] = ColorConverterService.calculateXY(red, green, blue, this.modelId);
    return this.setColor(xy[0], xy[1], duration);
  }

  public setColor(x: number, y: number, duration: number = Light.DEFAULT_TRANSITION_TIME): Promise<void> {
    return this.lightService.updateState(this.houseId, {
      xy: [x, y]
    }).then(() => {
      this.state.xy = [x, y];
    });
  }

  public saveState(): boolean {
    this.previousState = Object.assign({}, this.state);
    return true;
  }

  public restorePreviousState(): Promise<void> {
    if (!this.previousState) {
      throw new Error('No previous state was saved');
    }

    const state: LightState = Object.assign({}, this.previousState);

    return this.lightService.updateState(this.houseId, {
      on: state.on,
      bri: state.bri,
      xy: state.xy,
    }).then(() => {
      this.state = state;
      this.previousState = undefined;
    });
  }
}
