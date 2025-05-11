import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create the root renderer
const root = createRoot(document.getElementById("root")!);

// Render with App component (which now has all providers) 
root.render(<App />);
