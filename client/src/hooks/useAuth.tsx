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
      setAuth(response.data.user, response.data.tokens.accessToken);
    }
  }, []);

  const register = useCallback(async (payload: IRegisterPayload) => {
    const response = await authService.register(payload);
    if (response.success && response.data) {
      setAuth(response.data.user, response.data.tokens.accessToken);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    clearAuth();
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
      try {
        const tokenResponse = await authService.refreshToken();
        if (tokenResponse.success && tokenResponse.data) {
          setAccessToken(tokenResponse.data.accessToken);
          setState((prev) => ({
            ...prev,
            accessToken: tokenResponse.data!.accessToken,
            isAuthenticated: true,
          }));

          const profileResponse = await authService.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setState((prev) => ({
              ...prev,
              user: profileResponse.data as IUser,
              isLoading: false,
            }));
            return;
          }
        }
      } catch {
        // Not authenticated
      }
      setState((prev) => ({ ...prev, isLoading: false }));
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
