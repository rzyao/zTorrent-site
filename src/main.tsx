
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import "./index.css";
import { setupAxiosInterceptors } from './api/axiosInterceptors';
import { initOpenAPI } from './api/setup';

setupAxiosInterceptors();

import { QueryProvider } from "./providers/QueryProvider";

initOpenAPI().then(() => {
    createRoot(document.getElementById("root")!).render(
        <QueryProvider>
            <App />
        </QueryProvider>
    );
});
