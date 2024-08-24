import isIOS from "is-ios";

export class VideoToFrames {
  private static numberOfExtractedFramesPerSecond = 5;

  private onProgress: (progress: number) => void;
  private _progress = 0;

  private get progress(): number {
    return this._progress;
  }

  private set progress(progress: number) {
    this.onProgress(progress);
    this._progress = progress;
  }

  constructor({ onProgress }: { onProgress: (progress: number) => void }) {
    this.onProgress = onProgress;
  }

  /**
   * Extracts frames from the video and returns them as an array of imageData
   *
   * @param videoUrl url to the video file (html5 compatible format) eg: mp4
   */
  getFrames(videoUrl: string): Promise<Array<string>> {
    this.progress = 0;

    return new Promise<Array<string>>(resolve => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("2d context not supported");
      }

      const video = document.createElement("video");
      video.preload = "auto";

      const frames: Array<string> = [];
      let duration: number;

      video.addEventListener("loadeddata", async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        duration = video.duration;

        const totalFrames =
          duration * VideoToFrames.numberOfExtractedFramesPerSecond;

        for (let time = 0; time < duration; time += duration / totalFrames) {
          frames.push(
            await VideoToFrames.getVideoFrame(video, context, canvas, time),
          );

          this.progress = Math.round((time / duration) * 100);
        }

        if (isIOS) {
          frames.splice(0, 1);
        }

        resolve(frames);
      });

      video.src = videoUrl;
      video.load();
    });
  }

  static getVideoFrame(
    video: HTMLVideoElement,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number,
  ): Promise<string> {
    return new Promise<string>(resolve => {
      video.addEventListener(
        "seeked",
        () => {
          VideoToFrames.storeFrame(video, context, canvas, resolve);
        },
        {
          once: true,
        },
      );

      video.currentTime = time;
    });
  }

  static storeFrame(
    video: HTMLVideoElement,
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    resolve: (value: string) => void,
  ) {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    resolve(canvas.toDataURL());
  }
}
