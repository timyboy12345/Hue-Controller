export interface ILight {
  state: LightState;
  swupdate: LightSwUpdate;
  type: string;
  name: string;
  modelid: string;
  manufacturername: string;
  productname: string;
  capabilities: LightCapabilities;
  config: LightConfig;
  uniqueid: string;
  swversion: number;
  swconfigid: string;
  productid: string;
}

export interface LightState {
  on: boolean;
  bri: number;
  hue: number;
  sat: number;
  effect: string;
  xy: number[];
  ct: number;
  alert: string;
  colormode: string;
  mode: string;
  reachable: boolean;
}

export interface LightSwUpdate {
  state: string;
  lastinstall: string;
}

export interface LightCapabilities {
  certified: boolean;
  control: {
    mindimlevel: number;
    maxlumen: number;
    colorgamuttype: string;
    colorgamut: number[][];
    ct: {
      min: number;
      max: number
    }
  };
  streaming: {
    renderer: boolean;
    proxy: boolean
  };
}

export interface LightConfig {
  archetype: string;
  function: string;
  direction: string;
  startup: {
    mode: string;
    configured: boolean
  };
  expanded: boolean;
}
