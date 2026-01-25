import { useContext } from "react";
import { DataContext } from "./DataContext";

// Custom hook to use Data context
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("usedata must be used within an DataProvider");
  }
  return context;
}
