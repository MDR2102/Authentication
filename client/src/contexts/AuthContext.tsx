import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

import { authService } from "../services/auth";
import { IAuthState, IUser } from "../interfaces/auth.interface";

interface AuthContextType extends IAuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: IUser; accessToken: string } }
  | { type: "CLEAR_USER" };

const authReducer = (state: IAuthState, action: AuthAction): IAuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: IAuthState = {
  user: null,
  accessToken:
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessToken")
      : null,
  isAuthenticated: false,
  isLoading: true,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") return;

      const token = window.localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await authService.getProfile();
          if (response.success && response.data) {
            dispatch({
              type: "SET_USER",
              payload: { user: response.data, accessToken: token },
            });
          } else {
            dispatch({ type: "CLEAR_USER" });
            window.localStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");
          }
        } catch {
          dispatch({ type: "CLEAR_USER" });
          window.localStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        const { user, tokens } = response.data;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("accessToken", tokens.accessToken);
          window.localStorage.setItem("refreshToken", tokens.refreshToken);
        }

        dispatch({
          type: "SET_USER",
          payload: { user, accessToken: tokens.accessToken },
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
      });

      if (response.success && response.data) {
        const { user, tokens } = response.data;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("accessToken", tokens.accessToken);
          window.localStorage.setItem("refreshToken", tokens.refreshToken);
        }

        dispatch({
          type: "SET_USER",
          payload: { user, accessToken: tokens.accessToken },
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      console.error("Logout error:");
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
      }
      dispatch({ type: "CLEAR_USER" });
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      if (response.success && response.data) {
        const { accessToken, refreshToken } = response.data;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("accessToken", accessToken);
          window.localStorage.setItem("refreshToken", refreshToken);
        }

        dispatch({
          type: "SET_USER",
          payload: { user: state.user!, accessToken },
        });
      } else {
        await logout();
      }
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
