import { FC, MouseEventHandler, PointerEventHandler, useState } from "react";

type Props = {
  imageUrl: string;
  index: number;
  onFullScreen: () => void;
};

export const DownloadableImage: FC<Props> = ({
  imageUrl,
  index,
  onFullScreen,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleClick: MouseEventHandler = (event) => {
    setIsFullScreen(!isFullScreen);
    onFullScreen();
  };

  return (
    <button onClick={handleClick} className="image-button">
      <img
        src={imageUrl}
        alt={`Frame number ${index + 1}`}
        className={["image", isFullScreen ? "image--full-screen" : null]
          .filter(Boolean)
          .join(" ")}
      />
    </button>
  );
};
