import { FC, MouseEventHandler, useState } from "react";
import { useBackdrop } from "../../hooks/use-backdrop";
import classes from "./image.module.css";

type Props = {
  imageUrl: string;
  index: number;
};

export const Image: FC<Props> = ({ imageUrl, index }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [, setShowBackdrop] = useBackdrop();

  const handleClick: MouseEventHandler = () => {
    const isOpeningFullscreen = !isFullScreen;

    setIsFullScreen(isOpeningFullscreen);
    setShowBackdrop(isOpeningFullscreen);
  };

  return (
    <button onClick={handleClick} className={classes.button}>
      <img
        src={imageUrl}
        alt={`Frame number ${index + 1}`}
        className={[classes.image, isFullScreen ? classes.fullScreen : null]
          .filter(Boolean)
          .join(" ")}
      />
    </button>
  );
};
