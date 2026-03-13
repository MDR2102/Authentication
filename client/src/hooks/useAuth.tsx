import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

import {
  IUser,
  IAuthState,
  ILoginPayload,
  IRegisterPayload,
} from "../interfaces/auth.interface";
import { authService } from "../services/auth";
import { setAccessToken } from "../services/apiClient";

interface AuthContextType extends IAuthState {
  login: (payload: ILoginPayload) => Promise<void>;
  register: (payload: IRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<IAuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const setAuth = (user: IUser, accessToken: string) => {
    setAccessToken(accessToken);
    setState({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const clearAuth = () => {
    setAccessToken(null);
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const login = useCallback(async (payload: ILoginPayload) => {
    const response = await authService.login(payload);
    if (response.success && response.data) {
      const { user, tokens } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      setAuth(user, tokens.accessToken);
    }
  }, []);

  const register = useCallback(async (payload: IRegisterPayload) => {
    const response = await authService.register(payload);
    if (response.success && response.data) {
      const { user, tokens } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      setAuth(user, tokens.accessToken);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Log error for debugging
      console.error("Logout error:");
    } finally {
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearAuth();
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          user: response.data as IUser,
          isLoading: false,
        }));
      }
    } catch {
      clearAuth();
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      // Check for stored tokens in localStorage
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedAccessToken && storedRefreshToken) {
        try {
          // Set the access token for API calls
          setAccessToken(storedAccessToken);

          // Get user profile with stored token
          const profileResponse = await authService.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setState({
              user: profileResponse.data as IUser,
              accessToken: storedAccessToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        } catch {
          // If profile fails, try to refresh token
          try {
            const tokenResponse = await authService.refreshToken();
            if (tokenResponse.success && tokenResponse.data) {
              const newAccessToken = tokenResponse.data.accessToken;
              const newRefreshToken = tokenResponse.data.refreshToken;

              // Update localStorage
              localStorage.setItem("accessToken", newAccessToken);
              localStorage.setItem("refreshToken", newRefreshToken);

              setAccessToken(newAccessToken);

              // Get user profile with new token
              const profileResponse = await authService.getProfile();
              if (profileResponse.success && profileResponse.data) {
                setState({
                  user: profileResponse.data as IUser,
                  accessToken: newAccessToken,
                  isAuthenticated: true,
                  isLoading: false,
                });
                return;
              }
            }
          } catch {
            // Token refresh failed, clear stored tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }
      }

      // No valid authentication found
      setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
