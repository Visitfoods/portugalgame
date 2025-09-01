export class CameraFeed {
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  async startFrontCamera(constraints: MediaStreamConstraints = {}): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 },
        ...constraints.video as any,
      },
      audio: false,
      ...constraints,
    });
    this.video.srcObject = stream;
    await this.video.play();
    return stream;
  }

  stop(): void {
    const stream = this.video.srcObject as MediaStream | null;
    if (stream) {
      for (const t of stream.getTracks()) t.stop();
      this.video.srcObject = null;
    }
  }

  element(): HTMLVideoElement { return this.video; }
}

