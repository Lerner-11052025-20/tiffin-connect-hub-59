import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api, { getToken, setToken, removeToken } from "@/lib/api";

type AppRole = "user" | "vendor" | "admin";

interface AuthUser {
  id: string;
  user_id: string;
  email: string;
  role: AppRole;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  session: { user: AuthUser } | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setAuthUser: (user: AuthUser, token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signOut: async () => {},
  setAuthUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage token
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<{ user: AuthUser }>("/auth/me")
      .then(({ user: u }) => {
        setUser(u);
      })
      .catch(() => {
        removeToken(); // invalid or expired token
      })
      .finally(() => setLoading(false));
  }, []);

  const setAuthUser = (u: AuthUser, token: string) => {
    setToken(token);
    setUser(u);
  };

  const signOut = async () => {
    removeToken();
    setUser(null);
  };

  const role = user?.role ?? null;
  const session = user ? { user } : null;

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
