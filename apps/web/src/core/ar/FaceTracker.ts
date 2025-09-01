import type { Vec2 } from "../../utils/types";

// MediaPipe FaceMesh integration (light wrapper)
// Loads from CDN for the model files to keep bundle small

type Results = {
  multiFaceLandmarks?: { x: number; y: number; z: number }[][]
}

export class FaceTracker {
  private faceMesh?: any;
  private active = false;
  private landmarks: Vec2[] | null = null; // normalized [0..1]
  private onResultsBound = this.onResults.bind(this);

  async init(): Promise<void> {
    // Dynamically import to avoid SSR/build issues
    const mp = await import('@mediapipe/face_mesh');
    const FaceMesh = (mp as any).FaceMesh;
    const FACE_MESH = new FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    FACE_MESH.setOptions({
      maxNumFaces: 1,
      selfieMode: true,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      modelComplexity: 0
    });
    FACE_MESH.onResults(this.onResultsBound);
    this.faceMesh = FACE_MESH;
  }

  private onResults(results: Results) {
    const lm = results.multiFaceLandmarks?.[0];
    if (!lm) {
      this.landmarks = null;
      return;
    }
    // Store normalized [0..1] coords, flip X for selfie if needed (MediaPipe already returns mirrored with selfieMode)
    this.landmarks = lm.map(p => ({ x: p.x, y: p.y }));
  }

  async start(video: HTMLVideoElement): Promise<void> {
    if (!this.faceMesh) await this.init();
    this.active = true;
    const loop = async () => {
      if (!this.active) return;
      await this.faceMesh!.send({ image: video });
      // Throttle to ~20fps processing
      setTimeout(loop, 50);
    };
    loop();
  }

  stop(): void {
    this.active = false;
  }

  getLandmarks(): Vec2[] | null { return this.landmarks; }
}

