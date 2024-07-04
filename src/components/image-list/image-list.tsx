import type { FC } from "react";
import { Image } from "../image/image";
import styles from "./image-list.module.css";

type Props = {
  imageUrls: Array<string>;
};

export const ImageList: FC<Props> = ({ imageUrls }) => {
  return (
    <div className={styles.images}>
      {imageUrls.map((imageUrl, index) => (
        <Image key={imageUrl} imageUrl={imageUrl} index={index} />
      ))}
    </div>
  );
};
