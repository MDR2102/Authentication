import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { useAuth } from "../../hooks/useAuth";
import { ILoginPayload, IApiResponse } from "../../interfaces/auth.interface";
import { ROUTES, VALIDATION_MESSAGES, APP_NAME } from "../../constants";
import "./Auth.scss";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginPayload>();

  const onSubmit = async (data: ILoginPayload) => {
    try {
      await login(data);
      toast.success("Logged in successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;
      toast.error(axiosError.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{APP_NAME}</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={errors.email ? "error" : ""}
              {...register("email", {
                required: VALIDATION_MESSAGES.EMAIL_REQUIRED,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: VALIDATION_MESSAGES.EMAIL_INVALID,
                },
              })}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={errors.password ? "error" : ""}
              {...register("password", {
                required: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
              })}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link to={ROUTES.REGISTER}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
