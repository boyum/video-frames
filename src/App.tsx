// @ts-check

import { ChangeEvent, useEffect, useState } from "react";
import { Grid } from "react-loader-spinner";
import "./styles.css";
import { VideoToFrames } from "./VideoToFrame";
import { DownloadableImage } from "./DownloadableImage";

type Status = "IDLE" | "LOADING";

export default function App() {
  const [images, setImages] = useState<Array<string>>([]);
  const [status, setStatus] = useState<Status>("IDLE");
  const [showBackdrop, setShowBackdrop] = useState(false);

  async function onInput(event: ChangeEvent<HTMLInputElement>) {
    setImages([]);
    setStatus("LOADING");

    const [file] = Array.from(event.target.files);
    const fileUrl = URL.createObjectURL(file);
    const frames = await VideoToFrames.getFrames(fileUrl, 30, "TotalFrames");

    setStatus("IDLE");
    setImages(frames);
  }

  const toggleBackdrop = () => {
    if (showBackdrop) {
      document.body.classList.remove("overflow-hidden");
    } else {
      document.body.classList.add("overflow-hidden");
    }

    setShowBackdrop(!showBackdrop);
  };

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
            <DownloadableImage
              key={imageUrl}
              imageUrl={imageUrl}
              index={index}
              onFullScreen={toggleBackdrop}
            />
          ))}
        </div>
      ) : (
        <>
          <p className="description">
            Upload a video, then click the images you want to download!
          </p>
          <p className="notice">
            <strong>Note:</strong> The video stays safely on your device. It's
            never actually uploaded anywhere. You can test this by opening this
            site, then disconnect from the internet before you start using it.
          </p>
        </>
      )}

      <div className="backdrop" hidden={!showBackdrop} />
    </div>
  );
}
