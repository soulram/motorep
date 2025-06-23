import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  nom: string;
  email: string;
  role: 'admin' | 'mecanicien' | 'receptionniste';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (localStorage, token, etc.)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        console.error('Login failed:', response.statusText);
        return false;
      }

      const userData = await response.json();

      // Assuming your backend returns user data with id, nom, and role
      const authenticatedUser: User = {
        id: userData.id || 'unknown', // Provide a fallback or handle missing ID
        nom: userData.nom || 'Utilisateur', // Provide a fallback or handle missing name
        email: email, // Use the email provided for login
        role: userData.role || 'mecanicien' as const // Provide a fallback or handle missing role
      };

      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};