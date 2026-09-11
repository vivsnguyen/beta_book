import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

document.getElementById("legacy-app")?.remove();
document.getElementById("tooltip")?.remove();

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
