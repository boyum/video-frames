import { ChangeEvent, useRef, useState } from "react";

import { BackdropContext } from "../contexts/backdrop-context";
import "../styles.css";
import { VideoToFrames } from "../utils/video-to-frame";
import { ImageList } from "./image-list/image-list";
import { UploadForm } from "./upload-form/upload-form";

type Status = "IDLE" | "LOADING";

export default function App() {
  const [images, setImages] = useState<Array<string>>([]);
  const [status, setStatus] = useState<Status>("IDLE");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [progress, setProgress] = useState(0);

  const VTF = useRef(new VideoToFrames({ onProgress: setProgress }));

  async function onInput(event: ChangeEvent<HTMLInputElement>) {
    setImages([]);
    setStatus("LOADING");

    const [file] = Array.from(event.target.files ?? []);
    const fileUrl = URL.createObjectURL(file);
    const frames = await VTF.current.getFrames(fileUrl, 30, "TotalFrames");

    setStatus("IDLE");
    setImages(frames);
  }

  // const toggleBackdrop = () => {
  //   if (showBackdrop) {
  //     document.body.classList.remove("overflow-hidden");
  //   } else {
  //     document.body.classList.add("overflow-hidden");
  //   }

  //   setShowBackdrop(!showBackdrop);
  // };

  return (
    <BackdropContext.Provider value={[showBackdrop, setShowBackdrop]}>
      <div className="page">
        <div className="container">
          <h1>Get the frames from your video&nbsp;🎞</h1>
          <UploadForm onInput={onInput} progress={progress} status={status} />

          {images?.length > 0 ? (
            <ImageList imageUrls={images} />
          ) : (
            <>
              <p className="description">
                Upload a video, then click the images you want to download!
              </p>
              <p className="notice">
                <strong>Note:</strong> The video stays safely on your device.
                It's never actually uploaded anywhere. You can test this by
                opening this site, then disconnect from the internet before you
                start using it.
              </p>
            </>
          )}
        </div>

        <footer>
          <p>
            Made with ❤️ by <a href="https://sinre.dev">Sindre</a>.
            <br />
            <a href="https://github.com/boyum/video-frames">
              Source code on GitHub
            </a>
            .
          </p>
        </footer>
      </div>

      <div className="backdrop" hidden={!showBackdrop} />
    </BackdropContext.Provider>
  );
}
