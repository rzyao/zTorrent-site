
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import "./index.css";
// import "./index1.css";
import { setupAxiosInterceptors } from './api/axiosInterceptors';

setupAxiosInterceptors();

import { QueryProvider } from "./providers/QueryProvider";

createRoot(document.getElementById("root")!).render(
    <QueryProvider>
        <App />
    </QueryProvider>
);
