import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/Routes";
import "./styles/global.scss";

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
