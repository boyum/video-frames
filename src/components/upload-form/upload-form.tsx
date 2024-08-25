import type { ChangeEvent, FC } from "react";
import styles from "./upload-form.module.css";

type Props = {
  onInput: (event: ChangeEvent<HTMLInputElement>) => void;
  /** A number between 0 and 100 */
  progress: number;
  status: "IDLE" | "LOADING";
};

export const UploadForm: FC<Props> = ({ onInput, progress, status }) => {
  return (
    <label className={styles.container}>
      {status === "IDLE" ? (
        "Choose file"
      ) : (
        <progress className={styles.progress} value={progress} max="100" />
      )}
      <input
        type="file"
        className="visually-hidden"
        accept="video/*"
        onChange={event => {
          const newFileWasAdded =
            event.currentTarget.files && event.currentTarget.files.length > 0;

          // Only trigger the onInput callback if a new file was added.
          // If not, `onInput` will be called with an empty file list
          // (for instance if the user opens the file selector but cancels).
          // This would clear the image list for the previous upload,
          // which is not what we want.
          if (newFileWasAdded) {
            onInput(event);
          }
        }}
      />
    </label>
  );
};
