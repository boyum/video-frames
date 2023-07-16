// @ts-check

import { useState } from "react";
import { Grid } from "react-loader-spinner";
import "./styles.css";
import { VideoToFrames, VideoToFramesEnum } from "./VideoToFrame";

export default function App() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("IDLE");

  /**
   * @param {import('react').ChangeEvent<HTMLInputElement>} event
   */
  async function onInput(event) {
    setImages([]);
    setStatus("LOADING");

    const [file] = Array.from(event.target.files);
    const fileUrl = URL.createObjectURL(file);
    const frames = await VideoToFrames.getFrames(
      fileUrl,
      30,
      VideoToFramesEnum.TotalFrames,
    );

    setStatus("IDLE");
    setImages(frames);
  }

  const now = new Date().toDateString();

  return (
    <div className="container">
      <h1>Get the frames from your video&nbsp;🎞</h1>
      <label>
        {status === "IDLE" ? (
          "Choose file"
        ) : (
          <Grid color="#00BFFF" height={100} width={100} />
        )}
        <input
          type="file"
          className="visually-hidden"
          accept="video/*"
          onChange={(event) => onInput(event)}
        />
      </label>

      {images?.length > 0 ? (
        <div className="output">
          {images.map((imageUrl, index) => (
            <a
              key={imageUrl}
              href={imageUrl}
              download={`${now}-${index + 1}.png`}
            >
              <span className="visually-hidden">
                Download image number {index + 1}
              </span>
              <img src={imageUrl} alt="" />
            </a>
          ))}
        </div>
      ) : (
        <>
          <p>Upload a video, then click the images you want to download!</p>
          <p className="notice">
            <strong>Note:</strong> The video stays safely on your device. It's
            never actually uploaded anywhere. You can test this by opening this
            site, then disconnect from the internet before you start using it.
          </p>
        </>
      )}
    </div>
  );
}
