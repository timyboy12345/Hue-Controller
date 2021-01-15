export interface HubConfig {
  name: string;
  zigbeechannel: number;
  bridgeid: string;
  mac: string;
  dhcp: boolean;
  ipaddress: string;
  netmask: string;
  gateway: string;
  proxyaddress: string;
  proxyport: number;
  UTC: string;
  localtime: string;
  timezone: string;
  modelid: string;
  datastoreversion: string;
  swversion: string;
  apiversion: string;
  swupdate: {
    updatestate: number,
    checkforupdate: boolean,
    devicetypes: {
      bridge: boolean,
      lights: [],
      sensors: []
    },
    url: string,
    text: string,
    notify: boolean
  };
  swupdate2: {
    checkforupdate: boolean,
    lastchange: string,
    bridge: {
      state: string,
      lastinstall: string
    },
    state: string,
    autoinstall: {
      updatetime: string,
      on: boolean
    }
  };
  linkbutton: boolean;
  portalservices: boolean;
  portalconnection: string;
  portalstate: {
    signedon: boolean,
    incoming: boolean,
    outgoing: boolean,
    communication: string
  };
  internetservices: {
    internet: string,
    remoteaccess: string,
    time: string,
    swupdate: string
  };
  factorynew: boolean;
  replacesbridgeid: null;
  backup: {
    status: string,
    errorcode: 0
  };
  starterkitid: string;
  whitelist: { [key: string]: HubUser };
  users?: HubUser[];
}

export interface HubUser {
  id: string;
  'last use date': string;
  'create date': string;
  'name': string;
}
