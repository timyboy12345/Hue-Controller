import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DecibelService {
  private clipLevel = 0.98;
  private clipping = false;
  private lastClip?: number;

  constructor() {
  }

  public supportsAudioInput(): boolean {
    return !(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices);
  }

  public supportsPermissions(): boolean {
    return !(!navigator.permissions);
  }

  public getSources(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices();
  }

  public hasDevicesPermission(): Promise<boolean> {
    return navigator.permissions.query({name: 'microphone'}).then((value) => {
      switch (value.state) {
        case 'denied':
        case 'prompt':
        default:
          return false;
        case 'granted':
          return true;
      }
    });
  }

  public async getSourcesPermission(): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: false,
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  public async getAudioMeter(): Promise<AudioContext | MediaStream> {
    return this.getSourcesPermission().then(source => {
      // @ts-ignore
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      const context = new AudioContext();
      context.createMediaStreamSource(source);
      this.createAudioMeter(context);

      return context;
    });
  }

  private createAudioMeter(audioContext: AudioContext): ScriptProcessorNode {
    const processor = audioContext.createScriptProcessor(512);
    // processor.onaudioprocess = this.volumeAudioProcess;
    processor.addEventListener('audioprocess', this.volumeAudioProcess);
    // processor.channelCount = 1;

    processor.connect(audioContext.destination);

    window.setTimeout(() => {
      processor.disconnect();
    }, 10000);

    return processor;
  }

  private volumeAudioProcess(event: any): void {

    const buf = event.inputBuffer.getChannelData(0);
    const bufLength = buf.length;
    let sum = 0;
    let x;

    // Do a root-mean-square on the samples: sum up the squares...
    for (let i = 0; i < bufLength; i++) {
      x = buf[i];
      if (Math.abs(x) >= this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
      }
      sum += x * x;
    }

    // ... then take the square root of the sum.
    const rms = Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    // this.volume = Math.max(rms, this.volume * this.averaging);
    console.log(Math.max(rms, 0));
    // console.log(event);
  }
}
