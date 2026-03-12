import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { useAuth } from "../../hooks/useAuth";
import {
  IRegisterPayload,
  IApiResponse,
} from "../../interfaces/auth.interface";
import { ROUTES, VALIDATION_MESSAGES, APP_NAME } from "../../constants";
import "./Auth.scss";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterPayload>();

  const onSubmit = async (data: IRegisterPayload) => {
    try {
      await registerUser(data);
      toast.success("Account created successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;
      toast.error(axiosError.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{APP_NAME}</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              className={errors.firstName ? "error" : ""}
              {...register("firstName", {
                required: VALIDATION_MESSAGES.FIRST_NAME_REQUIRED,
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              className={errors.lastName ? "error" : ""}
              {...register("lastName", {
                required: VALIDATION_MESSAGES.LAST_NAME_REQUIRED,
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName.message}</span>
            )}
          </div>

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
                minLength: {
                  value: 8,
                  message: VALIDATION_MESSAGES.PASSWORD_MIN,
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message: VALIDATION_MESSAGES.PASSWORD_PATTERN,
                },
              })}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to={ROUTES.LOGIN}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
