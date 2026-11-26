import { createContext, useContext } from "react";

/** True when scenes render for the PDF export: show final, fully revealed states. */
export const PrintMode = createContext(false);
export const usePrintMode = () => useContext(PrintMode);
