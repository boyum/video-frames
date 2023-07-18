import { createContext } from "react";

export const BackdropContext = createContext<
  [boolean, (showBackdrop: boolean) => void]
>([false, () => {}]);
