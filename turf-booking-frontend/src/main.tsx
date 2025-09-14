import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./Main.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import { ErrorBoundary } from "react-error-boundary";
// Define props type for ErrorFallback
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Fallback component for errors
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
