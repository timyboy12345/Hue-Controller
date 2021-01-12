declare module 'test-decibel-meter' {
  export class DecibelMeter {
    public sources: Promise<any[]>;
    public static create(id: string): DecibelMeter;
  }
}
