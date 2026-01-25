import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme from localStorage on app load
const initializeTheme = () => {
  const stored = localStorage.getItem("theme") || "dark";
  const htmlElement = document.documentElement;
  htmlElement.classList.remove("light", "dark");
  htmlElement.classList.add(stored);
  htmlElement.setAttribute("data-theme", stored);
};

initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
