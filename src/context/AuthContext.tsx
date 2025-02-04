import { createContext, useState, ReactNode, useEffect } from "react";

interface User {
  username: string;
  role: "ADMIN" | "CUSTOMER";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Función de login
  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === "admin" && password === "admin123") {
      const adminUser: User = { username: "admin", role: "ADMIN" };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return true;
    }

    try {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (!data || !data.token) return false;

      const customerUser: User = { username, role: "CUSTOMER" };
      setUser(customerUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(customerUser));
      localStorage.setItem("token", data.token); // Guardar token

      return true;
    } catch (error) {
      console.error("Error en la autenticación:", error);
      return false;
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Eliminar token al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
