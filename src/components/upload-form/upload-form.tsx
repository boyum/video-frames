import type { ChangeEvent, FC } from "react";
import styles from "./upload-form.module.css";

type Props = {
  onInput: (event: ChangeEvent<HTMLInputElement>) => void;
  progress: number;
  status: "IDLE" | "LOADING";
};

export const UploadForm: FC<Props> = ({ onInput, progress, status }) => {
  return (
    <label className={styles.container}>
      {status === "IDLE"
        ? "Choose file"
        : progress > 0 && (
            <progress
              className={styles.progress}
              value={progress}
              max="100"
              hidden={progress > 99}
            />
          )}
      <input
        type="file"
        className="visually-hidden"
        accept="video/*"
        onChange={event => onInput(event)}
      />
    </label>
  );
};
