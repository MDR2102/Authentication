import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import { ROUTES } from "../constants";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <p>Loading...</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.LOGIN} replace />}
        />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
