// @ts-check

import * as isIOS from "is-ios";

export class VideoToFrames {
  /**
   * Extracts frames from the video and returns them as an array of imageData
   * @param videoUrl url to the video file (html5 compatible format) eg: mp4
   * @param amount number of frames per second or total number of frames that you want to extract
   * @param type The method of extracting frames: Number of frames per second of video or the total number of frames across the whole video duration. Defaults to fps
   */
  static getFrames(
    videoUrl: string,
    amount: number,
    type: "FPS" | "TotalFrames" = "FPS",
  ): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve) => {
      let frames: Array<string> = [];
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      let duration: number;
      let video = document.createElement("video");
      video.preload = "auto";

      video.addEventListener("loadeddata", async function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        duration = video.duration;
        let totalFrames = amount;

        if (type === "FPS") {
          totalFrames = duration * amount;
        }

        for (let time = 0; time < duration; time += duration / totalFrames) {
          frames.push(
            await VideoToFrames.getVideoFrame(video, context, canvas, time),
          );
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
    return new Promise<string>((resolve) => {
      let eventCallback = () => {
        video.removeEventListener("seeked", eventCallback);
        this.storeFrame(video, context, canvas, resolve);
      };

      video.addEventListener("seeked", eventCallback);
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
