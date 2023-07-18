import { useContext } from "react";
import { BackdropContext } from "../contexts/backdrop-context";

export const useBackdrop = () => {
  return useContext(BackdropContext);
};
