import type { Vec2 } from "../../utils/types";

// MediaPipe Tasks Vision – Face Landmarker (modern API)
// https://developers.google.com/mediapipe/solutions/vision/face_landmarker/web_js

export class FaceTracker {
  private landmarker?: any;
  private active = false;
  private landmarks: Vec2[] | null = null; // normalized [0..1]

  async init(): Promise<void> {
    const vision = await import('@mediapipe/tasks-vision');
    const FilesetResolver = (vision as any).FilesetResolver;
    const FaceLandmarker = (vision as any).FaceLandmarker;
    const fileset = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm'
    );
    this.landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      outputFaceBlendshapes: false,
      runningMode: 'VIDEO',
      numFaces: 1
    });
  }

  async start(video: HTMLVideoElement): Promise<void> {
    if (!this.landmarker) await this.init();
    this.active = true;
    const loop = () => {
      if (!this.active) return;
      const ts = performance.now();
      const res = this.landmarker!.detectForVideo(video, ts);
      const lm = res?.faceLandmarks?.[0];
      if (lm && lm.length) {
        this.landmarks = lm.map((p: any) => ({ x: p.x, y: p.y }));
      } else {
        this.landmarks = null;
      }
      // Throttle tracking to ~20 fps for perf
      setTimeout(loop, 50);
    };
    loop();
  }

  stop(): void { this.active = false; }
  getLandmarks(): Vec2[] | null { return this.landmarks; }
}
