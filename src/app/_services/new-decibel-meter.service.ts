import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewDecibelMeterService {
  private sourcesReady = false;
  private sources: any[] = [];
  private source: any;
  private sourcesIndex: any = {};
  private connected = false;
  private listening = false;
  private connection?: Connection;

  public supportsMicrophoneInput: boolean;

  constructor() {
    // user media
    if (!navigator.getUserMedia) {
      // @ts-ignore
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    if (!this.supportsAudioInput()) {
      this.supportsMicrophoneInput = false;
      return;
    }

    this.supportsMicrophoneInput = true;
    const newDecibelMeterService = this;

    navigator.mediaDevices.enumerateDevices().then(sources => {
      sources.forEach((source) => {
        if (source.kind === 'audioinput') {
          newDecibelMeterService.sources.push(source);
          newDecibelMeterService.sourcesIndex[source.deviceId] = source;
        }
      });

      this.sourcesReady = true;

      this.startLoop();
    });
  }

  private supportsAudioInput(): boolean {
    if (!navigator.getUserMedia) {
      return false;
      // throw new Error('DecibelMeter: getUserMedia not supported');
    }

    // audio context
    // window.AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!window.AudioContext) {
      return false;
      // throw new Error('DecibelMeter: AudioContext not supported');
    }

    // audio sources
    if (!navigator.mediaDevices) {
      return false;
      // throw new Error('DecibelMeter: MediaStreamTrack not supported');
    }

    if (!navigator.mediaDevices.enumerateDevices) {
      return false;
      // throw new Error('DecibelMeter: mediaDevices.enumerateDevices() not supported');
    }

    return true;
  }

  // util
  private connectTo(source: MediaDeviceInfo, callback: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const newDecibelMeterService = this;

      const oldSource = this.source;
      const constraints: MediaStreamConstraints = {audio: {deviceId: source.deviceId}};

      this.source = source;

      function success(stream: MediaStream): void {
        const audioContext = new AudioContext();

        const connection: Connection = {
          stream: stream.getTracks()[0],
          context: audioContext,
          source: audioContext.createMediaStreamSource(stream),
          analyser: audioContext.createAnalyser(),
          lastSample: new Uint8Array(1),
        };

        newDecibelMeterService.connection = connection;
        newDecibelMeterService.connected = true;

        if (callback) {
          callback.call(connection, stream);
        }

        newDecibelMeterService.connection = connection;

        newDecibelMeterService.sourceChanged(oldSource, source);

        resolve(true);

        // if (changing && meter.handle.sourceChange) {
        //   newDecibelMeterService.dispatch(meter, 'source-change', [source, oldSource, meter]);
        // }

        // if (meter.handle.connect) {
        //   newDecibelMeterService.dispatch(meter, 'connect', [meter, source]);
        // }
      }

      function error(): void {
        alert('Error connecting to source');
        reject(false);
      }

      navigator.getUserMedia(constraints, success, error);
    });
  }

  public getSources(): MediaDeviceInfo[] {
    return this.sources;
  }

  public connectToId(source: string, callback: any): Promise<boolean> {
    return this.connect(source, callback);
  }

  private connect(source: string, callback: any): Promise<boolean> {
    let realSource;

    if (!this.sourcesReady) {
      throw new Error('DecibelMeter: Audio sources not ready');
    }

    if (source == null) {
      throw new Error('DecibelMeter: No audio source specified');
    }

    realSource = this.sourcesIndex[source];

    if (realSource == null) {
      throw new Error('DecibelMeter: Attempted to select invalid audio source');
    }

    if (this.source === realSource) {
      console.log('Already connected to this source!');
      return Promise.reject();
    }

    return this.connectTo(realSource, callback);
  }

  private sourceChanged(oldSource: any, newSource: any): void {
    console.log('Source changed!');
  }

  public disconnect(): void {
    if (this.connection == null) {
      return;
    }

    this.stopListening();

    this.connection.stream.stop();
    this.connection = undefined;
    this.source = null;

    return;
  }

  public listen(): void {
    if (this.listening) {
      console.log('Already listening to this source!');
      return;
    }

    if (this.source == null) {
      throw new Error('DecibelMeter: No source selected');
    }

    if (this.connection == null) {
      throw new Error('DecibelMeter: Not connected to source');
    }

    this.connection.source.connect(this.connection.analyser);
    this.listening = true;
  }

  public stopListening(): void {
    if (!this.listening) {
      return;
    }

    if (this.source == null) {
      throw new Error('DecibelMeter: No source selected');
    }

    if (this.connection == null) {
      throw new Error('DecibelMeter: Not connected to source');
    }

    this.connection.source.disconnect(this.connection.analyser);
    this.listening = false;
  }

  private startLoop(): void {
    const newDecibelMeterService = this;

    function update(): void {
      if (newDecibelMeterService.listening && newDecibelMeterService.connection) {
        newDecibelMeterService.connection.analyser.getByteFrequencyData(newDecibelMeterService.connection.lastSample);

        console.log(newDecibelMeterService.connection.analyser.minDecibels);
        console.log(newDecibelMeterService.connection.analyser.maxDecibels);

        const value = newDecibelMeterService.connection.lastSample[0];
        const percent = value / 255;
        const dB = newDecibelMeterService.connection.analyser.minDecibels + ((newDecibelMeterService.connection.analyser.maxDecibels - newDecibelMeterService.connection.analyser.minDecibels) * percent);

        console.log(`DB: ${dB} / Percent: ${percent}`);
        // dispatch(meter, 'sample', [dB, percent, value]);
      }

      requestAnimationFrame(update);
    }

    update();
  }

  // DecibelMeter.prototype.on = function (eventName, handler) {
  //   if (this.handle[eventName] === undefined) return this;
  //   this.handle[eventName].push(handler);
  //   return this;
  // };


  // api

  // return {
  //   create: function (id, opts) {
  //     id = id || ['db', new Date().getTime(), Math.random()].join('-');
  //     var meter = new DecibelMeter(id, opts || {});
  //     metersIndex[id] = meter;
  //     meters.push(meter);
  //     return meter;
  //   },
  //
  //   getMeterById: function (id) {
  //     return metersIndex[id] || null;
  //   },
  //
  //   getMeters: function () {
  //     return meters;
  //   }
  // }
}

export interface Connection {
  lastSample: Uint8Array;
  analyser: AnalyserNode;
  source: MediaStreamAudioSourceNode;
  context: AudioContext;
  stream: MediaStreamTrack;
}
