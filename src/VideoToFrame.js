// @ts-check

import isIOS from "is-ios";

export var VideoToFramesEnum;
(function (VideoToFramesMethod) {
  VideoToFramesMethod[(VideoToFramesMethod["Fps"] = 0)] = "Fps";
  VideoToFramesMethod[(VideoToFramesMethod["TotalFrames"] = 1)] = "TotalFrames";
})(VideoToFramesEnum || (VideoToFramesEnum = {}));

export class VideoToFrames {
  /**
   * Extracts frames from the video and returns them as an array of imageData
   * @param {string} videoUrl url to the video file (html5 compatible format) eg: mp4
   * @param {number} amount number of frames per second or total number of frames that you want to extract
   * @param {"FPS" | "TotalFrames"} type The method of extracting frames: Number of frames per second of video or the total number of frames across the whole video duration. Defaults to fps
   */
  static getFrames(videoUrl, amount, type = VideoToFramesEnum.Fps) {
    return new Promise((resolve) => {
      let frames = [];
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      let duration;
      let video = document.createElement("video");
      video.preload = "auto";

      video.addEventListener("loadeddata", async function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        duration = video.duration;
        let totalFrames = amount;

        if (type === VideoToFramesEnum.Fps) {
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

  static getVideoFrame(video, context, canvas, time) {
    return new Promise((resolve) => {
      let eventCallback = () => {
        video.removeEventListener("seeked", eventCallback);
        this.storeFrame(video, context, canvas, resolve);
      };
      video.addEventListener("seeked", eventCallback);
      video.currentTime = time;
    });
  }

  static storeFrame(video, context, canvas, resolve) {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    resolve(canvas.toDataURL());
  }
}
