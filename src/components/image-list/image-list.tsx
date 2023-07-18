import { FC } from "react";
import { Image } from "../image/image";
import classes from "./image-list.module.css";

type Props = {
  imageUrls: Array<string>;
};

export const ImageList: FC<Props> = ({ imageUrls }) => {
  return (
    <div className={classes.images}>
      {imageUrls.map((imageUrl, index) => (
        <Image key={imageUrl} imageUrl={imageUrl} index={index} />
      ))}
    </div>
  );
};
